import React, { useState } from 'react';
import { Card, Button, Table, Space, Typography } from 'antd';

const { Title } = Typography;

const Bai1: React.FC = () => {
    const [history, setHistory] = useState<any[]>([]);
    const choices = ['Kéo', 'Búa', 'Bao'];

    const handlePlay = (playerChoice: string) => {
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        let result = 'Hòa';

        if (
            (playerChoice === 'Kéo' && computerChoice === 'Bao') ||
            (playerChoice === 'Búa' && computerChoice === 'Kéo') ||
            (playerChoice === 'Bao' && computerChoice === 'Búa')
        ) {
            result = 'Thắng';
        } else if (playerChoice !== computerChoice) {
            result = 'Thua';
        }

        setHistory([{ key: Date.now(), playerChoice, computerChoice, result }, ...history]);
    };

    return (
        <Card title="Trò chơi Oẳn Tù Tì">
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                    <Button type="primary" onClick={() => handlePlay('Kéo')}>Kéo</Button>
                    <Button type="primary" onClick={() => handlePlay('Búa')}>Búa</Button>
                    <Button type="primary" onClick={() => handlePlay('Bao')}>Bao</Button>
                </Space>

                {history.length > 0 && (
                    <Title level={4}>
                        Kết quả: Bạn chọn {history[0].playerChoice} - Máy chọn {history[0].computerChoice} - {history[0].result}
                    </Title>
                )}

                <Table
                    dataSource={history}
                    columns={[
                        { title: 'Bạn chọn', dataIndex: 'playerChoice' },
                        { title: 'Máy chọn', dataIndex: 'computerChoice' },
                        { title: 'Kết quả', dataIndex: 'result' },
                    ]}
                />
            </Space>
        </Card>
    );
};

export default Bai1;