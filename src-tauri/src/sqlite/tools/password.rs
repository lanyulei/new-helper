use serde::{Deserialize, Serialize};
use sqlx::Row;
use crate::sqlite::SqliteDB;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ToolPassword {
	pub id: Option<i64>,
	pub title: String,
	pub username: String,
	pub password: String,
	pub note: Option<String>,
}

// 新增
#[tauri::command]
pub async fn add_tool_password(item: ToolPassword) -> Result<i64, String> {
	let pool = SqliteDB::pool();
	let rec = sqlx::query(
		"INSERT INTO tool_password (title, username, password, note) VALUES (?, ?, ?, ?)"
	)
	.bind(&item.title)
	.bind(&item.username)
	.bind(&item.password)
	.bind(&item.note)
	.execute(&*pool)
	.await
	.map_err(|e| e.to_string())?;
	Ok(rec.last_insert_rowid())
}

// 查询所有
#[tauri::command]
pub async fn list_tool_password() -> Result<Vec<ToolPassword>, String> {
	let pool = SqliteDB::pool();
	let rows = sqlx::query("SELECT id, title, username, password, note FROM tool_password ORDER BY id DESC")
		.fetch_all(&*pool)
		.await
		.map_err(|e| e.to_string())?;
	Ok(rows.into_iter().map(|row| ToolPassword {
		id: row.try_get("id").ok(),
		title: row.try_get("title").unwrap_or_default(),
		username: row.try_get("username").unwrap_or_default(),
		password: row.try_get("password").unwrap_or_default(),
		note: row.try_get("note").ok(),
	}).collect())
}

// 更新
#[tauri::command]
pub async fn update_tool_password(item: ToolPassword) -> Result<(), String> {
	let pool = SqliteDB::pool();
	if item.id.is_none() {
		return Err("缺少id".into());
	}
	sqlx::query("UPDATE tool_password SET title=?, username=?, password=?, note=? WHERE id=?")
		.bind(&item.title)
		.bind(&item.username)
		.bind(&item.password)
		.bind(&item.note)
		.bind(item.id.unwrap())
		.execute(&*pool)
		.await
		.map_err(|e| e.to_string())?;
	Ok(())
}

// 删除
#[tauri::command]
pub async fn delete_tool_password(id: i64) -> Result<(), String> {
	let pool = SqliteDB::pool();
	sqlx::query("DELETE FROM tool_password WHERE id=?")
		.bind(id)
		.execute(&*pool)
		.await
		.map_err(|e| e.to_string())?;
	Ok(())
}
