import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Tag, Popconfirm, message } from 'antd';
import { Registration, Club, getRegistrations, setRegistrations, getClubs, addHistory, getHistory, HistoryLog } from '../data';

const { TextArea } = Input;
const { Option } = Select;

const DonDangKy: React.FC = () => {
  const [registrations, setRegsState] = useState<Registration[]>([]);
  const [clubs, setClubsState] = useState<Club[]>([]);
  const [histories, setHistoriesState] = useState<HistoryLog[]>([]);
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  
  const [rejectingIds, setRejectingIds] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setRegsState(getRegistrations());
    setClubsState(getClubs());
    setHistoriesState(getHistory());
  }, []);

  const getClubName = (clubId: string) => {
    return clubs.find(c => c.id === clubId)?.name || 'Không xác định';
  };

  const handleOpenModal = (record?: Registration) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({ ...record });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleDelete = (id: string, name: string) => {
    const newData = registrations.filter((item) => item.id !== id);
    setRegistrations(newData);
    setRegsState(newData);
    addHistory('Xóa đơn', `Đã xóa đơn của: ${name}`);
    message.success('Đã xóa đơn thành công');
  };

  const handleFinish = (values: any) => {
    if (editingId) {
      const newData = registrations.map((r) => (r.id === editingId ? { ...r, ...values } : r));
      setRegistrations(newData);
      setRegsState(newData);
      addHistory('Sửa đơn', `Đã cập nhật đơn của: ${values.fullName}`);
      message.success('Cập nhật thành công');
    } else {
      const newReg: Registration = {
        id: Date.now().toString(),
        ...values,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      const newData = [...registrations, newReg];
      setRegistrations(newData);
      setRegsState(newData);
      addHistory('Thêm đơn', `Đã thêm mới đơn cho: ${values.fullName}`);
      message.success('Thêm mới thành công');
    }
    setIsModalVisible(false);
  };

  const changeStatus = (ids: string[], status: 'Approved' | 'Rejected', reason?: string) => {
    const newData = registrations.map((r) => {
      if (ids.includes(r.id)) {
        return { ...r, status, rejectReason: reason || '' };
      }
      return r;
    });
    setRegistrations(newData);
    setRegsState(newData);
    
    const count = ids.length;
    addHistory(`${status === 'Approved' ? 'Duyệt' : 'Từ chối'} đơn`, `Admin đã ${status} ${count} đơn. Lý do: ${reason || 'Không'}`);
    message.success(`Đã xử lý thành công ${count} đơn`);
    setSelectedRowKeys([]); // Reset selection
  };
  
  const handleApproveSelected = () => {
    changeStatus(selectedRowKeys as string[], 'Approved');
  };

  const handleRejectSelected = () => {
    setRejectingIds(selectedRowKeys as string[]);
    setRejectReason('');
    setIsRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    changeStatus(rejectingIds, 'Rejected', rejectReason);
    setIsRejectModalVisible(false);
  };

  const showHistory = () => {
    setHistoriesState(getHistory());
    setIsHistoryModalVisible(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName) },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: 90 },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'strengths', key: 'strengths' },
    { 
      title: 'Câu lạc bộ', 
      dataIndex: 'clubId', 
      key: 'clubId',
      filters: clubs.map(c => ({ text: c.name, value: c.id })),
      onFilter: (value: any, record: Registration) => record.clubId === value,
      render: (id: string) => getClubName(id) 
    },
    { title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value: any, record: Registration) => record.status === value,
      render: (status: string) => {
        let color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'gold';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: 'Ghi chú', dataIndex: 'rejectReason', key: 'rejectReason' },
    {
      title: 'Thao tác',
      render: (_: any, record: Registration) => (
        <Space size="middle">
          {record.status === 'Pending' && (
            <>
              <a onClick={() => changeStatus([record.id], 'Approved')}>Duyệt</a>
              <a style={{color: 'red'}} onClick={() => { setRejectingIds([record.id]); setIsRejectModalVisible(true); }}>Từ chối</a>
            </>
          )}
          <a onClick={() => handleOpenModal(record)}>Sửa</a>
          <Popconfirm title="Xóa đơn?" onConfirm={() => handleDelete(record.id, record.fullName)}>
            <a style={{color: 'red'}}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Đơn đăng ký</h2>
        <Space>
          <Button onClick={showHistory}>Lịch sử thao tác</Button>
          <Button type="primary" onClick={() => handleOpenModal()}>
            Làm đơn mới
          </Button>
        </Space>
      </div>
      
      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, background: '#e6f7ff', padding: '8px 16px', borderRadius: 4, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 16 }}>Đã chọn {selectedRowKeys.length} đơn</span>
          <Space>
            <Button size="small" type="primary" onClick={handleApproveSelected}>Duyệt các đơn đã chọn</Button>
            <Button size="small" danger onClick={handleRejectSelected}>Từ chối các đơn đã chọn</Button>
            <Button size="small" onClick={() => setSelectedRowKeys([])}>Bỏ chọn</Button>
          </Space>
        </div>
      )}

      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={registrations} 
        rowKey="id" 
        pagination={{ pageSize: 15 }}
        scroll={{ x: 'max-content' }}
      />

      {/* Modal Add/Edit */}
      <Modal
        title={editingId ? "Sửa đơn đăng ký" : "Thêm đơn đăng ký mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="fullName" label="Họ Tên" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
            <Input />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item style={{ flex: 1 }} name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item style={{ flex: 1 }} name="phone" label="SĐT" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item style={{ flex: 1 }} name="gender" label="Giới tính" rules={[{ required: true }]}>
              <Select>
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ flex: 2 }} name="clubId" label="Câu lạc bộ ứng tuyển" rules={[{ required: true }]}>
              <Select>
                {clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="address" label="Địa chỉ"><Input /></Form.Item>
          <Form.Item name="strengths" label="Sở trường"><Input /></Form.Item>
          <Form.Item name="reason" label="Lý do tham gia"><TextArea rows={3} /></Form.Item>
          
          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Reject Selection */}
      <Modal
        title="Xác nhận từ chối đơn"
        visible={isRejectModalVisible}
        onOk={handleConfirmReject}
        onCancel={() => setIsRejectModalVisible(false)}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Vui lòng nhập lý do từ chối cho {rejectingIds.length} đơn đăng ký:</p>
        <TextArea 
          rows={4} 
          value={rejectReason} 
          onChange={(e) => setRejectReason(e.target.value)} 
          placeholder="Lý do không phù hợp..."
        />
      </Modal>

      {/* Modal Lịch sử */}
      <Modal
        title="Lịch sử thao tác hệ thống"
        visible={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsHistoryModalVisible(false)}>Đóng</Button>
        ]}
        width={700}
      >
        <Table 
          dataSource={histories} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'Thời gian', dataIndex: 'time', key: 'time', width: 200 },
            { title: 'Tác vụ', dataIndex: 'action', key: 'action', width: 150, render: (t) => <Tag color="blue">{t}</Tag> },
            { title: 'Chi tiết', dataIndex: 'details', key: 'details' }
          ]}
        />
      </Modal>

    </div>
  );
};

export default DonDangKy;
