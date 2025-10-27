import { Input } from "antd";
import "../App.css";
import Tools from "../components/tools";

// 定义一个根布局组件，它将包含导航和页面内容区域
const Home = () => {
  return (
    <>
      <Input placeholder="Enter search term..." />
      <Tools />
    </>
  );
}

export default Home;