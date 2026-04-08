import React, { useState } from 'react';
import { Row, Col, Card, Select, Button, Tag, Rate } from 'antd';
import { Destination } from '../types';

const { Option } = Select;

interface HomeTabProps {
  destinations: Destination[];
  addToItinerary: (dest: Destination) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ destinations, addToItinerary }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [sortPrice, setSortPrice] = useState<string>('None');

  let filteredDestinations = [...destinations];
  if (filterType !== 'All') {
    filteredDestinations = filteredDestinations.filter(d => d.type === filterType);
  }
  if (sortPrice === 'Asc') {
    filteredDestinations.sort((a, b) => a.price - b.price);
  } else if (sortPrice === 'Desc') {
    filteredDestinations.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Select style={{ width: 150, marginRight: 16 }} defaultValue="All" onChange={setFilterType}>
          <Option value="All">Tất cả loại</Option>
          <Option value="Biển">Biển</Option>
          <Option value="Núi">Núi</Option>
          <Option value="Thành phố">Thành phố</Option>
        </Select>
        <Select style={{ width: 150 }} defaultValue="None" onChange={setSortPrice}>
          <Option value="None">Sắp xếp giá</Option>
          <Option value="Asc">Giá tăng dần</Option>
          <Option value="Desc">Giá giảm dần</Option>
        </Select>
      </div>
      <Row gutter={[16, 16]}>
        {filteredDestinations.map(d => (
          <Col xs={24} sm={12} md={8} lg={6} key={d.id}>
            <Card
              hoverable
              cover={<img alt={d.name} src={d.image} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[<Button type="primary" onClick={() => addToItinerary(d)}>Thêm</Button>]}
            >
              <Card.Meta title={d.name} description={d.location} />
              <div style={{ marginTop: 10 }}>
                <Tag color="blue">{d.type}</Tag>
                <div>Giá: {d.price.toLocaleString()} VNĐ</div>
                <Rate disabled defaultValue={d.rating} style={{ fontSize: 14 }} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeTab;
