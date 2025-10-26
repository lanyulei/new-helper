import { Input } from "antd";
import "./App.css";
import Tools from "./components/tools";

const App = () => {
  return (
    <>
      <Input placeholder="Enter search term..." />
      <Tools />
    </>
  );
}

export default App;
