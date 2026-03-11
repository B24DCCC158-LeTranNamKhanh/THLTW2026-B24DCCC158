import React, { useState } from 'react';
import { Menu, Layout, Form, Input, Button, Table, Select, message, Space, Card, InputNumber } from 'antd';

const { Header, Content } = Layout;

const Bai2: React.FC = () => {
    const [currentMenu, setCurrentMenu] = useState('1');

    const [blocks, setBlocks] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [structures, setStructures] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);

    const [formBlock] = Form.useForm();
    const [formSubj] = Form.useForm();
    const [formQues] = Form.useForm();
    const [formStruct] = Form.useForm();

    const [examSubjId, setExamSubjId] = useState<string>();
    const [filterSubj, setFilterSubj] = useState<string>();
    const [filterBlock, setFilterBlock] = useState<string>();
    const [filterDiff, setFilterDiff] = useState<string>();

    const onAddBlock = (val: any) => {
        setBlocks([...blocks, { id: Date.now().toString(), name: val.name }]);
        formBlock.resetFields();
    };

    const onAddSubj = (val: any) => {
        setSubjects([...subjects, { id: val.id, name: val.name, credits: val.credits }]);
        formSubj.resetFields();
    };

    const onAddQues = (val: any) => {
        setQuestions([...questions, { id: val.id, subjectId: val.subjectId, blockId: val.blockId, diff: val.diff, content: val.content }]);
        formQues.resetFields();
    };

    const onAddStruct = (val: any) => {
        setStructures([...structures, { blockId: val.blockId, diff: val.diff, count: val.count }]);
        formStruct.resetFields();
    };

    const generateExam = () => {
        if (!examSubjId) return message.error('Vui lòng chọn môn học');
        let examQs: any[] = [];
        for (let s of structures) {
            let match = questions.filter(q => q.subjectId === examSubjId && q.blockId === s.blockId && q.diff === s.diff);
            if (match.length < s.count) return message.error('Không đủ câu hỏi trong ngân hàng cho cấu trúc hiện tại');
            examQs.push(...match.sort(() => 0.5 - Math.random()).slice(0, s.count));
        }
        setExams([...exams, { id: Date.now(), subjectId: examSubjId, qs: examQs }]);
        setStructures([]);
        message.success('Tạo đề thi thành công');
    };

    const renderContent = () => {
        switch (currentMenu) {
            case '1':
                return (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Form form={formBlock} layout="inline" onFinish={onAddBlock}>
                            <Form.Item name="name" rules={[{ required: true }]}><Input placeholder="Tên khối KT" /></Form.Item>
                            <Button htmlType="submit" type="primary">Thêm</Button>
                        </Form>
                        <Table dataSource={blocks} rowKey="id" columns={[{ title: 'Tên khối kiến thức', dataIndex: 'name' }]} />
                    </Space>
                );
            case '2':
                return (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Form form={formSubj} layout="inline" onFinish={onAddSubj}>
                            <Form.Item name="id" rules={[{ required: true }]}><Input placeholder="Mã môn" /></Form.Item>
                            <Form.Item name="name" rules={[{ required: true }]}><Input placeholder="Tên môn" /></Form.Item>
                            <Form.Item name="credits" rules={[{ required: true }]}><InputNumber placeholder="Số TC" min={1} /></Form.Item>
                            <Button htmlType="submit" type="primary">Thêm</Button>
                        </Form>
                        <Table dataSource={subjects} rowKey="id" columns={[{ title: 'Mã môn', dataIndex: 'id' }, { title: 'Tên môn', dataIndex: 'name' }, { title: 'Số TC', dataIndex: 'credits' }]} />
                    </Space>
                );
            case '3':
                return (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Form form={formQues} layout="vertical" onFinish={onAddQues}>
                            <Space align="start">
                                <Form.Item name="id" rules={[{ required: true }]}><Input placeholder="Mã câu hỏi" /></Form.Item>
                                <Form.Item name="subjectId" rules={[{ required: true }]}>
                                    <Select placeholder="Môn học" style={{ width: 140 }}>
                                        {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="blockId" rules={[{ required: true }]}>
                                    <Select placeholder="Khối KT" style={{ width: 140 }}>
                                        {blocks.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="diff" rules={[{ required: true }]}>
                                    <Select placeholder="Mức độ khó" style={{ width: 140 }}>
                                        {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                            </Space>
                            <Form.Item name="content" rules={[{ required: true }]}><Input.TextArea placeholder="Nội dung câu hỏi" /></Form.Item>
                            <Button htmlType="submit" type="primary">Thêm câu hỏi</Button>
                        </Form>
                        <Card size="small" style={{ background: '#fafafa', marginTop: 10 }}>
                            <Space>
                                <Select placeholder="Lọc Môn" allowClear style={{ width: 150 }} onChange={setFilterSubj}>
                                    {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                                </Select>
                                <Select placeholder="Lọc Khối KT" allowClear style={{ width: 150 }} onChange={setFilterBlock}>
                                    {blocks.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
                                </Select>
                                <Select placeholder="Lọc Mức độ" allowClear style={{ width: 150 }} onChange={setFilterDiff}>
                                    {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                                </Select>
                            </Space>
                        </Card>
                        <Table
                            dataSource={questions.filter(q => (!filterSubj || q.subjectId === filterSubj) && (!filterBlock || q.blockId === filterBlock) && (!filterDiff || q.diff === filterDiff))}
                            rowKey="id"
                            columns={[
                                { title: 'Mã', dataIndex: 'id' },
                                { title: 'Nội dung', dataIndex: 'content' },
                                { title: 'Mức độ', dataIndex: 'diff' },
                                { title: 'Môn', render: (_, r) => subjects.find(s => s.id === r.subjectId)?.name },
                                { title: 'Khối KT', render: (_, r) => blocks.find(b => b.id === r.blockId)?.name }
                            ]}
                        />
                    </Space>
                );
            case '4':
                return (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Select placeholder="1. Chọn môn tạo đề" style={{ width: 250, marginBottom: 16 }} onChange={setExamSubjId} value={examSubjId}>
                            {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                        </Select>
                        <Form form={formStruct} layout="inline" onFinish={onAddStruct}>
                            <Form.Item name="blockId" rules={[{ required: true }]}>
                                <Select placeholder="Khối KT" style={{ width: 140 }}>
                                    {blocks.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item name="diff" rules={[{ required: true }]}>
                                <Select placeholder="Mức độ khó" style={{ width: 140 }}>
                                    {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item name="count" rules={[{ required: true }]}><InputNumber placeholder="Số lượng" min={1} /></Form.Item>
                            <Button htmlType="submit">Thêm cấu trúc</Button>
                        </Form>
                        <Table
                            dataSource={structures}
                            rowKey={(r, i) => i + ''}
                            pagination={false}
                            columns={[
                                { title: 'Khối KT', render: (_, r) => blocks.find(b => b.id === r.blockId)?.name },
                                { title: 'Mức độ', dataIndex: 'diff' },
                                { title: 'Số lượng', dataIndex: 'count' }
                            ]}
                            style={{ marginTop: 10 }}
                        />
                        <Button type="primary" onClick={generateExam} style={{ marginTop: 16, marginBottom: 16 }}>Phát sinh Đề thi</Button>
                        {exams.map((e, idx) => (
                            <Card key={idx} type="inner" title={`Đề thi ${idx + 1} - Môn: ${subjects.find(s => s.id === e.subjectId)?.name}`} style={{ marginBottom: 16 }}>
                                {e.qs.map((q: any, i: number) => (
                                    <div key={q.id} style={{ marginBottom: 8 }}>
                                        <b>Câu {i + 1} ({q.diff} - {blocks.find(b => b.id === q.blockId)?.name}):</b> {q.content}
                                    </div>
                                ))}
                            </Card>
                        ))}
                    </Space>
                );
            default: return null;
        }
    };

    return (
        <Layout style={{ background: '#f0f2f5', minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: 0 }}>
                <Menu mode="horizontal" selectedKeys={[currentMenu]} onClick={(e) => setCurrentMenu(e.key)}>
                    <Menu.Item key="1">1. Quản lý Khối kiến thức</Menu.Item>
                    <Menu.Item key="2">2. Quản lý Môn học</Menu.Item>
                    <Menu.Item key="3">3. Ngân hàng Câu hỏi</Menu.Item>
                    <Menu.Item key="4">4. Quản lý Đề thi</Menu.Item>
                </Menu>
            </Header>
            <Content style={{ margin: '24px' }}>
                <Card>
                    {renderContent()}
                </Card>
            </Content>
        </Layout>
    );
};

export default Bai2;
