import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag, Space, Button, Divider, Row, Col, List } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams, history } from 'umi';
import moment from 'moment';
import { marked } from 'marked';
import { getArticleById, incrementViewCount, getTags, Article, Tag as TagType, getArticles } from './data';

const { Title, Paragraph } = Typography;

const ChiTietBaiViet: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [tags, setTags] = useState<TagType[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (params.id) {
      const art = getArticleById(params.id);
      if (art) {
        setArticle(art);
        incrementViewCount(params.id);
        
        setArticle(getArticleById(params.id) || art);

        const allTags = getTags();
        setTags(allTags);

        const allArticles = getArticles().filter(a => a.status === 'Published');
        const related = allArticles.filter(a => 
          a.id !== art.id && a.tags.some(t => art.tags.includes(t))
        );
        setRelatedArticles(related.slice(0, 3));
      } else {
        history.push('/blog/home');
      }
    }
  }, [params.id]);

  if (!article) {
    return null;
  }

  const getTagNames = (tagIds: string[]) => {
    return tagIds.map(id => {
      const t = tags.find(tag => tag.id === id);
      return t ? t.name : '';
    }).filter(name => name !== '');
  };

  const createMarkup = (content: string) => {
    return { __html: marked(content) };
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => history.goBack()}
        style={{ paddingLeft: 0, marginBottom: 16 }}
      >
        Quay lại danh sách
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Title level={1} style={{ marginTop: 0 }}>{article.title}</Title>
            
            <Space split={<Divider type="vertical" />} style={{ color: '#8c8c8c', marginBottom: 24 }}>
              <span><ClockCircleOutlined /> {moment(article.createdAt).format('DD/MM/YYYY HH:mm')}</span>
              <span><EyeOutlined /> {article.viewCount} lượt xem</span>
            </Space>

            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <img 
                src={article.coverImage || 'https://img.pikbest.com/photo/20241026/a-cat-wearing-sunglasses-and-a-suit-with-tie-view_11007366.jpg!w700wp'} 
                alt={article.title} 
                style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, objectFit: 'cover' }} 
              />
            </div>

            <div 
              className="markdown-body"
              style={{ fontSize: 16, lineHeight: 1.8 }}
              dangerouslySetInnerHTML={createMarkup(article.content)}
            />

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <span style={{ marginRight: 8, fontWeight: 'bold' }}>Thẻ:</span>
              <Space wrap>
                {getTagNames(article.tags).map((tagName, idx) => (
                  <Tag color="blue" key={idx}>{tagName}</Tag>
                ))}
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Tác giả" 
            style={{ borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}
            onClick={() => history.push('/blog/about')}
            hoverable
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="data:image/jpeg;base64,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" 
                alt="Avatar" 
                style={{ width: 64, height: 64, borderRadius: '50%', marginRight: 16 }}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>Nam Khánh</Title>
                <div style={{ color: '#8c8c8c' }}>Web Developer</div>
              </div>
            </div>
            <Paragraph style={{ marginTop: 16 }}>
              Chia sẻ kiến thức lập trình và công nghệ thông tin.
            </Paragraph>
          </Card>

          {relatedArticles.length > 0 && (
            <Card title="Bài viết liên quan" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <List
                itemLayout="horizontal"
                dataSource={relatedArticles}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <a onClick={() => history.push(`/blog/article/${item.id}`)}>
                          {item.title}
                        </a>
                      }
                      description={`${moment(item.createdAt).format('DD/MM/YYYY')} · ${item.viewCount} lượt xem`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ChiTietBaiViet;
