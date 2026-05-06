import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { Task } from './BieuMauCongViec';
import moment from 'moment';

interface ThongKeProps {
  tasks: Task[];
}

const ThongKe: React.FC<ThongKeProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Hoàn thành').length;
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'Hoàn thành') return false;
    if (!t.deadline) return false;
    return moment(t.deadline).isBefore(moment());
  }).length;

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số công việc"
              value={totalTasks}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Công việc đã hoàn thành"
              value={completedTasks}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Công việc quá hạn"
              value={overdueTasks}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThongKe;
