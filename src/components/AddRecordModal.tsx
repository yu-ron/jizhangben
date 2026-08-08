import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { genId } from '../utils/storage';
import type { Record } from '../utils/storage';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * "记一笔"弹窗——弹出式表单，支持选择收入/支出、金额、分类、日期、备注
 * @param open - 是否显示弹窗
 * @param onClose - 关闭弹窗的回调
 */
export default function AddRecordModal({ open, onClose }: Props) {
  const { categories, addRecord, currentMonth } = useApp();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [note, setNote] = useState('');

  const filteredCategories = categories.filter(c => c.type === type);

  /** 提交记账记录：校验必填项（金额 > 0、分类已选、日期已填）后写入，并重置表单 */
  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;    // 金额必须大于 0
    if (!categoryId) return;          // 必须选择分类
    if (!date) return;                // 必须选择日期

    addRecord({
      amount: amt,
      type,
      categoryId,
      date,
      note: note.trim(),
    });

    // 重置表单
    setAmount('');
    setCategoryId('');
    setNote('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 弹窗内容——固定最大宽度，在桌面端居中显示 */}
      <div className="relative w-full max-w-md bg-white rounded-2xl p-5 mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">记一笔</h2>
          <button onClick={onClose} className="text-gray-400 text-xl leading-none">&times;</button>
        </div>

        {/* 收入/支出切换 */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setType('expense'); setCategoryId(''); }}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
              type === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            💸 支出
          </button>
          <button
            onClick={() => { setType('income'); setCategoryId(''); }}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
              type === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            💰 收入
          </button>
        </div>

        {/* 金额 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1.5">金额</label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
            <span className="text-gray-400 mr-1 text-lg">¥</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 outline-none text-lg font-semibold text-gray-800 bg-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* 分类 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1.5">分类</label>
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  categoryId === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 日期 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1.5">日期</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-gray-700"
          />
        </div>

        {/* 备注 */}
        <div className="mb-5">
          <label className="block text-sm text-gray-500 mb-1.5">备注（可选）</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="写点什么..."
            maxLength={50}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-gray-700"
          />
        </div>

        {/* 确认按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0 || !categoryId || !date}
          className="w-full py-3 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          确认记录
        </button>
      </div>
    </div>
  );
}
