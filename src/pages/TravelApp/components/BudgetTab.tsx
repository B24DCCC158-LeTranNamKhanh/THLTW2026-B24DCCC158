import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Alert, InputNumber, Divider, Button, Space } from 'antd';
import ReactApexChart from 'react-apexcharts';

interface BudgetTabProps {
  isOverBudget: boolean;
  totalFood: number;
  totalAccomm: number;
  totalTransport: number;
  budgetLimit: number;
  setBudgetLimit: (val: number) => void;
}

const BudgetTab: React.FC<BudgetTabProps> = ({ isOverBudget, totalFood, totalAccomm, totalTransport, budgetLimit, setBudgetLimit }) => {
  const budgetOptions = {
    labels: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
    responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
  };

  const totalCost = totalFood + totalAccomm + totalTransport;
  const balance = budgetLimit - totalCost;
  const isBalanceNegative = balance < 0;

  return (
    <>
      {isOverBudget && <Alert message={`Cảnh báo: Bạn đã vượt quá ngân sách ${Math.abs(balance).toLocaleString()} VNĐ!`} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card 
            title="Chi tiết chi phí" 
            extra={
              <Space>
                <span>Ngân sách:</span>
                <InputNumber 
                  style={{ width: 120 }} 
                  value={budgetLimit} 
                  onChange={(val) => setBudgetLimit(val || 0)} 
                  step={500000}
                  min={0}
                  controls={false}
                />
              </Space>
            }
          >
            <Statistic title="Ăn uống" value={totalFood} suffix="VNĐ" />
            <Statistic title="Lưu trú" value={totalAccomm} suffix="VNĐ" />
            <Statistic title="Di chuyển" value={totalTransport} suffix="VNĐ" />
            <Divider />
            <Statistic title="Tổng ngân sách" value={budgetLimit} suffix="VNĐ" />
            <Statistic title="Tổng thiết hại" value={totalCost} suffix="VNĐ" />
            <Statistic 
               title={isBalanceNegative ? 'Số tiền VƯỢT QUÁ' : 'Số tiền CÒN DƯ'} 
               value={Math.abs(balance)} 
               valueStyle={{ color: isBalanceNegative ? '#cf1322' : '#3f8600' }} 
               suffix="VNĐ" 
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Biểu đồ phân bổ">
            <ReactApexChart options={budgetOptions as any} series={[totalFood, totalAccomm, totalTransport]} type="pie" height={300} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BudgetTab;
