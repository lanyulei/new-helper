use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut};
use std::sync::{Arc, Mutex};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    // 1. 创建菜单项
    let quit_i = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let show_i = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
    let hide_i = MenuItem::with_id(app, "hide", "隐藏窗口", true, None::<&str>)?;

    // 2. 构建菜单
    let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;

    // 3. 创建托盘图标并绑定菜单和事件
    let _tray = TrayIconBuilder::with_id("main-tray")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "hide" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.hide();
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { button_state, .. } = event {
                if button_state == tauri::tray::MouseButtonState::Up {
                    // 左键点击时显示窗口
                    if let Some(window) = tray.app_handle().get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
        })
        .build(app)?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 用于防抖，避免长按时多次触发
    let last_trigger = Arc::new(Mutex::new(std::time::Instant::now()));
    let last_trigger_clone = last_trigger.clone();
    tauri::Builder::default()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(move |app, shortcut, event| {
                    // 只在按下时触发，防止多次触发
                    if event.state != tauri_plugin_global_shortcut::ShortcutState::Pressed {
                        return;
                    }
                    if shortcut.mods == Modifiers::SHIFT && shortcut.key == Code::Space {
                        let mut last = last_trigger_clone.lock().unwrap();
                        let now = std::time::Instant::now();
                        // 100ms 内只触发一次
                        if now.duration_since(*last).as_millis() > 100 {
                            *last = now;
                            if let Some(window) = app.get_webview_window("main") {
                                match window.is_visible() {
                                    Ok(true) => {
                                        let _ = window.hide();
                                    }
                                    Ok(false) => {
                                        let _ = window.show();
                                        let _ = window.set_focus();
                                    }
                                    Err(_) => {
                                        let _ = window.show();
                                        let _ = window.set_focus();
                                    }
                                }
                            } else {
                                println!("[错误] 未找到 main 窗口，无法切换");
                            }
                        }
                    }
                })
                .build(),
        )
        .setup(|app| {
            // 初始化系统托盘
            create_tray(app.handle())?;

            // 启动后立即隐藏主窗口，保证窗口已初始化但对用户不可见
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }

            #[cfg(target_os = "macos")]
            {
                // 仅 macOS 下设置 activation policy accessory
                use tauri::ActivationPolicy;
                let _ = app.set_activation_policy(ActivationPolicy::Accessory);
            }
            let shift_space_shortcut = Shortcut::new(
                Some(Modifiers::SHIFT),
                Code::Space,
            );
            app.global_shortcut().register(shift_space_shortcut)?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}