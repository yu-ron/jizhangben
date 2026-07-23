import { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import AddRecordModal from '../components/AddRecordModal';
import MonthPicker from '../components/MonthPicker';

/**
 * 账单列表页——按月份筛选、按日期分组展示（含每日小计）、支持删除记录
 */
export default function Records() {
  const { records, categories, currentMonth, setCurrentMonth, deleteRecord } = useApp();
  const [showModal, setShowModal] = useState(false);

  // 按当前月份筛选
  const filteredRecords = useMemo(() => {
    return [...records]
      .filter(r => r.date.startsWith(currentMonth))
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }, [records, currentMonth]);

  // 按日期分组
  const groupedRecords = useMemo(() => {
    const groups: Record<string, typeof filteredRecords> = {};
    filteredRecords.forEach(r => {
      if (!groups[r.date]) groups[r.date] = [];
      groups[r.date].push(r);
    });
    return Object.entries(groups);
  }, [filteredRecords]);

  // 当月统计
  const monthStats = useMemo(() => {
    const income = filteredRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const expense = filteredRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    return { income, expense, count: filteredRecords.length };
  }, [filteredRecords]);

  const getCatById = (id: string) => categories.find(c => c.id === id);

  /** 将日期字符串转为中文星期几 */
  const weekDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
  };

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">账单</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm"
        >
          ✏️ 记一笔
        </button>
      </div>

      {/* 月份选择器 */}
      <MonthPicker value={currentMonth} onChange={setCurrentMonth} />

      {/* 当月汇总 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-around">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">支出</div>
          <div className="text-lg font-bold text-red-500">¥{monthStats.expense.toFixed(2)}</div>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">收入</div>
          <div className="text-lg font-bold text-green-500">¥{monthStats.income.toFixed(2)}</div>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">笔数</div>
          <div className="text-lg font-bold text-gray-700">{monthStats.count}</div>
        </div>
      </div>

      {/* 账单列表 */}
      {groupedRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">📭</div>
          <div className="text-gray-400">当月还没有记录</div>
        </div>
      ) : (
        <div className="space-y-3">
          {groupedRecords.map(([date, items]) => {
            const dayIncome = items.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
            const dayExpense = items.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);

            return (
              <div key={date} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {/* 日期头 */}
                <div className="px-4 py-2.5 bg-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">{date}</span>
                    <span className="text-xs text-gray-400 ml-2">{weekDay(date)}</span>
                  </div>
                  <div className="flex gap-3 text-xs">
                    {dayExpense > 0 && <span className="text-red-500">支 ¥{dayExpense.toFixed(2)}</span>}
                    {dayIncome > 0 && <span className="text-green-500">收 ¥{dayIncome.toFixed(2)}</span>}
                  </div>
                </div>
                {/* 当日记账 */}
                {items.map(r => {
                  const cat = getCatById(r.categoryId);
                  return (
                    <div key={r.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat?.icon || '❓'}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-700">{cat?.name || '未知'}</div>
                          {r.note && <div className="text-xs text-gray-400">{r.note}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${r.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          {r.type === 'income' ? '+' : '-'}¥{r.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => deleteRecord(r.id)}
                          className="text-gray-300 hover:text-red-400 text-sm"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <AddRecordModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
