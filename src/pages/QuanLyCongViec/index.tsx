import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ThongKe from './ThongKe';
import BangKanban from './BangKanban';
import DanhSachCongViec from './DanhSachCongViec';
import BieuMauCongViec, { Task } from './BieuMauCongViec';

const { TabPane } = Tabs;

const QuanLyCongViec: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('task_tracker_data');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Failed to parse tasks from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('task_tracker_data', JSON.stringify(tasks));
  }, [tasks]);

  const handleOpenModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const handleSubmitTask = (values: Omit<Task, 'id' | 'status'>) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...values } : t)));
      message.success('Cập nhật công việc thành công!');
    } else {
      const newTask: Task = {
        ...values,
        id: Math.random().toString(36).substring(2, 9),
        status: 'Cần làm',
      };
      setTasks([...tasks, newTask]);
      message.success('Thêm công việc thành công!');
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    message.success('Xóa công việc thành công!');
  };

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  return (
    <PageContainer
      title="Theo dõi công việc cá nhân"
      extra={[
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Thêm công việc
        </Button>,
      ]}
    >
      <div style={{ background: '#fff', padding: '24px', minHeight: '600px' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thống kê" key="1">
            <ThongKe tasks={tasks} />
          </TabPane>
          <TabPane tab="Bảng Kanban" key="2">
            <BangKanban
              tasks={tasks}
              onTaskMove={handleTaskMove}
              onEditTask={handleOpenModal}
              onDeleteTask={handleDeleteTask}
            />
          </TabPane>
          <TabPane tab="Danh sách task" key="3">
            <DanhSachCongViec
              tasks={tasks}
              onEditTask={handleOpenModal}
              onDeleteTask={handleDeleteTask}
            />
          </TabPane>
        </Tabs>
      </div>

      <BieuMauCongViec
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitTask}
        initialValues={editingTask}
      />
    </PageContainer>
  );
};

export default QuanLyCongViec;
