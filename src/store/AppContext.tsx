import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Record, Category, Budget } from '../utils/storage';
import * as storage from '../utils/storage';

interface AppState {
  records: Record[];
  categories: Category[];
  budget: Budget;
  currentMonth: string;
  // 操作
  addRecord: (record: Omit<Record, 'id'>) => void;
  deleteRecord: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  setBudget: (amount: number) => void;
  setCurrentMonth: (month: string) => void;
  // 计算
  getMonthIncome: (month: string) => number;
  getMonthExpense: (month: string) => number;
  getCategoryExpenseData: (month: string) => { name: string; icon: string; value: number; color: string }[];
  getMonthTrend: (months: string[]) => { month: string; income: number; expense: number }[];
}

const CATEGORY_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#06b6d4',
];

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Record[]>(storage.getRecords);
  const [categories, setCategories] = useState<Category[]>(storage.getCategories);
  const [budget, setBudgetState] = useState<Budget>(storage.getBudget);
  const [currentMonth, setCurrentMonth] = useState<string>(storage.getCurrentMonth);

  // ===== 记录操作 =====
  const addRecord = useCallback((data: Omit<Record, 'id'>) => {
    const newRecord: Record = { ...data, id: storage.genId() };
    const updated = storage.addRecord(newRecord);
    setRecords(updated);
  }, []);

  const deleteRecord = useCallback((id: string) => {
    const updated = storage.deleteRecord(id);
    setRecords(updated);
  }, []);

  // ===== 分类操作 =====
  const addCategory = useCallback((data: Omit<Category, 'id'>) => {
    const newCat: Category = { ...data, id: storage.genId() };
    const updated = [...categories, newCat];
    storage.saveCategories(updated);
    setCategories(updated);
  }, [categories]);

  const deleteCategory = useCallback((id: string) => {
    const updated = categories.filter(c => c.id !== id);
    storage.saveCategories(updated);
    setCategories(updated);
  }, [categories]);

  // ===== 预算操作 =====
  const setBudget = useCallback((amount: number) => {
    const month = storage.getCurrentMonth();
    const newBudget: Budget = { month, amount };
    storage.saveBudget(newBudget);
    setBudgetState(newBudget);
  }, []);

  // ===== 计算 =====
  const getMonthIncome = useCallback((month: string) => {
    return records
      .filter(r => r.date.startsWith(month) && r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [records]);

  const getMonthExpense = useCallback((month: string) => {
    return records
      .filter(r => r.date.startsWith(month) && r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [records]);

  const getCategoryExpenseData = useCallback((month: string) => {
    const expenseRecords = records.filter(r => r.date.startsWith(month) && r.type === 'expense');
    const grouped: { [key: string]: number } = {};
    expenseRecords.forEach(r => {
      grouped[r.categoryId] = (grouped[r.categoryId] || 0) + r.amount;
    });
    return Object.entries(grouped)
      .map(([catId, value]) => {
        const cat = categories.find(c => c.id === catId);
        return { name: cat?.name || '未知', icon: cat?.icon || '❓', value: value as number };
      })
      .sort((a, b) => (b.value as number) - (a.value as number))
      .map((item, i) => ({ ...item, value: item.value as number, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));
  }, [records, categories]);

  const getMonthTrend = useCallback((months: string[]) => {
    return months.map(month => ({
      month: month.slice(5),  // MM
      income: records.filter(r => r.date.startsWith(month) && r.type === 'income').reduce((s, r) => s + r.amount, 0),
      expense: records.filter(r => r.date.startsWith(month) && r.type === 'expense').reduce((s, r) => s + r.amount, 0),
    }));
  }, [records]);

  return (
    <AppContext.Provider value={{
      records, categories, budget, currentMonth,
      addRecord, deleteRecord, addCategory, deleteCategory, setBudget, setCurrentMonth,
      getMonthIncome, getMonthExpense, getCategoryExpenseData, getMonthTrend,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
