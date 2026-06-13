interface MonthBarProps {
  selectedMonth: string; // "2026-MM"
  onChangeMonth: (month: string) => void;
  monthlyStats?: { [key: string]: { hitRate: number } };
}

export default function MonthBar({ selectedMonth, onChangeMonth, monthlyStats }: MonthBarProps) {
  const months = [
    { label: "JAN", key: "2026-01" },
    { label: "FEB", key: "2026-02" },
    { label: "MAR", key: "2026-03" },
    { label: "APR", key: "2026-04" },
    { label: "MAY", key: "2026-05" },
    { label: "JUN", key: "2026-06" },
    { label: "JUL", key: "2026-07" },
    { label: "AUG", key: "2026-08" },
    { label: "SEP", key: "2026-09" },
    { label: "OCT", key: "2026-10" },
    { label: "NOV", key: "2026-11" },
    { label: "DEC", key: "2026-12" },
  ];

  return (
    <div className="w-full border-b border-theme-border bg-theme-card/90 overflow-x-auto scrollbar-thin select-none">
      <div className="flex min-w-max md:grid md:grid-cols-12 divide-x divide-theme-border">
        {months.map((m) => {
          const isSelected = selectedMonth === m.key;
          const hitRate = monthlyStats?.[m.key]?.hitRate != null ? monthlyStats[m.key].hitRate : null;

          return (
            <button
              key={m.key}
              onClick={() => onChangeMonth(m.key)}
              id={`month-tab-${m.key}`}
              className={`flex-1 min-w-[78px] py-4 px-2 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                isSelected
                  ? "bg-white/[0.04] text-white font-bold"
                  : "bg-transparent text-[#666666] hover:text-[#ffffff] hover:bg-white/[0.02]"
              }`}
            >
              <span className={`text-[11px] font-mono tracking-widest ${isSelected ? "text-white" : "text-[#aaaaaa]"}`}>
                {m.label}
              </span>
              
              {/* Bottom glowing light bar for selected tab */}
              {isSelected && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[3px] z-10"
                  style={{
                    backgroundColor: "var(--theme-month-active-bar, #ffffff)",
                    boxShadow: "0 0 12px var(--theme-month-active-bar, rgba(255,255,255,0.85))"
                  }}
                ></div>
              )}

              {hitRate !== null && (
                <span className="absolute top-1 right-1 text-[8px] font-mono text-white bg-black/90 border border-white/20 px-1 py-0.2 rounded-sm select-none pointer-events-none scale-90">
                  {hitRate}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
