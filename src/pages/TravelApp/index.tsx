import React, { useState } from 'react';
import { Tabs, message } from 'antd';
import { Destination, ItineraryItem, getTravelInfo } from './types';

import HomeTab from './components/HomeTab';
import ItineraryTab from './components/ItineraryTab';
import BudgetTab from './components/BudgetTab';
import AdminTab from './components/AdminTab';

const { TabPane } = Tabs;

const initialDestinations: Destination[] = [
  { id: 1, name: 'Vịnh Hạ Long', location: 'Quảng Ninh', type: 'Biển', rating: 5, price: 1500000, visitTime: 2, costFood: 500000, costAccomm: 800000, costTransport: 200000, image: 'https://images.unsplash.com/photo-1528127269322-539801943592', desc: 'Di sản thế giới' },
  { id: 2, name: 'Sapa', location: 'Lào Cai', type: 'Núi', rating: 4.5, price: 2000000, visitTime: 3, costFood: 600000, costAccomm: 1000000, costTransport: 400000, image: 'https://images.unsplash.com/photo-1550931559-009ab44e21a4', desc: 'Thành phố sương mù' },
  { id: 3, name: 'Hội An', location: 'Quảng Nam', type: 'Thành phố', rating: 4.8, price: 1200000, visitTime: 2, costFood: 400000, costAccomm: 600000, costTransport: 200000, image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b', desc: 'Phố cổ cổ kính' }
];

const TravelApp: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [budgetLimit, setBudgetLimit] = useState(5000000);

  const handleAddDest = (values: any) => {
    setDestinations([...destinations, { ...values, id: Date.now() }]);
    message.success('Thêm thành công!');
  };

  const handleEditDest = (id: number, values: any) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, ...values } : d));
    message.success('Cập nhật thành công!');
  };

  const handleDeleteDest = (id: number) => {
    setDestinations(destinations.filter(d => d.id !== id));
    message.success('Xóa thành công!');
  };

  const addToItinerary = (dest: Destination) => {
    setItinerary([...itinerary, { ...dest, itId: Date.now(), day: 1 }]);
    message.success('Đã thêm vào lịch trình');
  };

  const totalFood = itinerary.reduce((sum, item) => sum + item.costFood * item.day, 0);
  const totalAccomm = itinerary.reduce((sum, item) => sum + item.costAccomm * item.day, 0);

  let extraTravelCost = 0;
  for (let i = 1; i < itinerary.length; i++) {
    extraTravelCost += getTravelInfo(itinerary[i - 1].location, itinerary[i].location).cost;
  }

  const totalTransport = itinerary.reduce((sum, item) => sum + item.costTransport * item.day, 0) + extraTravelCost;
  const totalCost = totalFood + totalAccomm + totalTransport;
  const isOverBudget = totalCost > budgetLimit;

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Khám phá" key="1">
          <HomeTab destinations={destinations} addToItinerary={addToItinerary} />
        </TabPane>

        <TabPane tab="Lịch trình" key="2">
          <ItineraryTab itinerary={itinerary} setItinerary={setItinerary} totalCost={totalCost} />
        </TabPane>

        <TabPane tab="Ngân sách" key="3">
          <BudgetTab 
            isOverBudget={isOverBudget} 
            totalFood={totalFood} 
            totalAccomm={totalAccomm} 
            totalTransport={totalTransport} 
            budgetLimit={budgetLimit} 
            setBudgetLimit={setBudgetLimit} 
          />
        </TabPane>

        <TabPane tab="Quản trị" key="4">
          <AdminTab destinations={destinations} handleAddDest={handleAddDest} handleEditDest={handleEditDest} handleDeleteDest={handleDeleteDest} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TravelApp;
