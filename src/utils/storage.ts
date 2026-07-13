// ========== 类型定义 ==========

export interface Record {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date: string;       // YYYY-MM-DD
  note: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
}

export interface Budget {
  month: string;      // YYYY-MM
  amount: number;
}

// ========== 预设分类 ==========

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'e1', name: '餐饮', type: 'expense', icon: '🍜' },
  { id: 'e2', name: '交通', type: 'expense', icon: '🚗' },
  { id: 'e3', name: '购物', type: 'expense', icon: '🛒' },
  { id: 'e4', name: '娱乐', type: 'expense', icon: '🎮' },
  { id: 'e5', name: '住房', type: 'expense', icon: '🏠' },
  { id: 'e6', name: '通讯', type: 'expense', icon: '📱' },
  { id: 'e7', name: '医疗', type: 'expense', icon: '💊' },
  { id: 'e8', name: '教育', type: 'expense', icon: '📚' },
  { id: 'e9', name: '日用', type: 'expense', icon: '🧴' },
  { id: 'e10', name: '其他', type: 'expense', icon: '💸' },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'i1', name: '工资', type: 'income', icon: '💰' },
  { id: 'i2', name: '奖金', type: 'income', icon: '🧧' },
  { id: 'i3', name: '投资', type: 'income', icon: '📈' },
  { id: 'i4', name: '兼职', type: 'income', icon: '💼' },
  { id: 'i5', name: '其他', type: 'income', icon: '📥' },
];

// ========== localStorage 读写工具 ==========

const STORAGE_KEYS = {
  records: 'jzb_records',
  categories: 'jzb_categories',
  budget: 'jzb_budget',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ========== 记录 CRUD ==========

export function getRecords(): Record[] {
  return read<Record[]>(STORAGE_KEYS.records, []);
}

export function saveRecords(records: Record[]): void {
  write(STORAGE_KEYS.records, records);
}

export function addRecord(record: Record): Record[] {
  const records = getRecords();
  records.push(record);
  saveRecords(records);
  return records;
}

export function deleteRecord(id: string): Record[] {
  const records = getRecords().filter(r => r.id !== id);
  saveRecords(records);
  return records;
}

// ========== 分类 CRUD ==========

export function getCategories(): Category[] {
  const saved = read<Category[]>(STORAGE_KEYS.categories, []);
  if (saved.length === 0) {
    // 首次使用，写入默认分类
    const defaults = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
    write(STORAGE_KEYS.categories, defaults);
    return defaults;
  }
  return saved;
}

export function saveCategories(categories: Category[]): void {
  write(STORAGE_KEYS.categories, categories);
}

// ========== 预算 ==========

export function getBudget(): Budget {
  return read<Budget>(STORAGE_KEYS.budget, { month: '', amount: 0 });
}

export function saveBudget(budget: Budget): void {
  write(STORAGE_KEYS.budget, budget);
}

// ========== 工具函数 ==========

/** 生成唯一 ID */
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** 获取当前月份字符串 YYYY-MM */
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
