import React, { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Tag, Space, message, Rate, Card, Row, Col, Statistic } from 'antd';
import dayjs from 'dayjs';

// --- KIỂU DỮ LIỆU ---
type Status = 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';
interface Employee { id: string; name: string; maxPerDay: number; workingDay: string; hours: string; }
interface Service { id: string; name: string; price: number; duration: number; }
interface Appointment { id: string; customerId: string; customerName: string; empId: string; svcId: string; date: string; time: string; status: Status; }
interface Review { id: string; appId: string; rating: number; comment: string; reply?: string; }

// --- DỮ LIỆU MẪU ---
const initEmps: Employee[] = [
  { id: 'E1', name: 'GuGu', maxPerDay: 5, workingDay: 'Thứ 6', hours: '09:00-17:00' },
  { id: 'E2', name: 'GaGa', maxPerDay: 3, workingDay: 'Thứ 2 đến Thứ 6', hours: '08:00-18:00' }
];
const initSvcs: Service[] = [
  { id: 'S1', name: 'Cắt tóc', price: 100000, duration: 30 },
  { id: 'S2', name: 'Gội đầu', price: 50000, duration: 45 }
];
const initApps: Appointment[] = [
  { id: 'A1', customerId: 'C1', customerName: 'Khách 1', empId: 'E1', svcId: 'S1', date: '2026-03-20', time: '10:00', status: 'Chờ duyệt' },
  { id: 'A2', customerId: 'C2', customerName: 'Khách 2', empId: 'E2', svcId: 'S2', date: '2026-03-20', time: '11:00', status: 'Hoàn thành' }
];

export default function SimpleBookingApp() {
  const [employees, setEmps] = useState<Employee[]>(initEmps);
  const [services, setSvcs] = useState<Service[]>(initSvcs);
  const [appointments, setApps] = useState<Appointment[]>(initApps);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<'EMP'|'SVC'|'APP'|'REV'|'REPLY'|null>(null);
  const [editId, setEditId] = useState<string|null>(null);

  const openForm = (type: any, record?: any) => {
    form.resetFields();
    if (record) {
      form.setFieldsValue(record);
      setEditId(record.id);
    } else {
      setEditId(null);
    }
    setModalType(type);
  };

  const handleFinish = (values: any) => {
    const id = editId || Date.now().toString();
    if (modalType === 'EMP') {
      if (editId) setEmps(employees.map(e => e.id === id ? { ...e, ...values } : e));
      else setEmps([...employees, { id, ...values }]);
    } 
    else if (modalType === 'SVC') {
      if (editId) setSvcs(services.map(s => s.id === id ? { ...s, ...values } : s));
      else setSvcs([...services, { id, ...values }]);
    }
    else if (modalType === 'APP') {
      const dateStr = values.date.format('YYYY-MM-DD');
      const timeStr = values.time.format('HH:mm');
      
      // Kiểm tra giới hạn & trùng lịch -
      const empApps = appointments.filter(a => a.empId === values.empId && a.date === dateStr && a.status !== 'Hủy');
      const emp = employees.find(e => e.id === values.empId);
      
      if (emp && empApps.length >= emp.maxPerDay) {
        return message.error('Nhân viên đã đạt giới hạn phục vụ trong ngày!');
      }
      
      const overlap = empApps.some(a => a.time === timeStr); // Phát hiện trùng lịch -
      if (overlap) return message.error('Bị trùng lịch của nhân viên!');

      setApps([...appointments, { id, customerId: `C${Date.now()}`, customerName: values.customerName, empId: values.empId, svcId: values.svcId, date: dateStr, time: timeStr, status: 'Chờ duyệt' }]);
      message.success('Đặt lịch thành công');
    }
    else if (modalType === 'REV') {
      setReviews([...reviews, { id, appId: values.appId, rating: values.rating, comment: values.comment }]);
      message.success('Cảm ơn bạn đã đánh giá!');
    }
    else if (modalType === 'REPLY') {
      setReviews(reviews.map(r => r.id === id ? { ...r, reply: values.reply } : r));
      message.success('Đã gửi phản hồi.');
    }
    setModalType(null);
  };

  const updateStatus = (id: string, st: Status) => setApps(appointments.map(a => a.id === id ? { ...a, status: st } : a));

  return (
    <Card title="Hệ Thống Đặt Lịch" style={{ margin: 20 }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="1. Quản lý Nhân sự & Dịch vụ" key="1">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Nhân viên" size="small" extra={<Button size="small" onClick={() => openForm('EMP')}>+ Thêm</Button>}>
                  <Table size="small" dataSource={employees} rowKey="id" columns={[
                    { title: 'Tên', dataIndex: 'name' },
                    { title: 'Lịch Làm (Thứ)', dataIndex: 'workingDay' },
                    { title: 'Giờ', dataIndex: 'hours' },
                    { title: 'Khách/ngày', dataIndex: 'maxPerDay' },
                    { title: '', render: (_, r) => <a onClick={() => setEmps(employees.filter(e=>e.id!==r.id))}>Xóa</a> }
                  ]} />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Dịch vụ" size="small" extra={<Button size="small" onClick={() => openForm('SVC')}>+ Thêm</Button>}>
                  <Table size="small" dataSource={services} rowKey="id" columns={[
                    { title: 'Dịch vụ', dataIndex: 'name' },
                    { title: 'Giá', dataIndex: 'price' },
                    { title: 'T.Gian (p)', dataIndex: 'duration' },
                    { title: '', render: (_, r) => <a onClick={() => setSvcs(services.filter(s=>s.id!==r.id))}>Xóa</a> }
                  ]} />
                </Card>
              </Col>
            </Row>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="2. Quản lý Lịch hẹn" key="2">
            <>
              <Button type="primary" onClick={() => openForm('APP')} style={{ marginBottom: 16 }}>+ Đặt Lịch Mới</Button>
              <Table size="small" dataSource={appointments} rowKey="id" columns={[
                { title: 'Khách', dataIndex: 'customerName' },
                { title: 'Ngày', dataIndex: 'date' },
                { title: 'Giờ', dataIndex: 'time' },
                { title: 'Tình trạng', dataIndex: 'status', render: st => <Tag color={st==='Hoàn thành'?'green':st==='Hủy'?'red':'blue'}>{st}</Tag> },
                { title: 'Hành động', render: (_, r) => (
                    <Space>
                      {r.status === 'Chờ duyệt' && <a onClick={() => updateStatus(r.id, 'Xác nhận')}>X.Nhận</a>}
                      {r.status === 'Xác nhận' && <a onClick={() => updateStatus(r.id, 'Hoàn thành')}>H.Thành</a>}
                      {r.status !== 'Hủy' && r.status !== 'Hoàn thành' && <a onClick={() => updateStatus(r.id, 'Hủy')} style={{color:'red'}}>Hủy</a>}
                    </Space>
                )}
              ]} />
            </>
        </Tabs.TabPane>

        <Tabs.TabPane tab="3. Đánh giá" key="3">
            <>
               <Button type="primary" onClick={() => openForm('REV')} style={{ marginBottom: 16 }}>+ Viết Đánh giá</Button>
               <Table size="small" dataSource={reviews} rowKey="id" columns={[
                 { title: 'Lịch Số', dataIndex: 'appId' },
                 { title: 'Sao', dataIndex: 'rating', render: v => <Rate disabled defaultValue={v} /> },
                 { title: 'Khách Nhận xét', dataIndex: 'comment' },
                 { title: 'NV Phản hồi', dataIndex: 'reply', render: (v, r) => v ? <i>{v}</i> : <a onClick={()=>openForm('REPLY', r)}>Trả lời</a> }
               ]} />
            </>
        </Tabs.TabPane>

        <Tabs.TabPane tab="4. Thống kê báo cáo" key="4">
            <Row gutter={16}>
              <Col span={8}><Card size="small"><Statistic title="Tổng Cuộc Hẹn" value={appointments.length} /></Card></Col>
              <Col span={8}><Card size="small"><Statistic title="Cuộc Hẹn Hoàn Thành" value={appointments.filter(a=>a.status === 'Hoàn thành').length} valueStyle={{color: 'green'}} /></Card></Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic title="Tổng Doanh Thu (VNĐ)" valueStyle={{color: 'red'}} value={
                    appointments.filter(a=>a.status === 'Hoàn thành').reduce((sum, a) => sum + (services.find(s=>s.id === a.svcId)?.price || 0), 0)
                  } />
                </Card>
              </Col>
            </Row>
        </Tabs.TabPane>
      </Tabs>

      <Modal visible={!!modalType} title="Thao Tác" onOk={() => form.submit()} onCancel={() => setModalType(null)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {modalType === 'EMP' && <>
            <Form.Item name="name" label="Tên NV" rules={[{required: true}]}><Input /></Form.Item>
            <Form.Item name="hours" label="Giờ làm" initialValue="08:00-17:00"><Input /></Form.Item>
            <Form.Item name="workingDay" label="Ngày làm" initialValue="Thứ 2 - Thứ 6"><Input /></Form.Item>
            <Form.Item name="maxPerDay" label="Lượt khách tối đa/ngày" initialValue={5}><InputNumber min={1} /></Form.Item>
          </>}
          {modalType === 'SVC' && <>
            <Form.Item name="name" label="Tên Dịch Vụ" rules={[{required: true}]}><Input /></Form.Item>
            <Form.Item name="price" label="Giá (đ)"><InputNumber style={{width:'100%'}} step={10000} /></Form.Item>
            <Form.Item name="duration" label="Thời gian (Phút)"><InputNumber style={{width:'100%'}} step={5} /></Form.Item>
          </>}
          {modalType === 'APP' && <>
            <Form.Item name="customerName" label="Tên Khách" rules={[{required: true}]}><Input /></Form.Item>
            <Form.Item name="empId" label="Nhân viên" rules={[{required: true}]}>
              <Select>{employees.map(e => <Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item name="svcId" label="Dịch vụ" rules={[{required: true}]}>
              <Select>{services.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item name="date" label="Ngày" rules={[{required: true}]}><DatePicker format="YYYY-MM-DD" style={{width:'100%'}} /></Form.Item>
            <Form.Item name="time" label="Giờ" rules={[{required: true}]}><DatePicker picker="time" format="HH:mm" style={{width:'100%'}} /></Form.Item>
          </>}
          {modalType === 'REV' && <>
            <Form.Item name="appId" label="Chọn Lịch Hẹn Đã Hoàn Thành" rules={[{required: true}]}>
              <Select>{appointments.filter(a=>a.status === 'Hoàn thành').map(a => <Select.Option key={a.id} value={a.id}>{a.customerName} - {a.date}</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item name="rating" label="Số Sao" initialValue={5}><Rate /></Form.Item>
            <Form.Item name="comment" label="Nhận Xét"><Input.TextArea /></Form.Item>
          </>}
          {modalType === 'REPLY' && <>
             <Form.Item name="reply" label="Nội Dụng Phản Hồi"><Input.TextArea /></Form.Item>
          </>}
        </Form>
      </Modal>

    </Card>
  );
}
