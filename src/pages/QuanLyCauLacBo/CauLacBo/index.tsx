import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Popconfirm, message, Switch, DatePicker } from 'antd';
import { Club, getClubs, setClubs, addHistory } from '../data';
import moment from 'moment';
import { useHistory } from 'umi';

const { TextArea } = Input;

const CauLacBo: React.FC = () => {
  const [clubs, setClubsState] = useState<Club[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const history = useHistory();

  useEffect(() => {
    setClubsState(getClubs());
  }, []);

  const handleOpenModal = (record?: Club) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        foundedDate: record.foundedDate ? moment(record.foundedDate) : null,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleDelete = (id: string, name: string) => {
    const newData = clubs.filter((item) => item.id !== id);
    setClubs(newData);
    setClubsState(newData);
    addHistory('Xóa CLB', `Đã xóa câu lạc bộ: ${name}`);
    message.success('Đã xóa câu lạc bộ thành công');
  };

  const handleFinish = (values: any) => {
    const formattedData = {
      ...values,
      foundedDate: values.foundedDate ? values.foundedDate.format('YYYY-MM-DD') : '',
      avatar: values.avatar || 'https://joeschmoe.io/api/v1/random',
    };

    if (editingId) {
      const newData = clubs.map((c) => (c.id === editingId ? { ...c, ...formattedData } : c));
      setClubs(newData);
      setClubsState(newData);
      addHistory('Sửa CLB', `Đã cập nhật câu lạc bộ: ${values.name}`);
      message.success('Cập nhật thành công');
    } else {
      const newClub: Club = {
        id: Date.now().toString(),
        ...formattedData,
        isActive: values.isActive ?? true,
      };
      const newData = [...clubs, newClub];
      setClubs(newData);
      setClubsState(newData);
      addHistory('Thêm CLB', `Đã tạo mới câu lạc bộ: ${values.name}`);
      message.success('Thêm mới thành công');
    }
    setIsModalVisible(false);
  };

  const filteredData = clubs.filter((c) => c.name.toLowerCase().includes(searchText.toLowerCase()) || 
                                           c.president.toLowerCase().includes(searchText.toLowerCase()));

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      render: (text: string) => <img src={text} alt="avatar" style={{width: 40, height: 40, borderRadius: '50%'}} />
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      sorter: (a: Club, b: Club) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime(),
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'president',
      sorter: (a: Club, b: Club) => a.president.localeCompare(b.president),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      filters: [{ text: 'Có', value: true }, { text: 'Không', value: false }],
      onFilter: (value: any, record: Club) => record.isActive === value,
      render: (isActive: boolean) => isActive ? 'Có' : 'Không',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Club) => (
        <Space size="middle">
          <a onClick={() => history.push(`/quan-ly-clb/thanh-vien?clubId=${record.id}`)}>Thành viên</a>
          <a onClick={() => handleOpenModal(record)}>Sửa</a>
          <Popconfirm title="Xóa CLB này?" onConfirm={() => handleDelete(record.id, record.name)}>
            <a style={{color: 'red'}}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Danh sách câu lạc bộ</h2>
        <Space>
          <Input 
            placeholder="Tìm theo tên..." 
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm mới
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? "Sửa Câu Lạc Bộ" : "Thêm Câu Lạc Bộ"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên câu lạc bộ" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="president" label="Chủ nhiệm CLB" rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="avatar" label="URL Ảnh đại diện">
            <Input placeholder="Nhập đường dẫn ảnh (http...)" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (Hỗ trợ HTML)">
            <TextArea rows={4} placeholder="Ví dụ: <b>CLB nổi tiếng</b> nhất trường" />
          </Form.Item>
          <Form.Item name="isActive" label="Đang hoạt động" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CauLacBo;
