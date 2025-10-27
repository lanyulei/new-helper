
import { FC, useEffect, useState } from "react";
import './index.css';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message, Popconfirm } from "antd";
// 如遇到 "找不到模块 '@tauri-apps/api/tauri'"，请先执行：pnpm add @tauri-apps/api
import { invoke } from '@tauri-apps/api/core';

/*
  密码管理工具（简洁美化版）
*/

interface ToolPassword {
  id?: number;
  title: string;
  username: string;
  password: string;
  note?: string;
}


const Password: FC = () => {
  const [list, setList] = useState<ToolPassword[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const [modalType, setModalType] = useState<'new'|'edit'|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  // const [loading, setLoading] = useState(false); // 未使用，可移除

  // 查询所有密码
  const fetchList = async () => {
    try {
      const res = await invoke<ToolPassword[]>("list_tool_password", {});
      console.log(res);
      setList(res);
      setSelected((idx) => {
        if (res.length === 0) return 0;
        if (idx >= res.length) return res.length - 1;
        return idx;
      });
    } catch (e) {
      message.error('获取账号列表失败');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const current = list[selected] || {};

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

  // 新建/编辑提交
  const onFinish = async (values: any) => {
    try {
      if (modalType === 'new') {
        await invoke("add_tool_password", { item: values });
        message.success('添加成功');
      } else if (modalType === 'edit' && current.id) {
        await invoke("update_tool_password", { item: { ...values, id: current.id } });
        message.success('更新成功');
      }
      setModalOpen(false);
      fetchList();
    } catch (e) {
      message.error('操作失败');
    }
  };

  // 删除
  const handleDelete = async () => {
    if (!current.id) return;
    try {
      await invoke("delete_tool_password", { id: current.id });
      message.success('删除成功');
      fetchList();
    } catch (e) {
      message.error('删除失败');
    }
  };

  return (
    <>
      <div className="password-container">
        <aside className="password-sidebar">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
            <span style={{fontWeight: 500, fontSize: 14}}>账号列表</span>
            <PlusOutlined className="pw-icon-btn" onClick={handleNew} />
          </div>
          {list.length === 0 && <div style={{color:'#aaa',textAlign:'center',marginTop:40}}>暂无账号</div>}
          {list.map((item, idx) => (
            <div
              className={`entry${selected === idx ? ' entry-selected' : ''}`}
              key={item.id || idx}
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
              <Popconfirm
                title="确定要删除该账号吗？"
                onConfirm={handleDelete}
                okText="删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
                disabled={!current.id}
              >
                <DeleteOutlined className="pw-icon-btn pw-icon-delete" style={{ color: !current.id ? '#ccc' : undefined }} />
              </Popconfirm>
            </div>
          </div>
          {current && current.id ? (
            <>
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
            </>
          ) : (
            <div style={{color:'#aaa',textAlign:'center',marginTop:40}}>请选择账号</div>
          )}
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
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            <Button type="primary" onClick={() => form.submit()}>保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Password;