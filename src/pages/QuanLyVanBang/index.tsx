import React, { useState } from 'react';
import { Tabs, Table, Button, Form, Input, InputNumber, DatePicker, Select, Modal, Space, Popconfirm, message, Card, Descriptions, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import useQuanLyVanBangModel from '../../models/quanLyVanBang';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;

export default function QuanLyVanBang() {
  const model = useQuanLyVanBangModel();
  const [activeKey, setActiveKey] = useState('1');

  // Trang thai Modal
  const [visible, setVisible] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [formType, setFormType] = useState<string>('');
  const [form] = Form.useForm();

  // Trang thai tim kiem
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [searchForm] = Form.useForm();
  
  // Modal chi tiet
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState<any>(null);

  const openForm = (type: string, data?: any) => {
    setFormType(type);
    setEditingData(data || null);
    form.resetFields();
    if (data) {
      if (type === 'decision') data.date = moment(data.date);
      if (type === 'diploma') {
        data.dateOfBirth = moment(data.dateOfBirth);
        // Tai cac truong tuy chinh
        model.formConfigs.forEach(config => {
          if (data.customFields && data.customFields[config.id]) {
            data[`custom_${config.id}`] = config.dataType === 'Date' ? moment(data.customFields[config.id]) : data.customFields[config.id];
          }
        });
      }
      form.setFieldsValue(data);
    }
    setVisible(true);
  };

  const onFinish = (values: any) => {
    try {
      if (formType === 'book') {
        if (editingData) model.updateDiplomaBook(editingData.id, values);
        else model.addDiplomaBook(values);
      } 
      else if (formType === 'decision') {
        values.date = values.date.toISOString();
        if (editingData) model.updateDecision(editingData.id, values);
        else model.addDecision(values);
      } 
      else if (formType === 'config') {
        if (editingData) model.updateFormConfig(editingData.id, values);
        else model.addFormConfig(values);
      } 
      else if (formType === 'diploma') {
        const customFields: any = {};
        model.formConfigs.forEach(c => {
          const val = values[`custom_${c.id}`];
          if (val) customFields[c.id] = c.dataType === 'Date' ? val.toISOString() : val;
        });
        values.dateOfBirth = values.dateOfBirth.toISOString();
        values.customFields = customFields;
        if (editingData) model.updateDiploma(editingData.id, values);
        else model.addDiploma(values);
      }
      message.success('Thao tác thành công');
      setVisible(false);
    } catch (e: any) {
      message.error(e.message || 'Lỗi');
    }
  };

  const onSearch = (values: any) => {
    const params = Object.keys(values).reduce((acc: any, k) => {
      if (values[k]) acc[k] = k === 'dateOfBirth' ? values[k].format('YYYY-MM-DD') : values[k];
      return acc;
    }, {});
    
    if (Object.keys(params).length < 2) return message.warning('Nhập ít nhất 2 tham số');
    
    const results = model.diplomas.filter(d => {
      if (params.diplomaNumber && !d.diplomaNumber.includes(params.diplomaNumber)) return false;
      if (params.bookNumber && d.bookNumber.toString() !== params.bookNumber) return false;
      if (params.studentId && !d.studentId.includes(params.studentId)) return false;
      if (params.fullName && !d.fullName.toLowerCase().includes(params.fullName.toLowerCase())) return false;
      if (params.dateOfBirth && moment(d.dateOfBirth).format('YYYY-MM-DD') !== params.dateOfBirth) return false;
      return true;
    });

    setSearchResults(results);
    setSearched(true);
    
    const dIds = Array.from(new Set(results.map(r => r.decisionId)));
    dIds.forEach(id => model.incrementSearchStat(id));
    message.success(`Tìm thấy ${results.length} kết quả`);
  };

  const actionCol = (type: string, deleteFn: Function) => ({
    title: 'Thao tác',
    key: 'action',
    render: (_: any, r: any) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => openForm(type, r)} />
        <Popconfirm title="Xóa?" onConfirm={() => { deleteFn(r.id); message.success('Đã xóa'); }}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )
  });

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h1>Hệ thống Quản lý Văn bằng</h1>
      <Tabs activeKey={activeKey} onChange={setActiveKey} type="card">
        <TabPane tab="Sổ văn bằng" key="1">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm('book')} style={{ marginBottom: 16 }}>Thêm sổ mới</Button>
          <Table rowKey="id" dataSource={model.diplomaBooks} bordered
            columns={[
              { title: 'Năm cấp', dataIndex: 'year' },
              { title: 'Số vào sổ hiện tại', dataIndex: 'currentNumber' },
              actionCol('book', model.deleteDiplomaBook)
            ]} 
          />
        </TabPane>

        <TabPane tab="Quyết định TN" key="2">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm('decision')} style={{ marginBottom: 16 }}>Thêm QĐ</Button>
          <Table rowKey="id" dataSource={model.decisions} bordered
            columns={[
              { title: 'Số QĐ', dataIndex: 'decisionNumber' },
              { title: 'Ngày', dataIndex: 'date', render: v => moment(v).format('DD/MM/YYYY') },
              { title: 'Trích yếu', dataIndex: 'summary' },
              { title: 'Sổ VB năm', dataIndex: 'diplomaBookId', render: id => model.diplomaBooks.find(b => b.id === id)?.year },
              actionCol('decision', model.deleteDecision)
            ]} 
          />
        </TabPane>

        <TabPane tab="Cấu hình biểu mẫu" key="3">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm('config')} style={{ marginBottom: 16 }}>Thêm trường</Button>
          <Table rowKey="id" dataSource={model.formConfigs} bordered
            columns={[
              { title: 'Tên trường', dataIndex: 'name' },
              { title: 'Kiểu dữ liệu', dataIndex: 'dataType' },
              actionCol('config', model.deleteFormConfig)
            ]} 
          />
        </TabPane>

        <TabPane tab="Thông tin văn bằng" key="4">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm('diploma')} style={{ marginBottom: 16 }}>Thêm VB cấp phát</Button>
          <Table rowKey="id" dataSource={model.diplomas} bordered scroll={{ x: 'max-content' }}
            columns={[
              { title: 'Số vào sổ', dataIndex: 'bookNumber' },
              { title: 'Số hiệu', dataIndex: 'diplomaNumber' },
              { title: 'Mã SV', dataIndex: 'studentId' },
              { title: 'Họ tên', dataIndex: 'fullName' },
              { title: 'Ngày sinh', dataIndex: 'dateOfBirth', render: v => moment(v).format('DD/MM/YYYY') },
              { title: 'Quyết định', dataIndex: 'decisionId', render: id => model.decisions.find(d => d.id === id)?.decisionNumber },
              ...model.formConfigs.map((c: any) => ({
                title: c.name, dataIndex: ['customFields', c.id],
                render: (v: any) => v ? (c.dataType === 'Date' ? moment(v).format('DD/MM/YYYY') : v) : ''
              })),
              actionCol('diploma', model.deleteDiploma)
            ]} 
          />
        </TabPane>

        <TabPane tab="Tra cứu" key="5">
          <Card>
            <Form form={searchForm} onFinish={onSearch} layout="vertical">
              <Row gutter={16}>
                <Col span={6}><Form.Item name="diplomaNumber" label="Số hiệu VB"><Input /></Form.Item></Col>
                <Col span={6}><Form.Item name="bookNumber" label="Số vào sổ"><Input /></Form.Item></Col>
                <Col span={6}><Form.Item name="studentId" label="Mã SV"><Input /></Form.Item></Col>
                <Col span={6}><Form.Item name="fullName" label="Họ tên"><Input /></Form.Item></Col>
                <Col span={6}><Form.Item name="dateOfBirth" label="Ngày sinh"><DatePicker style={{width:'100%'}} format="DD/MM/YYYY" /></Form.Item></Col>
              </Row>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
              <Button onClick={() => { searchForm.resetFields(); setSearched(false); setSearchResults([]); }} style={{ marginLeft: 8 }}>Làm mới</Button>
            </Form>
          </Card>
          {searched && (
            <Table rowKey="id" dataSource={searchResults} style={{ marginTop: 24 }} bordered
              columns={[
                { title: 'Số hiệu', dataIndex: 'diplomaNumber' },
                { title: 'Số sổ', dataIndex: 'bookNumber' },
                { title: 'Họ tên', dataIndex: 'fullName' },
                { title: 'Mã SV', dataIndex: 'studentId' },
                { title: 'Thao tác', render: (_: any, r: any) => <Button icon={<EyeOutlined />} onClick={() => { setSelectedDiploma(r); setDetailVisible(true); }}>Chi tiết</Button> }
              ]}
            />
          )}
        </TabPane>
      </Tabs>

      <Modal title="Biểu mẫu" visible={visible} onCancel={() => setVisible(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} onFinish={onFinish} layout="vertical">
          {formType === 'book' && <Form.Item name="year" label="Năm" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><InputNumber style={{width:'100%'}} /></Form.Item>}
          {formType === 'decision' && <>
            <Form.Item name="decisionNumber" label="Số QĐ" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><Input /></Form.Item>
            <Form.Item name="date" label="Ngày" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><DatePicker style={{width:'100%'}} /></Form.Item>
            <Form.Item name="summary" label="Trích yếu" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><Input.TextArea /></Form.Item>
            <Form.Item name="diplomaBookId" label="Sổ VB" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}>
              <Select>{model.diplomaBooks.map(b => <Option key={b.id} value={b.id}>{b.year}</Option>)}</Select>
            </Form.Item>
          </>}
          {formType === 'config' && <>
            <Form.Item name="name" label="Tên trường" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><Input /></Form.Item>
            <Form.Item name="dataType" label="Kiểu dữ liệu" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}>
              <Select><Option value="String">String</Option><Option value="Number">Number</Option><Option value="Date">Date</Option></Select>
            </Form.Item>
          </>}
          {formType === 'diploma' && <>
            <Form.Item name="diplomaNumber" label="Số hiệu" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><Input /></Form.Item>
            <Form.Item name="studentId" label="Mã SV" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><Input /></Form.Item>
            <Form.Item name="fullName" label="Họ tên" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><Input /></Form.Item>
            <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}><DatePicker style={{width:'100%'}} format="DD/MM/YYYY" /></Form.Item>
            <Form.Item name="decisionId" label="Quyết định" rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}>
              <Select>{model.decisions.map(d => <Option key={d.id} value={d.id}>{d.decisionNumber}</Option>)}</Select>
            </Form.Item>
            {model.formConfigs.map((c: any) => (
              <Form.Item key={c.id} name={`custom_${c.id}`} label={c.name} rules={[{required: true, message: 'Hãy điền vào chỗ trống'}]}>
                {c.dataType === 'String' ? <Input /> : c.dataType === 'Number' ? <InputNumber style={{width:'100%'}} /> : <DatePicker style={{width:'100%'}} />}
              </Form.Item>
            ))}
          </>}
        </Form>
      </Modal>

      <Modal title="Chi tiết tra cứu" visible={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {selectedDiploma && (() => {
          const dec = model.decisions.find(d => d.id === selectedDiploma.decisionId);
          return (
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Họ tên">{selectedDiploma.fullName}</Descriptions.Item>
              <Descriptions.Item label="Mã SV">{selectedDiploma.studentId}</Descriptions.Item>
              <Descriptions.Item label="Số hiệu">{selectedDiploma.diplomaNumber}</Descriptions.Item>
              <Descriptions.Item label="Số sổ">{selectedDiploma.bookNumber}</Descriptions.Item>
              <Descriptions.Item label="Quyết định" span={2}>{dec?.decisionNumber}</Descriptions.Item>
              <Descriptions.Item label="Số lượt tra cứu">{dec ? model.searchStats[dec.id] || 0 : 0}</Descriptions.Item>
            </Descriptions>
          )
        })()}
      </Modal>
    </div>
  );
}
