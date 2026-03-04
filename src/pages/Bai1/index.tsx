import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';

const Bai1: React.FC = () => {
    const [targetNumber, setTargetNumber] = useState<number>(0);
    const [guess, setGuess] = useState<number | null>(null);
    const [attempts, setAttempts] = useState<number>(10);
    const [message, setMessage] = useState<string>('');
    const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

    const initGame = () => {
        setTargetNumber(Math.floor(Math.random() * 100) + 1);
        setAttempts(10);
        setGuess(null);
        setMessage('');
        setStatus('playing');
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleGuess = () => {
        if (guess === null || status !== 'playing') return;

        if (guess === targetNumber) {
            setMessage('Chúc mừng! Bạn đã đoán đúng!');
            setStatus('won');
        } else {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);

            if (newAttempts === 0) {
                setMessage(`Bạn đã hết lượt! Số đúng là ${targetNumber}.`);
                setStatus('lost');
            } else if (guess < targetNumber) {
                setMessage('Bạn đoán quá thấp!');
            } else {
                setMessage('Bạn đoán quá cao!');
            }
        }

        // xoa o input sau khi doan
        setGuess(null);
    };

    return (
        <PageContainer>
            <div style={{ padding: 20, background: '#fff', border: '1px solid #ccc' }}>
                <h2>Trò Chơi Đoán Số</h2>
                <p>Hệ thống đã sinh ra một số ngẫu nhiên từ 1 đến 100.</p>
                <p><strong>Bạn còn {attempts} lượt dự đoán.</strong></p>

                <div style={{ margin: '20px 0' }}>
                    <input
                        type="number"
                        min={1} max={100}
                        value={guess !== null ? guess : ''}
                        onChange={(e) => setGuess(e.target.value ? Number(e.target.value) : null)}
                        disabled={status !== 'playing'}
                        style={{ width: 120, marginRight: 10, padding: 5 }}
                        placeholder="Nhập số..."
                        onKeyDown={(e) => { if (e.key === 'Enter') handleGuess(); }}
                    />
                    <button onClick={handleGuess} disabled={status !== 'playing' || guess === null} style={{ padding: 5 }}>
                        Đoán
                    </button>
                </div>

                {message && (
                    <div style={{ color: status === 'won' ? 'green' : status === 'lost' ? 'red' : 'orange', marginBottom: 20 }}>
                        {message}
                    </div>
                )}

                {status !== 'playing' && (
                    <button onClick={initGame} style={{ padding: 5 }}>Chơi Lại</button>
                )}
            </div>
        </PageContainer>
    );
};

export default Bai1;
