import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Popconfirm, message, Select, Tag as AntTag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getArticles, saveArticles, getTags, Article, Tag } from './data';

const { Option } = Select;
const { TextArea } = Input;

const QuanLyBaiViet: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [form] = Form.useForm();

  const loadData = () => {
    setArticles(getArticles());
    setTags(getTags());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingArticle(null);
    form.resetFields();
    form.setFieldsValue({ status: 'Draft' });
    setIsModalVisible(true);
  };

  const handleEdit = (record: Article) => {
    setEditingArticle(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const newArticles = articles.filter(a => a.id !== id);
    saveArticles(newArticles);
    setArticles(newArticles);
    message.success('Xóa bài viết thành công');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const newArticles = [...articles];
      if (editingArticle) {
        const index = newArticles.findIndex(a => a.id === editingArticle.id);
        if (index > -1) {
          newArticles[index] = { 
            ...editingArticle, 
            ...values,
          };
        }
      } else {
        newArticles.unshift({
          id: Date.now().toString(),
          ...values,
          viewCount: 0,
          createdAt: new Date().toISOString(),
        });
      }
      saveArticles(newArticles);
      setArticles(newArticles);
      setIsModalVisible(false);
      message.success(`${editingArticle ? 'Cập nhật' : 'Thêm mới'} bài viết thành công!`);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'All' ? true : a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getTagNames = (tagIds: string[]) => {
    if (!tagIds) return [];
    return tagIds.map(id => {
      const t = tags.find(tag => tag.id === id);
      return t ? t.name : '';
    }).filter(name => name !== '');
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <AntTag color={status === 'Published' ? 'green' : 'orange'}>
          {status === 'Published' ? 'Đã đăng' : 'Bản nháp'}
        </AntTag>
      )
    },
    {
      title: 'Thẻ',
      key: 'tags',
      dataIndex: 'tags',
      render: (tagIds: string[]) => (
        <Space wrap>
          {getTagNames(tagIds).map(name => (
            <AntTag color="blue" key={name}>{name}</AntTag>
          ))}
        </Space>
      )
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Article) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
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
        title="Quản lý bài viết" 
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm bài viết mới</Button>}
        style={{ borderRadius: 8 }}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input 
              placeholder="Tìm kiếm theo tiêu đề..." 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select 
              value={filterStatus} 
              onChange={setFilterStatus} 
              style={{ width: '100%' }}
            >
              <Option value="All">Tất cả trạng thái</Option>
              <Option value="Published">Đã đăng</Option>
              <Option value="Draft">Bản nháp</Option>
            </Select>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredArticles} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingArticle ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="Nhập tiêu đề..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug (Đường dẫn tĩnh)"
                rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
              >
                <Input placeholder="vi-du-bai-viet" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="summary"
            label="Tóm tắt"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt!' }]}
          >
            <TextArea rows={2} placeholder="Nhập đoạn tóm tắt ngắn..." />
          </Form.Item>

          <Form.Item
            name="coverImage"
            label="URL Ảnh đại diện"
          >
            <Input placeholder="Bỏ trống để dùng ảnh mặc định..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="Thẻ (Tags)"
                rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 thẻ!' }]}
              >
                <Select mode="multiple" placeholder="Chọn thẻ...">
                  {tags.map(tag => (
                    <Option key={tag.id} value={tag.id}>{tag.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="Draft">Bản nháp</Option>
                  <Option value="Published">Đã đăng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="Nội dung (Markdown)"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea rows={12} placeholder="# Tiêu đề 1&#10;Nội dung bài viết hỗ trợ cú pháp Markdown..." style={{ fontFamily: 'monospace' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyBaiViet;
