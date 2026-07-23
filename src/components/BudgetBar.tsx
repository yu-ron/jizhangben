import { useMemo } from 'react';
import { useApp } from '../store/AppContext';

/**
 * 预算进度条——展示当月支出占预算的百分比
 * 颜色根据使用比例动态变化：≤50% 蓝色、50%-80% 黄色、>80% 红色（超支预警）
 */
export default function BudgetBar() {
  const { budget, getMonthExpense, currentMonth } = useApp();

  const expense = useMemo(() => getMonthExpense(currentMonth), [getMonthExpense, currentMonth]);
  // 只有当前月份的预算才有效，历史月份显示 0
  const budgetAmount = budget.month === currentMonth ? budget.amount : 0;

  // 计算使用百分比，expense 超过 budget 时最多显示 100%
  const percent = budgetAmount > 0 ? Math.min((expense / budgetAmount) * 100, 100) : 0;
  const remaining = budgetAmount - expense;

  if (budgetAmount === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">📊 本月预算</span>
          <span className="text-xs text-gray-400">未设置</span>
        </div>
        <div className="text-xs text-gray-400">去「设置」页面设置月度预算</div>
      </div>
    );
  }

  // 动态颜色：超 80% 红色（超支预警）、50%-80% 黄色（注意）、<50% 蓝色（正常）
  const barColor = percent > 80 ? 'bg-red-500' : percent > 50 ? 'bg-yellow-500' : 'bg-primary-500';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">📊 本月预算</span>
        <span className={`text-xs font-medium ${remaining < 0 ? 'text-red-500' : 'text-gray-400'}`}>
          剩余 ¥{remaining.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 w-10 text-right">{Math.round(percent)}%</span>
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-gray-400">
        <span>已花 ¥{expense.toFixed(2)}</span>
        <span>预算 ¥{budgetAmount.toFixed(0)}</span>
      </div>
    </div>
  );
}
