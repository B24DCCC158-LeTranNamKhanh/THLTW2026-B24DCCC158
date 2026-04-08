import React from 'react';
import { Row, Col, Card, Statistic, List, Button, InputNumber, Space } from 'antd';
import { DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { ItineraryItem, getTravelInfo } from '../types';

interface ItineraryTabProps {
  itinerary: ItineraryItem[];
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
  totalCost: number;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ itinerary, setItinerary, totalCost }) => {
  const handleRemove = (itId: number) => {
    setItinerary(itinerary.filter(i => i.itId !== itId));
  };

  const handleUpdateDay = (itId: number, day: number | null) => {
    if (!day) return;
    setItinerary(itinerary.map(i => i.itId === itId ? { ...i, day } : i));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItinerary = [...itinerary];
    if (direction === 'up' && index > 0) {
      const temp = newItinerary[index - 1];
      newItinerary[index - 1] = newItinerary[index];
      newItinerary[index] = temp;
    } else if (direction === 'down' && index < newItinerary.length - 1) {
      const temp = newItinerary[index + 1];
      newItinerary[index + 1] = newItinerary[index];
      newItinerary[index] = temp;
    }
    setItinerary(newItinerary);
  };

  return (
    <Row gutter={16}>
      <Col xs={24} md={16}>
        <List
          header={<div>Danh sách điểm đến đã chọn</div>}
          bordered
          dataSource={itinerary}
          renderItem={(item, index) => {
             // Tính thời gian di chuyển giả định từ điểm trước đó
             let travelTime = '';
             let prevItem = index > 0 ? itinerary[index - 1] : null;
             if (prevItem) {
               const travelInfo = getTravelInfo(prevItem.location, item.location);
               if (travelInfo.time > 0) {
                 travelTime = `(Đi từ ${prevItem.name}: ~ ${travelInfo.time} giờ, vé đi lại: ${travelInfo.cost.toLocaleString()} VNĐ)`;
               }
             }

             return (
              <List.Item
                actions={[
                  <Space key="actions">
                    <InputNumber min={1} value={item.day} onChange={v => handleUpdateDay(item.itId, v)} title="Số ngày ở lại" />
                    <Button icon={<UpOutlined />} size="small" onClick={() => handleMove(index, 'up')} disabled={index === 0} />
                    <Button icon={<DownOutlined />} size="small" onClick={() => handleMove(index, 'down')} disabled={index === itinerary.length - 1} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleRemove(item.itId)} />
                  </Space>
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={
                    <>
                      <div>Lưu lại {item.day} ngày - Chi phí: {((item.costFood + item.costAccomm + item.costTransport) * item.day).toLocaleString()} VNĐ</div>
                      {travelTime && <div style={{ color: 'gray', fontSize: 12 }}>{travelTime}</div>}
                    </>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Col>
      <Col xs={24} md={8}>
        <Card title="Tổng quan chuyến đi">
          <Statistic title="Tổng ngân sách dự kiến" value={totalCost} suffix="VNĐ" />
          <Statistic title="Số lượng điểm đến" value={itinerary.length} />
        </Card>
      </Col>
    </Row>
  );
};

export default ItineraryTab;
