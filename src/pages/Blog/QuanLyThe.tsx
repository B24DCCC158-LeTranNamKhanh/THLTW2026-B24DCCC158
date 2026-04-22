import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTags, saveTags, getArticles, Tag } from './data';

const QuanLyThe: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  const loadData = () => {
    setTags(getTags());
  };

  useEffect(() => {
    loadData();
  }, []);

  const getUsageCount = (tagId: string) => {
    const articles = getArticles();
    return articles.filter(a => a.tags.includes(tagId)).length;
  };

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Tag) => {
    setEditingTag(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const usage = getUsageCount(id);
    if (usage > 0) {
      message.error(`Không thể xóa thẻ này vì đang được sử dụng trong ${usage} bài viết!`);
      return;
    }
    const newTags = tags.filter(t => t.id !== id);
    saveTags(newTags);
    setTags(newTags);
    message.success('Xóa thẻ thành công');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const newTags = [...tags];
      if (editingTag) {
        const index = newTags.findIndex(t => t.id === editingTag.id);
        if (index > -1) {
          newTags[index] = { ...editingTag, name: values.name };
        }
      } else {
        newTags.push({
          id: Date.now().toString(),
          name: values.name,
        });
      }
      saveTags(newTags);
      setTags(newTags);
      setIsModalVisible(false);
      message.success(`${editingTag ? 'Cập nhật' : 'Thêm mới'} thẻ thành công!`);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số bài viết sử dụng',
      key: 'usage',
      render: (_: any, record: Tag) => {
        return getUsageCount(record.id);
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Tag) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thẻ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title="Quản lý thẻ" 
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm thẻ mới</Button>}
        style={{ borderRadius: 8 }}
      >
        <Table 
          columns={columns} 
          dataSource={tags} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thẻ"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ!' }]}
          >
            <Input placeholder="Nhập tên thẻ..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyThe;
