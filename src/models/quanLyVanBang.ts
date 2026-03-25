import { useLocalStorage } from '@/utils/useLocalStorage';

export interface DiplomaBook {
  id: string;
  year: number;
  currentNumber: number; // Tu dong tang, reset ve 1 khi mo so moi
}

export interface GraduationDecision {
  id: string;
  decisionNumber: string;
  date: string; // Dinh dang ISO string
  summary: string;
  diplomaBookId: string;
}

export interface FormConfig {
  id: string;
  name: string;
  dataType: 'String' | 'Number' | 'Date';
}

export interface Diploma {
  id: string;
  bookNumber: number; // Số vào sổ
  diplomaNumber: string; // Số hiệu văn bằng
  studentId: string;
  fullName: string;
  dateOfBirth: string; // Dinh dang ISO string
  decisionId: string;
  customFields: Record<string, any>; // Cac truong cau hinh them
}

export default function useQuanLyVanBangModel() {
  const [diplomaBooks, setDiplomaBooks] = useLocalStorage<DiplomaBook[]>('qlvb_diplomaBooks', []);
  const [decisions, setDecisions] = useLocalStorage<GraduationDecision[]>('qlvb_decisions', []);
  const [formConfigs, setFormConfigs] = useLocalStorage<FormConfig[]>('qlvb_formConfigs', []);
  const [diplomas, setDiplomas] = useLocalStorage<Diploma[]>('qlvb_diplomas', []);
  const [searchStats, setSearchStats] = useLocalStorage<Record<string, number>>('qlvb_searchStats', {}); // Luu tru tong so luot tra cuu theo quyet dinh

  // Quan ly so van bang
  const addDiplomaBook = (book: Omit<DiplomaBook, 'id' | 'currentNumber'>) => {
    const newBook = { ...book, id: Date.now().toString(), currentNumber: 1 };
    setDiplomaBooks([...diplomaBooks, newBook]);
  };
  const updateDiplomaBook = (id: string, data: Partial<Omit<DiplomaBook, 'id' | 'currentNumber'>>) => {
    setDiplomaBooks(diplomaBooks.map(b => b.id === id ? { ...b, ...data } : b));
  };
  const deleteDiplomaBook = (id: string) => {
    setDiplomaBooks(diplomaBooks.filter(b => b.id !== id));
  };

  // Quyet dinh tot nghiep
  const addDecision = (decision: Omit<GraduationDecision, 'id'>) => {
    setDecisions([...decisions, { ...decision, id: Date.now().toString() }]);
  };
  const updateDecision = (id: string, data: Partial<Omit<GraduationDecision, 'id'>>) => {
    setDecisions(decisions.map(d => d.id === id ? { ...d, ...data } : d));
  };
  const deleteDecision = (id: string) => {
    setDecisions(decisions.filter(d => d.id !== id));
  };

  // Cau hinh bieu mau
  const addFormConfig = (config: Omit<FormConfig, 'id'>) => {
    setFormConfigs([...formConfigs, { ...config, id: Date.now().toString() }]);
  };
  const updateFormConfig = (id: string, data: Partial<Omit<FormConfig, 'id'>>) => {
    setFormConfigs(formConfigs.map(c => c.id === id ? { ...c, ...data } : c));
  };
  const deleteFormConfig = (id: string) => {
    setFormConfigs(formConfigs.filter(c => c.id !== id));
  };

  // Thong tin van bang
  const addDiploma = (diploma: Omit<Diploma, 'id' | 'bookNumber'>) => {
    const decision = decisions.find(d => d.id === diploma.decisionId);
    if (!decision) throw new Error('Decision not found');
    const bookIndex = diplomaBooks.findIndex(b => b.id === decision.diplomaBookId);
    if (bookIndex === -1) throw new Error('Diploma Book not found');

    const book = diplomaBooks[bookIndex];
    const newDiploma = {
      ...diploma,
      id: Date.now().toString(),
      bookNumber: book.currentNumber,
    };

    // Tu dong tang so vao so
    const updatedBooks = [...diplomaBooks];
    updatedBooks[bookIndex] = { ...book, currentNumber: book.currentNumber + 1 };
    
    setDiplomaBooks(updatedBooks);
    setDiplomas([...diplomas, newDiploma]);
  };
  
  const updateDiploma = (id: string, data: Partial<Omit<Diploma, 'id' | 'bookNumber'>>) => {
    setDiplomas(diplomas.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const deleteDiploma = (id: string) => {
    setDiplomas(diplomas.filter(d => d.id !== id));
  };

  const incrementSearchStat = (decisionId: string) => {
    setSearchStats({
      ...searchStats,
      [decisionId]: (searchStats[decisionId] || 0) + 1
    });
  };

  return {
    diplomaBooks, addDiplomaBook, updateDiplomaBook, deleteDiplomaBook,
    decisions, addDecision, updateDecision, deleteDecision,
    formConfigs, addFormConfig, updateFormConfig, deleteFormConfig,
    diplomas, addDiploma, updateDiploma, deleteDiploma,
    searchStats, incrementSearchStat
  };
}
