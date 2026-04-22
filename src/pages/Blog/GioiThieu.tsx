import React from 'react';
import { Card, Row, Col, Typography, Divider, Tag, Space } from 'antd';
import { GithubOutlined, FacebookOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const GioiThieu: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Card style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <div style={{ height: 200, background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)' }}></div>
        
        <div style={{ padding: '0 32px 32px', position: 'relative' }}>
          <div style={{ marginTop: -64, marginBottom: 16 }}>
            <img 
              src="data:image/jpeg;base64,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" 
              alt="Avatar" 
              style={{ width: 128, height: 128, borderRadius: '50%', border: '4px solid white', backgroundColor: 'white', objectFit: 'cover' }}
            />
          </div>

          <Title level={2} style={{ marginBottom: 4 }}>Lê Trần Nam Khánh</Title>
          <Text type="secondary" style={{ fontSize: 16 }}><EnvironmentOutlined /> Hà Nội, Việt Nam</Text>
          
          <Paragraph style={{ marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
            Xin chào! Tôi là một nhà phát triển phần mềm đam mê tạo ra các ứng dụng web với giao diện đẹp mắt và trải nghiệm người dùng tuyệt vời. 
            Tôi thích học hỏi các công nghệ mới và chia sẻ kiến thức thông qua blog cá nhân này.
          </Paragraph>

          <Divider orientation="left">Kỹ năng chuyên môn</Divider>
          <Space wrap size={[0, 8]}>
            <Tag color="magenta">ReactJS</Tag>
            <Tag color="red">Angular</Tag>
            <Tag color="volcano">HTML/CSS</Tag>
            <Tag color="orange">JavaScript</Tag>
            <Tag color="gold">TypeScript</Tag>
            <Tag color="lime">NodeJS</Tag>
            <Tag color="green">Ant Design</Tag>
            <Tag color="cyan">Tailwind CSS</Tag>
            <Tag color="blue">Git</Tag>
          </Space>

          <Divider orientation="left">Liên hệ & Mạng xã hội</Divider>
          <Space size="large">
            <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#24292e', fontSize: 24 }}>
              <GithubOutlined />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#1877F2', fontSize: 24 }}>
              <FacebookOutlined />
            </a>
            <a href="mailto:example@outlook.com" style={{ color: '#0078d4', fontSize: 24 }}>
              <MailOutlined />
            </a>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default GioiThieu;
