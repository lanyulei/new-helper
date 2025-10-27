import { FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { HomeOutlined } from '@ant-design/icons';
import './layout.css';

const ToolHeader: FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="tool-header">
                <div className="tool-header-left"
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <HomeOutlined onClick={() => navigate('/')} style={{ fontSize: 20, color: '#1677ff', marginRight: 10, position: 'relative', bottom: 2}} />
                    <span className="tool-header-title">投入使用更多工具，提升您的工作效率！</span>
                </div>
            </div>
            <div>
                <Outlet />
            </div> 
        </>
    );
};

export default ToolHeader;