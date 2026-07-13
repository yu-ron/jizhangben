interface Props {
  value: string;   // YYYY-MM
  onChange: (month: string) => void;
}

export default function MonthPicker({ value, onChange }: Props) {
  const [year, month] = value.split('-').map(Number);

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const nextMonth = () => {
    const d = new Date(year, month, 1);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

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
