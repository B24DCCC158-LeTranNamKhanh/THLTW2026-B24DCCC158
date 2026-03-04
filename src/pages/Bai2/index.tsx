import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Tabs, Button, Table, Modal, Form, Input, InputNumber, Select, DatePicker, message, Space, Progress } from 'antd';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;

const generateId = () => Math.random().toString(36).substr(2, 9);

interface Subject {
    id: string;
    name: string;
}

interface StudySession {
    id: string;
    subjectId: string;
    date: string; // YYYY-MM-DD HH:mm
    duration: number; // so phut
    content: string;
    note: string;
}

interface Goal {
    id: string;
    subjectId: string; // 'all' hoac subjectId
    month: string; // YYYY-MM
    targetDuration: number; // so phut
}

const Bai2: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);

    // load du lieu tu localstorage
    useEffect(() => {
        const savedSubjects = localStorage.getItem('bai2_subjects');
        const savedSessions = localStorage.getItem('bai2_sessions');
        const savedGoals = localStorage.getItem('bai2_goals');

        if (savedSubjects) {
            setSubjects(JSON.parse(savedSubjects));
        } else {
            setSubjects([
                { id: '1', name: 'Toán' },
                { id: '2', name: 'Văn' },
                { id: '3', name: 'Anh' },
                { id: '4', name: 'Khoa học' },
                { id: '5', name: 'Công nghệ' },
            ]);
        }

        if (savedSessions) setSessions(JSON.parse(savedSessions));
        if (savedGoals) setGoals(JSON.parse(savedGoals));
    }, []);

    // luu du lieu vao localstorage
    useEffect(() => {
        if (subjects.length > 0) localStorage.setItem('bai2_subjects', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('bai2_sessions', JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        localStorage.setItem('bai2_goals', JSON.stringify(goals));
    }, [goals]);

    // state quan ly modal
    const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
    const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
    const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);

    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [editingSession, setEditingSession] = useState<StudySession | null>(null);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const [subjectForm] = Form.useForm();
    const [sessionForm] = Form.useForm();
    const [goalForm] = Form.useForm();

    // ----- mon hoc -----
    const openSubjectModal = (record?: Subject) => {
        setEditingSubject(record || null);
        if (record) {
            subjectForm.setFieldsValue(record);
        } else {
            subjectForm.resetFields();
        }
        setIsSubjectModalVisible(true);
    };

    const handleSubjectSave = (values: any) => {
        if (editingSubject) {
            setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, name: values.name } : s));
            message.success('Cập nhật môn học thành công');
        } else {
            setSubjects([...subjects, { id: generateId(), name: values.name }]);
            message.success('Thêm môn học thành công');
        }
        setIsSubjectModalVisible(false);
    };

    const deleteSubject = (id: string) => {
        setSubjects(subjects.filter(s => s.id !== id));
        message.success('Đã xóa môn học');
    };

    const subjectColumns = [
        { title: 'Tên môn học', dataIndex: 'name', key: 'name' },
        {
            title: 'Hành động', key: 'action', render: (_: any, record: Subject) => (
                <Space>
                    <Button size="small" onClick={() => openSubjectModal(record)}>Sửa</Button>
                    <Button size="small" danger onClick={() => deleteSubject(record.id)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    // ----- tien do -----
    const openSessionModal = (record?: StudySession) => {
        setEditingSession(record || null);
        if (record) {
            sessionForm.setFieldsValue({
                ...record,
                date: moment(record.date, 'YYYY-MM-DD HH:mm'),
            });
        } else {
            sessionForm.resetFields();
        }
        setIsSessionModalVisible(true);
    };

    const handleSessionSave = (values: any) => {
        const sessionData = {
            ...values,
            date: values.date.format('YYYY-MM-DD HH:mm'),
        };

        if (editingSession) {
            setSessions(sessions.map(s => s.id === editingSession.id ? { ...s, ...sessionData } : s));
            message.success('Cập nhật tiến độ thành công');
        } else {
            setSessions([...sessions, { id: generateId(), ...sessionData }]);
            message.success('Thêm tiến độ thành công');
        }
        setIsSessionModalVisible(false);
    };

    const deleteSession = (id: string) => {
        setSessions(sessions.filter(s => s.id !== id));
        message.success('Đã xóa tiến độ');
    };

    const sessionColumns = [
        {
            title: 'Môn học',
            dataIndex: 'subjectId',
            render: (id: string) => subjects.find(s => s.id === id)?.name || 'Không rõ'
        },
        { title: 'Thời gian học', dataIndex: 'date' },
        { title: 'Thời lượng (phút)', dataIndex: 'duration' },
        { title: 'Nội dung', dataIndex: 'content' },
        { title: 'Ghi chú', dataIndex: 'note' },
        {
            title: 'Hành động', render: (_: any, record: StudySession) => (
                <Space>
                    <Button size="small" onClick={() => openSessionModal(record)}>Sửa</Button>
                    <Button size="small" danger onClick={() => deleteSession(record.id)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    // ----- muc tieu -----
    const openGoalModal = (record?: Goal) => {
        setEditingGoal(record || null);
        if (record) {
            goalForm.setFieldsValue({
                ...record,
                month: moment(record.month, 'YYYY-MM'),
            });
        } else {
            goalForm.resetFields();
        }
        setIsGoalModalVisible(true);
    };

    const handleGoalSave = (values: any) => {
        const goalData = {
            ...values,
            month: values.month.format('YYYY-MM'),
        };

        if (editingGoal) {
            setGoals(goals.map(g => g.id === editingGoal.id ? { ...g, ...goalData } : g));
            message.success('Cập nhật mục tiêu thành công');
        } else {
            setGoals([...goals, { id: generateId(), ...goalData }]);
            message.success('Thêm mục tiêu thành công');
        }
        setIsGoalModalVisible(false);
    };

    const deleteGoal = (id: string) => {
        setGoals(goals.filter(g => g.id !== id));
        message.success('Đã xóa mục tiêu');
    };

    // tinh toan tien do
    const getProgress = (goal: Goal) => {
        const relevantSessions = sessions.filter(session => {
            const isSameMonth = session.date.startsWith(goal.month);
            const isRelevantSubject = goal.subjectId === 'all' || session.subjectId === goal.subjectId;
            return isSameMonth && isRelevantSubject;
        });

        const totalDuration = relevantSessions.reduce((sum, session) => sum + session.duration, 0);
        const percentage = Math.min(100, Math.round((totalDuration / goal.targetDuration) * 100));
        const isCompleted = totalDuration >= goal.targetDuration;

        return { totalDuration, percentage, isCompleted };
    };

    const goalColumns = [
        {
            title: 'Tháng',
            dataIndex: 'month'
        },
        {
            title: 'Phạm vi',
            dataIndex: 'subjectId',
            render: (id: string) => id === 'all' ? 'Tất cả các môn' : (subjects.find(s => s.id === id)?.name || 'Không rõ')
        },
        { title: 'Mục tiêu (phút)', dataIndex: 'targetDuration' },
        {
            title: 'Tiến độ',
            render: (_: any, record: Goal) => {
                const { totalDuration, percentage, isCompleted } = getProgress(record);
                return (
                    <div style={{ width: 150 }}>
                        <div>{totalDuration} / {record.targetDuration} phút</div>
                        <Progress percent={percentage} status={isCompleted ? 'success' : 'active'} />
                        <span style={{ color: isCompleted ? 'green' : 'orange' }}>
                            {isCompleted ? 'Hoàn thành' : 'Chưa đạt'}
                        </span>
                    </div>
                );
            }
        },
        {
            title: 'Hành động', render: (_: any, record: Goal) => (
                <Space>
                    <Button size="small" onClick={() => openGoalModal(record)}>Sửa</Button>
                    <Button size="small" danger onClick={() => deleteGoal(record.id)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <PageContainer>
            <div style={{ background: '#fff', padding: 20, border: '1px solid #ccc' }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Quản Lý Môn Học" key="1">
                        <Button onClick={() => openSubjectModal()} style={{ marginBottom: 16 }}>Thêm Môn Học</Button>
                        <Table dataSource={subjects} columns={subjectColumns} rowKey="id" pagination={false} size="small" />
                    </TabPane>

                    <TabPane tab="Tiến Độ Học Tập" key="2">
                        <Button onClick={() => openSessionModal()} style={{ marginBottom: 16 }}>Thêm Tiến Độ</Button>
                        <Table dataSource={sessions} columns={sessionColumns} rowKey="id" size="small" />
                    </TabPane>

                    <TabPane tab="Mục Tiêu Hàng Tháng" key="3">
                        <Button onClick={() => openGoalModal()} style={{ marginBottom: 16 }}>Thêm Mục Tiêu</Button>
                        <Table dataSource={goals} columns={goalColumns} rowKey="id" size="small" />
                    </TabPane>
                </Tabs>

                {/* modal mon hoc */}
                <Modal title={editingSubject ? "Sửa môn học" : "Thêm môn học"} visible={isSubjectModalVisible} onOk={() => subjectForm.submit()} onCancel={() => setIsSubjectModalVisible(false)} destroyOnClose>
                    <Form form={subjectForm} onFinish={handleSubjectSave} layout="vertical">
                        <Form.Item name="name" label="Tên môn học" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* modal tien do */}
                <Modal title={editingSession ? "Sửa tiến độ" : "Thêm tiến độ"} visible={isSessionModalVisible} onOk={() => sessionForm.submit()} onCancel={() => setIsSessionModalVisible(false)} destroyOnClose>
                    <Form form={sessionForm} onFinish={handleSessionSave} layout="vertical">
                        <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
                            <Select>
                                {subjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="date" label="Thời gian học" rules={[{ required: true }]}>
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="content" label="Nội dung đã học" rules={[{ required: true }]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="note" label="Ghi chú">
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* modal muc tieu */}
                <Modal title={editingGoal ? "Sửa mục tiêu" : "Thêm mục tiêu"} visible={isGoalModalVisible} onOk={() => goalForm.submit()} onCancel={() => setIsGoalModalVisible(false)} destroyOnClose>
                    <Form form={goalForm} onFinish={handleGoalSave} layout="vertical">
                        <Form.Item name="month" label="Tháng" rules={[{ required: true }]}>
                            <DatePicker picker="month" format="YYYY-MM" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="subjectId" label="Phạm vi" rules={[{ required: true }]}>
                            <Select>
                                <Option value="all">Tất cả các môn</Option>
                                {subjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="targetDuration" label="Mục tiêu (phút)" rules={[{ required: true }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </PageContainer>
    );
};

export default Bai2;
