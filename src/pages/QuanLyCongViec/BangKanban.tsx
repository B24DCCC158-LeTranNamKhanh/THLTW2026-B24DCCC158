import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Tag, Typography, Button } from 'antd';
import { Task } from './BieuMauCongViec';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface BangKanbanProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const COLUMN_KEYS: Task['status'][] = ['Cần làm', 'Đang làm', 'Hoàn thành'];
const COLUMN_TITLES = {
  'Cần làm': 'Cần làm',
  'Đang làm': 'Đang làm',
  'Hoàn thành': 'Hoàn thành',
};

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

const BangKanban: React.FC<BangKanbanProps> = ({ tasks, onTaskMove, onEditTask, onDeleteTask }) => {
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onTaskMove(draggableId, destination.droppableId as Task['status']);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px', padding: '24px 0', overflowX: 'auto' }}>
        {COLUMN_KEYS.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);

          return (
            <div
              key={status}
              style={{
                background: '#f0f2f5',
                padding: '16px',
                borderRadius: '8px',
                width: '320px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography.Title level={5} style={{ marginBottom: '16px' }}>
                {COLUMN_TITLES[status]} ({columnTasks.length})
              </Typography.Title>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ flexGrow: 1, minHeight: '300px' }}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              marginBottom: '8px',
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Card
                              size="small"
                              title={task.name}
                              extra={
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEditTask(task)} />
                                  <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDeleteTask(task.id)} />
                                </div>
                              }
                            >
                              {task.description && (
                                <p style={{ marginBottom: '8px', color: '#666' }}>{task.description}</p>
                              )}
                              <div style={{ marginBottom: '8px' }}>
                                <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                                {task.deadline && (
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {moment(task.deadline).format('DD/MM/YYYY HH:mm')}
                                  </Text>
                                )}
                              </div>
                              {task.tags && task.tags.length > 0 && (
                                <div>
                                  {task.tags.map((tag) => (
                                    <Tag key={tag} style={{ marginTop: '4px' }}>{tag}</Tag>
                                  ))}
                                </div>
                              )}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default BangKanban;
