import { describe, it, expect, beforeEach } from 'vitest';
import {
  getRecords,
  saveRecords,
  addRecord,
  deleteRecord,
  getCategories,
  saveCategories,
  getBudget,
  saveBudget,
  genId,
  getCurrentMonth,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from '../utils/storage';
import type { Record, Category, Budget } from '../utils/storage';

// 每个测试前清空 localStorage，保证互相独立
beforeEach(() => {
  localStorage.clear();
});

// ========== 记录测试 ==========

describe('记账记录 (Records)', () => {
  const sampleRecord: Record = {
    id: 'test1',
    amount: 100,
    type: 'expense',
    categoryId: 'e1',
    date: '2026-07-17',
    note: '午餐',
  };

  it('初始时应该返回空数组', () => {
    expect(getRecords()).toEqual([]);
  });

  it('添加一条记录后，列表中应该有这条记录', () => {
    const records = addRecord(sampleRecord);
    expect(records).toHaveLength(1);
    expect(records[0].amount).toBe(100);
    expect(records[0].note).toBe('午餐');
  });

  it('删除记录后，列表应该变空', () => {
    addRecord(sampleRecord);
    const records = deleteRecord('test1');
    expect(records).toHaveLength(0);
  });

  it('saveRecords 可以一次性保存多条记录', () => {
    const records: Record[] = [
      { ...sampleRecord, id: 'r1' },
      { ...sampleRecord, id: 'r2', amount: 200 },
    ];
    saveRecords(records);
    expect(getRecords()).toHaveLength(2);
  });
});

// ========== 分类测试 ==========

describe('收支分类 (Categories)', () => {
  it('首次调用应该返回预设的默认分类', () => {
    const categories = getCategories();
    // 先删除 localStorage 中的缓存，让函数走默认逻辑
    localStorage.removeItem('jzb_categories');
    const fresh = getCategories();
    expect(fresh.length).toBe(
      DEFAULT_EXPENSE_CATEGORIES.length + DEFAULT_INCOME_CATEGORIES.length
    );
  });

  it('可以保存自定义分类', () => {
    const custom: Category[] = [
      { id: 'c1', name: '咖啡', type: 'expense', icon: '☕' },
    ];
    saveCategories(custom);
    expect(getCategories()).toEqual(custom);
  });
});

// ========== 预算测试 ==========

describe('预算 (Budget)', () => {
  it('初始时返回默认空预算', () => {
    const budget = getBudget();
    expect(budget.month).toBe('');
    expect(budget.amount).toBe(0);
  });

  it('可以设置和读取预算', () => {
    const budget: Budget = { month: '2026-07', amount: 5000 };
    saveBudget(budget);
    expect(getBudget()).toEqual(budget);
  });
});

// ========== 工具函数测试 ==========

describe('工具函数', () => {
  it('genId 生成的是字符串，长度大于 0', () => {
    const id = genId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('genId 连续两次调用应该生成不同的 ID', () => {
    const id1 = genId();
    const id2 = genId();
    expect(id1).not.toBe(id2);
  });

  it('getCurrentMonth 返回 YYYY-MM 格式', () => {
    const month = getCurrentMonth();
    // 格式：2026-07 这样的
    expect(month).toMatch(/^\d{4}-\d{2}$/);
  });
});
