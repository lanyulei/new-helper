import { FC, useState } from "react";
import './index.css';
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

/*
  密码管理工具（简洁美化版）
*/

const sample = [
  { title: '示例网站', username: 'user@example.com', password: '••••••••', note: '示例备注' },
  { title: '工作账号', username: 'work.user', password: '••••••••', note: '工作相关' },
];

const Password: FC = () => {
  const [selected, setSelected] = useState(0);
  const current = sample[selected];
  return (
    <div className="password-container">
      <aside className="password-sidebar">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
          <span style={{fontWeight: 500, fontSize: 14}}>账号列表</span>
          <PlusOutlined className="pw-icon-btn" />
        </div>
        {sample.map((item, idx) => (
          <div
            className={`entry${selected === idx ? ' entry-selected' : ''}`}
            key={idx}
            onClick={() => setSelected(idx)}
            style={{paddingLeft: 12}}
          >
            <div className="entry-title">{item.title}</div>
            <div className="entry-username">{item.username}</div>
          </div>
        ))}
      </aside>

      <section className="password-details">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
          <span style={{fontWeight: 500, fontSize: 15}}>账号详情</span>
          <div>
            <EditOutlined className="pw-icon-btn" style={{ marginRight: 16 }} />
            <DeleteOutlined className="pw-icon-btn pw-icon-delete" />
          </div>
        </div>
        <div className="detail-row">
          <div className="label">标题</div>
          <div className="value">{current.title}</div>
        </div>
        <div className="detail-row">
          <div className="label">用户名</div>
          <div className="value">{current.username}</div>
        </div>
        <div className="detail-row">
          <div className="label">密码</div>
          <div className="value">{current.password}</div>
        </div>
        <div className="detail-row">
          <div className="label">备注</div>
          <div className="value">{current.note}</div>
        </div>
      </section>
    </div>
  );
}

export default Password;