import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import Chart from 'react-apexcharts';
import { Registration, Club, getRegistrations, getClubs } from '../data';

const BaoCao: React.FC = () => {
  const [registrations, setRegsState] = useState<Registration[]>([]);
  const [clubs, setClubsState] = useState<Club[]>([]);

  useEffect(() => {
    setRegsState(getRegistrations());
    setClubsState(getClubs());
  }, []);

  const pending = registrations.filter(r => r.status === 'Pending').length;
  const approved = registrations.filter(r => r.status === 'Approved').length;
  const rejected = registrations.filter(r => r.status === 'Rejected').length;

  const getChartData = () => {
    const categories = clubs.map(c => c.name);
    const pendingData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Pending').length);
    const approvedData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Approved').length);
    const rejectedData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Rejected').length);

    return {
      series: [
        { name: 'Tạm ngưng (Pending)', data: pendingData },
        { name: 'Đã duyệt (Approved)', data: approvedData },
        { name: 'Từ chối (Rejected)', data: rejectedData }
      ],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: false,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 4
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: categories,
        },
        yaxis: {
          title: {
            text: 'Số lượng đơn'
          }
        },
        fill: {
          opacity: 1
        },
        colors: ['#faad14', '#52c41a', '#f5222d'],
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val + " đơn";
            }
          }
        }
      } as any
    };
  };

  const chartInfo = getChartData();

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h2 style={{ marginBottom: 24 }}>Báo cáo và thống kê</h2>
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered size="small">
            <Statistic title="Tổng số CLB" value={clubs.length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered size="small">
            <Statistic title="Đơn chờ duyệt" value={pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered size="small">
            <Statistic title="Đơn đã duyệt" value={approved} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered size="small">
            <Statistic title="Đơn từ chối" value={rejected} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Thống kê số đơn đăng ký theo từng Câu lạc bộ" bordered={false} style={{ borderRadius: 8 }}>
            {clubs.length > 0 && (
              <Chart 
                options={chartInfo.options} 
                series={chartInfo.series} 
                type="bar" 
                height={400} 
              />
            )}
            {clubs.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                Chưa có dữ liệu câu lạc bộ
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BaoCao;
