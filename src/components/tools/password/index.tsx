import { FC, useState } from "react";
import './index.css';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";

/*
  密码管理工具（简洁美化版）
*/

const sample = [
  { title: '示例网站', username: 'user@example.com', password: '••••••••', note: '示例备注' },
  { title: '工作账号', username: 'work.user', password: '••••••••', note: '工作相关' },
];

const Password: FC = () => {
  const [selected, setSelected] = useState(0);
  const [modalType, setModalType] = useState<'new'|'edit'|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const current = sample[selected];

  // 打开新建弹窗
  const handleNew = () => {
    setModalType('new');
    form.resetFields();
    setModalOpen(true);
  };
  // 打开编辑弹窗
  const handleEdit = () => {
    setModalType('edit');
    form.setFieldsValue({
      title: current.title,
      username: current.username,
      password: current.password,
      note: current.note,
    });
    setModalOpen(true);
  };
  // 关闭弹窗
  const handleCancel = () => setModalOpen(false);

  // 表单提交
  const onFinish = (values: any) => {
    // 这里可补充保存逻辑
    setModalOpen(false);
  };
  return (
    <>
      <div className="password-container">
        <aside className="password-sidebar">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
            <span style={{fontWeight: 500, fontSize: 14}}>账号列表</span>
            <PlusOutlined className="pw-icon-btn" onClick={handleNew} />
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
              <EditOutlined className="pw-icon-btn" style={{ marginRight: 16 }} onClick={handleEdit} />
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

      <Modal
        title={
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{modalType === 'new' ? '新建账号' : '编辑账号'}</span>
            <CloseOutlined style={{fontSize:16,cursor:'pointer',color:'#999'}} onClick={handleCancel} />
          </div>
        }
        open={modalOpen}
        footer={null}
        closable={false}
        maskClosable={true}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="note"
          >
            <Input.TextArea placeholder="备注" rows={2} />
          </Form.Item>
          <Form.Item style={{textAlign:'right',marginBottom:0}}>
            <Button onClick={handleCancel} style={{marginRight:12}}>取消</Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Password;