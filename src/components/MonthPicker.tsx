interface Props {
  value: string;   // YYYY-MM
  onChange: (month: string) => void;
}

/**
 * 月份选择器——左右箭头切换月份，不能超过当前月份
 * @param value - 当前选中的月份，格式 YYYY-MM
 * @param onChange - 月份变化时的回调
 */
export default function MonthPicker({ value, onChange }: Props) {
  const [year, month] = value.split('-').map(Number);

  /** 切换到上一个月：利用 Date 构造函数自动处理跨年（1 月 → 上一年 12 月） */
  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);  // month 是 1-based，减 2 得到上个月
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  /** 切换到下一个月（不能超过当前月份） */
  const nextMonth = () => {
    const d = new Date(year, month, 1);  // 下个月的第一天
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  /** 判断当前显示的月份是否就是本月（用于禁用"下个月"按钮） */
  const isCurrentMonth = () => {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
  };

  return (
    <div className="flex items-center justify-center gap-4 bg-white rounded-2xl py-3 px-4 shadow-sm">
      <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 text-lg px-2">
        ◀
      </button>
      <span className="text-base font-semibold text-gray-700 min-w-[100px] text-center">
        {year}年{month}月
      </span>
      <button
        onClick={nextMonth}
        className={`text-lg px-2 ${isCurrentMonth() ? 'text-gray-300 cursor-default' : 'text-gray-400 hover:text-gray-600'}`}
        disabled={isCurrentMonth()}
      >
        ▶
      </button>
    </div>
  );
}
