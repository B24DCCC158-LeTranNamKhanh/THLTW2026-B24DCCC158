import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message, Card, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const ROOM_TYPES = [
  'Lý thuyết',
  'Thực hành',
  'Hội trường'
];

const MANAGERS = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Văn C',
  'Hoàng Thị D'
];

interface Room {
  id: string;
  maPhong: string;
  tenPhong: string;
  soChoNgoi: number;
  loaiPhong: string;
  nguoiPhuTrach: string;
}

const QuanLyPhongHoc: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form] = Form.useForm();
  
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterManager, setFilterManager] = useState<string | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem('classrooms');
    if (stored) {
      const data = JSON.parse(stored);
      setRooms(data);
      setFilteredRooms(data);
    } else {
      const initial: Room[] = [
        { id: '1', maPhong: 'P101', tenPhong: 'Phòng Lý thuyết 1', soChoNgoi: 50, loaiPhong: 'Lý thuyết', nguoiPhuTrach: 'Nguyễn Văn A' },
        { id: '2', maPhong: 'P102', tenPhong: 'Phòng Thực hành 1', soChoNgoi: 40, loaiPhong: 'Thực hành', nguoiPhuTrach: 'Trần Thị B' },
        { id: '3', maPhong: 'HT1', tenPhong: 'Hội trường Lớn', soChoNgoi: 200, loaiPhong: 'Hội trường', nguoiPhuTrach: 'Lê Văn C' },
        { id: '4', maPhong: 'P103', tenPhong: 'Phòng Lý thuyết 2', soChoNgoi: 25, loaiPhong: 'Lý thuyết', nguoiPhuTrach: 'Hoàng Thị D' }
      ];
      setRooms(initial);
      setFilteredRooms(initial);
      localStorage.setItem('classrooms', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    let result = rooms;
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(r => 
        r.maPhong.toLowerCase().includes(lowerSearch) || 
        r.tenPhong.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterType) {
      result = result.filter(r => r.loaiPhong === filterType);
    }
    if (filterManager) {
      result = result.filter(r => r.nguoiPhuTrach === filterManager);
    }
    setFilteredRooms(result);
  }, [rooms, searchText, filterType, filterManager]);

  const handleAdd = () => {
    setEditingRoom(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Room) => {
    setEditingRoom(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: Room) => {
    if (record.soChoNgoi >= 30) {
      message.error('Chỉ được phép xóa phòng có dưới 30 chỗ ngồi!');
      return;
    }
    const newRooms = rooms.filter(r => r.id !== record.id);
    setRooms(newRooms);
    localStorage.setItem('classrooms', JSON.stringify(newRooms));
    message.success('Đã xóa phòng học thành công!');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const isDuplicateMaPhong = rooms.some(r => r.maPhong === values.maPhong && r.id !== editingRoom?.id);
      const isDuplicateTenPhong = rooms.some(r => r.tenPhong === values.tenPhong && r.id !== editingRoom?.id);
      
      if (isDuplicateMaPhong) {
        form.setFields([{ name: 'maPhong', errors: ['Mã phòng đã tồn tại!'] }]);
        return;
      }
      if (isDuplicateTenPhong) {
        form.setFields([{ name: 'tenPhong', errors: ['Tên phòng đã tồn tại!'] }]);
        return;
      }

      let newRooms = [...rooms];
      if (editingRoom) {
        newRooms = newRooms.map(r => r.id === editingRoom.id ? { ...r, ...values } : r);
        message.success('Cập nhật phòng học thành công!');
      } else {
        newRooms.push({
          ...values,
          id: Date.now().toString()
        });
        message.success('Thêm mới phòng học thành công!');
      }
      setRooms(newRooms);
      localStorage.setItem('classrooms', JSON.stringify(newRooms));
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
      key: 'maPhong',
    },
    {
      title: 'Tên phòng',
      dataIndex: 'tenPhong',
      key: 'tenPhong',
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'soChoNgoi',
      key: 'soChoNgoi',
      sorter: (a: Room, b: Room) => a.soChoNgoi - b.soChoNgoi,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'loaiPhong',
      key: 'loaiPhong',
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoiPhuTrach',
      key: 'nguoiPhuTrach',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Room) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Tooltip title={record.soChoNgoi >= 30 ? "Không thể xóa phòng từ 30 chỗ trở lên" : "Xóa phòng"}>
             <Popconfirm
                title="Cảnh báo: Bạn có chắc chắn muốn xóa phòng học này?"
                onConfirm={() => handleDelete(record)}
                okText="Đồng ý"
                cancelText="Hủy"
                disabled={record.soChoNgoi >= 30}
             >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={record.soChoNgoi >= 30}
                />
             </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý phòng học" bordered={false}>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Space style={{ flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm theo Mã hoặc Tên phòng"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo Loại phòng"
            style={{ width: 150 }}
            allowClear
            value={filterType}
            onChange={value => setFilterType(value)}
          >
            {ROOM_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
          </Select>
          <Select
            placeholder="Lọc theo Người phụ trách"
            style={{ width: 200 }}
            allowClear
            value={filterManager}
            onChange={value => setFilterManager(value)}
          >
             {MANAGERS.map(m => <Option key={m} value={m}>{m}</Option>)}
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm phòng học
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredRooms}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingRoom ? "Chỉnh sửa phòng học" : "Thêm mới phòng học"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="maPhong"
            label="Mã phòng"
            rules={[
              { required: true, message: 'Vui lòng nhập mã phòng (không để trống)!' },
              { max: 10, message: 'Mã phòng tối đa 10 ký tự!' },
            ]}
          >
            <Input placeholder="Nhập mã phòng" />
          </Form.Item>
          <Form.Item
            name="tenPhong"
            label="Tên phòng"
            rules={[
              { required: true, message: 'Vui lòng nhập tên phòng (không để trống)!' },
              { max: 50, message: 'Tên phòng tối đa 50 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>
          <Form.Item
            name="nguoiPhuTrach"
            label="Người phụ trách"
            rules={[{ required: true, message: 'Vui lòng chọn người phụ trách!' }]}
          >
            <Select placeholder="Chọn người phụ trách">
              {MANAGERS.map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="soChoNgoi"
            label="Số chỗ ngồi"
            rules={[
              { required: true, message: 'Vui lòng nhập số chỗ ngồi!' },
              () => ({
                validator(_, value) {
                  if (value === undefined || value === null || (value >= 10 && value <= 200)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Số chỗ ngồi phải từ 10 đến 200!'));
                },
              })
            ]}
          >
            <InputNumber placeholder="Nhập số chỗ ngồi" style={{ width: '100%' }} min={10} max={200} />
          </Form.Item>
          <Form.Item
            name="loaiPhong"
            label="Loại phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
          >
            <Select placeholder="Chọn loại phòng">
              {ROOM_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyPhongHoc;
