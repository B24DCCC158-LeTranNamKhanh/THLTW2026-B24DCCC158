import React, { useState } from 'react';
import { Row, Col, Card, Form, Input, InputNumber, Select, Button, List, Statistic, Modal, Space, Rate } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { Destination } from '../types';

const { Option } = Select;

interface AdminTabProps {
  destinations: Destination[];
  handleAddDest: (values: any) => void;
  handleEditDest: (id: number, values: any) => void;
  handleDeleteDest: (id: number) => void;
}

const AdminTab: React.FC<AdminTabProps> = ({ destinations, handleAddDest, handleEditDest, handleDeleteDest }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    if (editingId) {
      handleEditDest(editingId, values);
    } else {
      handleAddDest(values);
    }
    setIsModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleOpenAddNew = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOpenEdit = (item: Destination) => {
    setEditingId(item.id);
    form.setFieldsValue(item);
    setIsModalVisible(true);
  };

  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Card title="Thống kê hệ thống" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}><Statistic title="Lịch trình tháng thu" value={45} suffix="lượt" /></Col>
            <Col span={8}><Statistic title="Tổng doanh thu" value={150000000} suffix="Đ" /></Col>
            <Col span={8}><Statistic title="Địa điểm HOT" value="Sapa" /></Col>
          </Row>
          <div style={{ marginTop: 20 }}>
            <ReactApexChart options={{ labels: ['Q1', 'Q2', 'Q3', 'Q4'] }} series={[120, 150, 400, 300]} type="bar" height={200} />
          </div>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card 
          title="Danh sách quản lý" 
          extra={<Button type="primary" onClick={handleOpenAddNew}>+ Thêm điểm đến mới</Button>}
        >
          <List
            dataSource={destinations}
            renderItem={item => (
              <List.Item actions={[
                <Space key="actions">
                  <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(item)} />
                  <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteDest(item.id)} />
                </Space>
              ]}>
                <List.Item.Meta title={item.name} description={`${item.type} | Giá: ${item.price.toLocaleString()} VNĐ`} />
              </List.Item>
            )}
          />
        </Card>

        <Modal
          title={editingId ? "Sửa điểm đến" : "Thêm điểm đến mới"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Tên địa điểm" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="image" label="Link hình ảnh" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="rating" label="Đánh giá (Số sao)" initialValue={5}><Rate /></Form.Item>
            <Form.Item name="price" label="Giá trung bình (VNĐ)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="costFood" label="Phí đi ăn (VNĐ)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="costAccomm" label="Phí ở (VNĐ)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="costTransport" label="Phí đi lại (VNĐ)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="type" label="Loại hình" initialValue="Biển">
              <Select>
                <Option value="Biển">Biển</Option>
                <Option value="Núi">Núi</Option>
                <Option value="Thành phố">Thành phố</Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Lưu điểm đến</Button>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

export default AdminTab;
