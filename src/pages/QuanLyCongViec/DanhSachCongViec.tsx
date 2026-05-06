import React, { useState } from 'react';
import { Table, Tag, Input, Space, Button } from 'antd';
import { Task } from './BieuMauCongViec';
import moment from 'moment';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface DanhSachCongViecProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Cao':
      return 'red';
    case 'Trung bình':
      return 'orange';
    case 'Thấp':
      return 'green';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hoàn thành':
      return 'green';
    case 'Đang làm':
      return 'blue';
    default:
      return 'default';
  }
};

const DanhSachCongViec: React.FC<DanhSachCongViecProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  const [searchText, setSearchText] = useState('');

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Task> = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Cần làm', value: 'Cần làm' },
        { text: 'Đang làm', value: 'Đang làm' },
        { text: 'Hoàn thành', value: 'Hoàn thành' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        { text: 'Cao', value: 'Cao' },
        { text: 'Trung bình', value: 'Trung bình' },
        { text: 'Thấp', value: 'Thấp' },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: 'Thời hạn',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return moment(a.deadline).valueOf() - moment(b.deadline).valueOf();
      },
      render: (deadline) => deadline ? moment(deadline).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Thẻ',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags && tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEditTask(record)}
            size="small"
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteTask(record.id)}
            size="small"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên công việc"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredTasks}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DanhSachCongViec;
