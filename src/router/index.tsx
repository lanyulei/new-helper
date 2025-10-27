import { createBrowserRouter, Outlet } from "react-router-dom";
import "../App.css";
import Home from "../pages/Home";
import ToolLayout from "../components/tools/layout";
import PasswordTool from "../components/tools/password";
import WebsiteQuickOpenTool from "../components/tools/wqo";

// 定义一个根布局组件，它将包含导航和页面内容区域
const RootLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
}

// 创建路由实例
export const router = createBrowserRouter([
  {
    path: "/", // 根路径
    element: <RootLayout />, // 使用根布局
    children: [
      {
        index: true, // 默认子路由，当路径为 "/" 时渲染
        element: <Home />,
      },
    //   {
    //     path: "about", // /about
    //     element: <About />,
    //   },
      {
        path: "tools",
        element: <ToolLayout />,
        children: [
          {
            path: "password",
            element: <PasswordTool />, 
          },
          {
            path: "website-quick-open",
            element: <WebsiteQuickOpenTool />, 
          },
        ],
      },
    ],
  },
]);
