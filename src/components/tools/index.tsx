import { FC } from "react";
import { IeOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import './index.css';

/*
    工具集合
*/

const toolList = [
    {
        name: 'Password',
        icon: <LockOutlined style={{ fontSize: 40 }} />,
        path: "/tools/password",
    },
    {
        name: '网址快开',
        icon: <IeOutlined style={{ fontSize: 40 }} />,
        path: "/tools/website-quick-open",
    },
    // 可在此添加更多工具
];

const Tools: FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="tools-title">Your productivity tool that makes all work simple.</div>
            <div className="tools-list-container">
                {toolList.map((tool) => (
                    <div
                        className="tool-item"
                        key={tool.name}
                        onClick={() => navigate(tool.path)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="tool-icon">{tool.icon}</div>
                        <div className="tool-name">{tool.name}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Tools;