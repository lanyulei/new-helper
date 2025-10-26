import { FC } from "react";
import Password from "./password";
import { LockOutlined } from '@ant-design/icons';
import './index.css';

/*
    工具集合
*/

const toolList = [
    {
        name: 'Password',
        icon: <LockOutlined style={{ fontSize: 40 }} />,
        component: <Password />,
    },
    // 可在此添加更多工具
];

const Tools: FC = () => {
    return (
        <>
            <div className="tools-title">Your productivity tool that makes all work simple.</div>
            <div className="tools-list-container">
                {toolList.map((tool) => (
                    <div className="tool-item" key={tool.name}>
                        <div className="tool-icon">{tool.icon}</div>
                        <div className="tool-name">{tool.name}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Tools;