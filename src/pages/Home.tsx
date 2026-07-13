import { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import AddRecordModal from '../components/AddRecordModal';
import BudgetBar from '../components/BudgetBar';

export default function Home() {
  const { currentMonth, getMonthIncome, getMonthExpense, budget, records } = useApp();
  const [showModal, setShowModal] = useState(false);

  const income = useMemo(() => getMonthIncome(currentMonth), [getMonthIncome, currentMonth]);
  const expense = useMemo(() => getMonthExpense(currentMonth), [getMonthExpense, currentMonth]);
  const balance = income - expense;

  // 本月记录数
  const monthRecords = useMemo(
    () => records.filter(r => r.date.startsWith(currentMonth)).length,
    [records, currentMonth]
  );

  // 当前月份显示
  const monthDisplay = (() => {
    const [y, m] = currentMonth.split('-');
    return `${y}年${parseInt(m)}月`;
  })();

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">📒 记账本</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
          {monthDisplay}
        </span>
      </div>

      {/* 月度概览卡片 */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-5 text-white shadow-lg shadow-primary-200">
        <div className="text-primary-100 text-sm mb-1">本月结余</div>
        <div className="text-3xl font-bold mb-4">
          {balance >= 0 ? '+' : ''}{balance.toFixed(2)}
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <div className="text-primary-200">收入</div>
            <div className="font-semibold text-lg">¥{income.toFixed(2)}</div>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <div className="text-primary-200">支出</div>
            <div className="font-semibold text-lg">¥{expense.toFixed(2)}</div>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <div className="text-primary-200">笔数</div>
            <div className="font-semibold text-lg">{monthRecords}</div>
          </div>
        </div>
      </div>

      {/* 预算进度 */}
      <BudgetBar />

      {/* 快捷操作 */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <span>✏️</span> 记一笔
      </button>

      {/* 最近记录 */}
      <RecentRecords />

      {/* 记一笔弹窗 */}
      <AddRecordModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

function RecentRecords() {
  const { records, categories, deleteRecord } = useApp();

  const recent = [...records]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <div className="text-4xl mb-2">📝</div>
        <div className="text-gray-400 text-sm">还没有记账记录</div>
        <div className="text-gray-300 text-xs mt-1">点击上方按钮开始记账吧</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-600">最近记录</span>
      </div>
      {recent.map(r => {
        const cat = categories.find(c => c.id === r.categoryId);
        return (
          <div key={r.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat?.icon || '❓'}</span>
              <div>
                <div className="text-sm font-medium text-gray-700">{cat?.name || '未知'}</div>
                <div className="text-xs text-gray-400">{r.date}{r.note ? ` · ${r.note}` : ''}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm ${r.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {r.type === 'income' ? '+' : '-'}¥{r.amount.toFixed(2)}
              </span>
              <button
                onClick={() => deleteRecord(r.id)}
                className="text-gray-300 hover:text-red-400 text-sm transition-colors"
                title="删除"
              >
                🗑
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
