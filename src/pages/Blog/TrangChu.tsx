import React, { useState, useEffect } from 'react';
import { Card, Input, Typography, Tag, List, Space, Select, Row, Col, Avatar } from 'antd';
import { SearchOutlined, EyeOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons';
import { history } from 'umi';
import moment from 'moment';
import { getArticles, getTags, Article, Tag as TagType } from './data';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const TrangChu: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | 'all'>('all');

  useEffect(() => {
    setArticles(getArticles().filter(a => a.status === 'Published'));
    setTags(getTags());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const filteredArticles = articles.filter((article) => {
    const matchSearch = article.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                        article.summary.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchTag = selectedTagId === 'all' ? true : article.tags.includes(selectedTagId);
    return matchSearch && matchTag;
  });

  const getTagNames = (tagIds: string[]) => {
    return tagIds.map(id => {
      const t = tags.find(tag => tag.id === id);
      return t ? t.name : '';
    }).filter(name => name !== '');
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ 
        marginBottom: 32, 
        textAlign: 'center', 
        padding: '32px 24px', 
        background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f5ff 100%)',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.02)'
      }}>
        {/* Decorative blur elements */}
        <div style={{
          position: 'absolute', top: -30, left: -30, width: 120, height: 120,
          background: 'rgba(24, 144, 255, 0.1)', borderRadius: '50%', filter: 'blur(30px)'
        }} />
        <div style={{
          position: 'absolute', bottom: -30, right: -30, width: 150, height: 150,
          background: 'rgba(114, 46, 209, 0.08)', borderRadius: '50%', filter: 'blur(40px)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Title level={1} style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            marginBottom: 8, 
            letterSpacing: '-0.5px' 
          }}>
            <BookOutlined style={{ color: '#1890ff', marginRight: 12, fontSize: '2.2rem' }} />
            <span style={{ 
              background: 'linear-gradient(90deg, #1890ff, #722ed1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Blog Cá Nhân
            </span>
          </Title>
          <Paragraph style={{ 
            fontSize: '1.05rem', 
            color: '#595959', 
            maxWidth: 600, 
            margin: '0 auto', 
            lineHeight: 1.5 
          }}>
            Nơi giao lưu, lưu trữ và chia sẻ những kiến thức lập trình, kinh nghiệm phát triển phần mềm và khám phá công nghệ mới.
          </Paragraph>
        </div>
      </div>

      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Input
              size="large"
              placeholder="Nhập từ khóa tìm kiếm bài viết..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select 
              size="large"
              value={selectedTagId} 
              onChange={setSelectedTagId} 
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả danh mục thẻ</Option>
              {tags.map(tag => (
                <Option key={tag.id} value={tag.id}>{tag.name}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
        pagination={{
          pageSize: 9,
          showSizeChanger: false,
          align: 'center',
        }}
        dataSource={filteredArticles}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt={item.title}
                  src={item.coverImage || 'https://img.pikbest.com/photo/20241026/a-cat-wearing-sunglasses-and-a-suit-with-tie-view_11007366.jpg!w700wp'}
                  style={{ height: 180, objectFit: 'cover' }}
                />
              }
              onClick={() => history.push(`/blog/article/${item.id}`)}
              style={{ borderRadius: 8, overflow: 'hidden' }}
            >
              <div style={{ marginBottom: 12 }}>
                {getTagNames(item.tags).slice(0, 3).map((tagName, idx) => (
                  <Tag color="blue" key={idx}>{tagName}</Tag>
                ))}
              </div>
              
              <Title level={5} style={{ 
                margin: 0, 
                marginBottom: 8,
                height: 44,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {item.title}
              </Title>
              
              <Paragraph type="secondary" style={{ 
                height: 44,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                marginBottom: 16
              }}>
                {item.summary}
              </Paragraph>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTop: '1px solid #f0f0f0',
                paddingTop: 12,
                marginTop: 16
              }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push('/blog/about');
                  }}
                  title="Xem thông tin tác giả"
                >
                  <Avatar src="data:image/jpeg;base64,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" size="small" />
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 13, fontWeight: 500 }}>Nam Khánh</Text>
                </div>
                <Space style={{ color: '#8c8c8c', fontSize: 13 }}>
                  <span><ClockCircleOutlined /> {moment(item.createdAt).format('DD/MM/YYYY')}</span>
                  <span><EyeOutlined /> {item.viewCount}</span>
                </Space>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TrangChu;
