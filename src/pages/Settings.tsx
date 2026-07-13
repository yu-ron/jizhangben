import { useState } from 'react';
import { useApp } from '../store/AppContext';
import type { Category } from '../utils/storage';

const ICON_OPTIONS = ['🍜', '🚗', '🛒', '🎮', '🏠', '📱', '💊', '📚', '🧴', '💸', '💰', '🧧', '📈', '💼', '📥', '🎁', '✈️', '🐱', '☕', '🏥'];

export default function Settings() {
  const { categories, addCategory, deleteCategory, budget, setBudget } = useApp();

  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'expense' | 'income'>('expense');
  const [newCatIcon, setNewCatIcon] = useState('🍜');

  const [budgetInput, setBudgetInput] = useState(budget.amount > 0 ? String(budget.amount) : '');
  const [budgetSaved, setBudgetSaved] = useState(false);

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addCategory({ name: newCatName.trim(), type: newCatType, icon: newCatIcon });
    setNewCatName('');
    setNewCatIcon('🍜');
    setShowAddCat(false);
  };

  const handleSaveBudget = () => {
    const amount = parseFloat(budgetInput);
    if (amount > 0) {
      setBudget(amount);
      setBudgetSaved(true);
      setTimeout(() => setBudgetSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">设置</h1>

      {/* ===== 预算设置 ===== */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">💵 月度预算</h2>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="100"
            value={budgetInput}
            onChange={e => setBudgetInput(e.target.value)}
            placeholder="设置月度预算金额"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-gray-700"
          />
          <button
            onClick={handleSaveBudget}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              budgetSaved
                ? 'bg-green-500 text-white'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {budgetSaved ? '✓ 已保存' : '保存'}
          </button>
        </div>
        {budget.amount > 0 && (
          <div className="mt-2 text-xs text-gray-400">
            当前预算：¥{budget.amount.toFixed(0)}/月
          </div>
        )}
      </div>

      {/* ===== 支出分类 ===== */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600">💸 支出分类</h2>
          <button
            onClick={() => { setShowAddCat(true); setNewCatType('expense'); }}
            className="text-primary-500 text-sm font-medium hover:text-primary-600"
          >
            + 添加
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {expenseCategories.map(cat => (
            <CategoryRow key={cat.id} category={cat} onDelete={deleteCategory} />
          ))}
        </div>
      </div>

      {/* ===== 收入分类 ===== */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600">💰 收入分类</h2>
          <button
            onClick={() => { setShowAddCat(true); setNewCatType('income'); }}
            className="text-primary-500 text-sm font-medium hover:text-primary-600"
          >
            + 添加
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {incomeCategories.map(cat => (
            <CategoryRow key={cat.id} category={cat} onDelete={deleteCategory} />
          ))}
        </div>
      </div>

      {/* ===== 添加分类弹窗 ===== */}
      {showAddCat && (
        <div className="fixed inset-0 z-50 flex items-end justify-center max-w-[480px] mx-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddCat(false)} />
          <div className="relative w-full bg-white rounded-t-2xl p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              添加{newCatType === 'expense' ? '支出' : '收入'}分类
            </h3>

            {/* 选择图标 */}
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">图标</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewCatIcon(icon)}
                    className={`w-10 h-10 text-xl flex items-center justify-center rounded-lg transition-colors ${
                      newCatIcon === icon ? 'bg-primary-100 ring-2 ring-primary-400' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* 名称 */}
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1.5">分类名称</label>
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="如：外卖、房租"
                maxLength={10}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-gray-700"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddCat(false)}
                className="flex-1 py-2.5 rounded-lg text-gray-500 bg-gray-100 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCatName.trim()}
                className="flex-1 py-2.5 rounded-lg text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部留白 */}
      <div className="h-4" />
    </div>
  );
}

function CategoryRow({ category, onDelete }: { category: Category; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="text-xl">{category.icon}</span>
        <span className="text-sm text-gray-700">{category.name}</span>
      </div>
      <button
        onClick={() => onDelete(category.id)}
        className="text-gray-300 hover:text-red-400 text-sm transition-colors"
      >
        🗑
      </button>
    </div>
  );
}
