import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Select, message } from 'antd';
import { Registration, Club, getRegistrations, setRegistrations, getClubs, addHistory } from '../data';
import { useLocation } from 'umi';

const { Option } = Select;

const ThanhVien: React.FC = () => {
  const [members, setMembersState] = useState<Registration[]>([]);
  const [clubs, setClubsState] = useState<Club[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [targetClubId, setTargetClubId] = useState<string>('');
  
  const location = useLocation();

  useEffect(() => {
    const allClubs = getClubs();
    setClubsState(allClubs);
    
    // Parse query params
    
    const approvers = getRegistrations().filter(r => r.status === 'Approved');
    setMembersState(approvers);
  }, [location.search]);

  const getClubName = (clubId: string) => {
    return clubs.find(c => c.id === clubId)?.name || 'Không xác định';
  };

  const handleOpenTransferModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 thành viên!');
      return;
    }
    setTargetClubId('');
    setIsModalVisible(true);
  };

  const handleConfirmTransfer = () => {
    if (!targetClubId) {
      message.error('Vui lòng chọn Câu lạc bộ muốn thuyên chuyển đến!');
      return;
    }

    const allRegs = getRegistrations();
    const newData = allRegs.map((r) => {
      if (selectedRowKeys.includes(r.id)) {
        return { ...r, clubId: targetClubId };
      }
      return r;
    });
    
    setRegistrations(newData);
    setMembersState(newData.filter(r => r.status === 'Approved'));
    
    addHistory('Chuyển CLB', `Đã chuyển ${selectedRowKeys.length} thành viên sang CLB: ${getClubName(targetClubId)}`);
    message.success(`Đã chuyển thành công ${selectedRowKeys.length} thành viên!`);
    
    setSelectedRowKeys([]);
    setIsModalVisible(false);
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
    { title: 'Sở trường', dataIndex: 'strengths', key: 'strengths' },
    { 
      title: 'Câu lạc bộ hiện tại', 
      dataIndex: 'clubId', 
      filters: clubs.map(c => ({ text: c.name, value: c.id })),
      onFilter: (value: any, record: Registration) => record.clubId === value,
      render: (id: string) => <span style={{color: 'blue'}}>{getClubName(id)}</span>
    },
    { 
      title: 'Ngày tham gia', 
      dataIndex: 'createdAt', 
      render: (t: string) => new Date(t).toLocaleDateString()
    }
  ];

  const queryParams = new URLSearchParams(location.search);
  const focusClubId = queryParams.get('clubId');
  const filteredMembers = focusClubId 
    ? members.filter(m => m.clubId === focusClubId) 
    : members;

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Thành viên Câu lạc bộ</h2>
        <Space>
          <Button type="primary" onClick={handleOpenTransferModal} disabled={selectedRowKeys.length === 0}>
            Chuyển CLB
          </Button>
        </Space>
      </div>
      
      {focusClubId && (
        <div style={{ marginBottom: 16 }}>
          <span style={{color: 'gray'}}>
            Đang lọc theo CLB: <b>{getClubName(focusClubId)}</b>
            <a style={{marginLeft: 8}} onClick={() => window.history.replaceState(null, '', '/quan-ly-clb/thanh-vien')}>(Bỏ lọc)</a>
          </span>
        </div>
      )}

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, background: '#e6f7ff', padding: '8px 16px', borderRadius: 4, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 16 }}>Đã chọn <b>{selectedRowKeys.length}</b> thành viên</span>
          <Button size="small" onClick={() => setSelectedRowKeys([])}>Bỏ chọn</Button>
        </div>
      )}

      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={filteredMembers} 
        rowKey="id" 
        pagination={{ pageSize: 15 }}
      />

      <Modal
        title="Chuyển sinh hoạt Câu lạc bộ"
        visible={isModalVisible}
        onOk={handleConfirmTransfer}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận chuyển"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <p>Bạn đang chọn thuyên chuyển <b>{selectedRowKeys.length}</b> thành viên.</p>
        </div>
        <Form layout="vertical">
          <Form.Item label="Chọn Câu lạc bộ muốn chuyển đến:" required>
            <Select 
              value={targetClubId} 
              onChange={setTargetClubId}
              placeholder="Chọn CLB..."
            >
              {clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default ThanhVien;
