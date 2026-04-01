export interface Club {
  id: string;
  avatar: string;
  name: string;
  foundedDate: string;
  description: string;
  president: string;
  isActive: boolean;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  strengths: string;
  clubId: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectReason?: string;
  createdAt: string;
}

export interface HistoryLog {
  id: string;
  action: string;
  time: string;
  details: string;
}

const CLUBS_KEY = 'QCLB_CLUBS';
const REGS_KEY = 'QCLB_REGS';
const HISTORY_KEY = 'QCLB_HISTORY';

export const initData = () => {
  if (!localStorage.getItem(CLUBS_KEY)) {
    localStorage.setItem(CLUBS_KEY, JSON.stringify([
      { id: '1', avatar: 'https://joeschmoe.io/api/v1/random', name: 'CLB Âm Nhạc', foundedDate: '2022-01-01', description: 'Nơi giao lưu âm nhạc', president: 'Nguyễn Văn A', isActive: true },
      { id: '2', avatar: 'https://joeschmoe.io/api/v1/jodi', name: 'CLB Tin Học', foundedDate: '2023-02-01', description: 'Lập trình viên tương lai', president: 'Trần Thị B', isActive: true },
      { id: '3', avatar: 'https://joeschmoe.io/api/v1/jake', name: 'CLB Tiếng Anh', foundedDate: '2021-05-15', description: 'Learn English together', president: 'Lê C', isActive: false },
    ]));
  }
  if (!localStorage.getItem(REGS_KEY)) {
    localStorage.setItem(REGS_KEY, JSON.stringify([
      { id: '1', fullName: 'Lê Văn C', email: 'c@gmail.com', phone: '0123456789', gender: 'Nam', address: 'Hà Nội', strengths: 'Hát, Đàn', clubId: '1', reason: 'Yêu âm nhạc', status: 'Pending', createdAt: new Date().toISOString() },
      { id: '2', fullName: 'Phạm Thị D', email: 'd@gmail.com', phone: '0987654321', gender: 'Nữ', address: 'HCM', strengths: 'Code', clubId: '2', reason: 'Muốn học lập trình', status: 'Approved', createdAt: new Date().toISOString() },
      { id: '3', fullName: 'Đặng E', email: 'e@gmail.com', phone: '0988776655', gender: 'Nam', address: 'Đà Nẵng', strengths: 'Tiếng Anh', clubId: '3', reason: 'Improve skills', status: 'Rejected', rejectReason: 'Chưa đủ yêu cầu sơ loại', createdAt: new Date().toISOString() },
      { id: '4', fullName: 'Vũ F', email: 'f@gmail.com', phone: '0911223344', gender: 'Nữ', address: 'Hải Phòng', strengths: 'Giao tiếp', clubId: '1', reason: 'Biết đánh nhạc cụ', status: 'Approved', createdAt: new Date().toISOString() },
    ]));
  }
  if (!localStorage.getItem(HISTORY_KEY)) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  }
};

export const getClubs = (): Club[] => {
  initData();
  return JSON.parse(localStorage.getItem(CLUBS_KEY) || '[]');
};
export const setClubs = (data: Club[]) => localStorage.setItem(CLUBS_KEY, JSON.stringify(data));

export const getRegistrations = (): Registration[] => {
  initData();
  return JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
};
export const setRegistrations = (data: Registration[]) => {
  localStorage.setItem(REGS_KEY, JSON.stringify(data));
};

export const getHistory = (): HistoryLog[] => {
  initData();
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
};
export const addHistory = (action: string, details: string) => {
  initData();
  const h = getHistory();
  h.unshift({ id: Date.now().toString(), action, details, time: new Date().toLocaleString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
};
