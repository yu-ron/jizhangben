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

/** localStorage 键名常量，统一前缀 jzb_ 避免与其他网站数据冲突 */
const STORAGE_KEYS = {
  records: 'jzb_records',
  categories: 'jzb_categories',
  budget: 'jzb_budget',
};

/** 从 localStorage 读取并解析 JSON 数据，读取失败或不存在时返回 fallback */
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** 将数据序列化为 JSON 并写入 localStorage */
function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ========== 记录 CRUD ==========

/** 获取所有记账记录，若无数据返回空数组 */
export function getRecords(): Record[] {
  return read<Record[]>(STORAGE_KEYS.records, []);
}

/** 替换所有记账记录（整体覆盖写入） */
export function saveRecords(records: Record[]): void {
  write(STORAGE_KEYS.records, records);
}

/** 添加一条记账记录，返回更新后的全部记录列表 */
export function addRecord(record: Record): Record[] {
  const records = getRecords();
  records.push(record);
  saveRecords(records);
  return records;
}

/** 根据 ID 删除一条记账记录，返回删除后的全部记录列表 */
export function deleteRecord(id: string): Record[] {
  const records = getRecords().filter(r => r.id !== id);
  saveRecords(records);
  return records;
}

// ========== 分类 CRUD ==========

/** 获取所有收支分类；首次使用时自动写入预设的 15 个默认分类 */
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

/** 替换所有分类（整体覆盖写入） */
export function saveCategories(categories: Category[]): void {
  write(STORAGE_KEYS.categories, categories);
}

// ========== 预算 ==========

/** 获取当前预算设置，无数据时返回空预算（month 为空，amount 为 0） */
export function getBudget(): Budget {
  return read<Budget>(STORAGE_KEYS.budget, { month: '', amount: 0 });
}

/** 保存预算设置（按月覆盖） */
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
