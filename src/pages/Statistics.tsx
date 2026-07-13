import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../store/AppContext';
import MonthPicker from '../components/MonthPicker';

export default function Statistics() {
  const { currentMonth, setCurrentMonth, getCategoryExpenseData, getMonthTrend, getMonthIncome, getMonthExpense } = useApp();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const pieData = useMemo(() => getCategoryExpenseData(currentMonth), [getCategoryExpenseData, currentMonth]);
  const income = useMemo(() => getMonthIncome(currentMonth), [getMonthIncome, currentMonth]);
  const expense = useMemo(() => getMonthExpense(currentMonth), [getMonthExpense, currentMonth]);

  // 最近6个月趋势
  const trendMonths = useMemo(() => {
    const months: string[] = [];
    const [y, m] = currentMonth.split('-').map(Number);
    for (let i = 5; i >= 0; i--) {
      const d = new Date(y, m - 1 - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return months;
  }, [currentMonth]);

  const trendData = useMemo(() => getMonthTrend(trendMonths), [getMonthTrend, trendMonths]);

  const totalExpense = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">统计</h1>

      <MonthPicker value={currentMonth} onChange={setCurrentMonth} />

      {/* 当月汇总 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-around">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">总支出</div>
          <div className="text-xl font-bold text-red-500">¥{expense.toFixed(2)}</div>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">总收入</div>
          <div className="text-xl font-bold text-green-500">¥{income.toFixed(2)}</div>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">结余</div>
          <div className={`text-xl font-bold ${income - expense >= 0 ? 'text-gray-700' : 'text-red-500'}`}>
            ¥{(income - expense).toFixed(2)}
          </div>
        </div>
      </div>

      {/* 图表类型切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => setChartType('pie')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            chartType === 'pie' ? 'bg-primary-500 text-white' : 'bg-white text-gray-500'
          }`}
        >
          🍩 分类支出
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            chartType === 'bar' ? 'bg-primary-500 text-white' : 'bg-white text-gray-500'
          }`}
        >
          📊 月度趋势
        </button>
      </div>

      {/* 饼图 - 分类支出 */}
      {chartType === 'pie' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">支出分类分布</h2>
          {pieData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              当月无支出数据
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `¥${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* 图例 */}
              <div className="flex flex-wrap gap-2 mt-2">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600">{item.icon} {item.name}</span>
                    <span className="text-gray-400">
                      {totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 柱状图 - 月度趋势 */}
      {chartType === 'bar' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">近6月收支趋势</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" name="收入" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="支出" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
