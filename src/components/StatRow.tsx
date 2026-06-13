interface StatItem {
  label: string;
  value: string | number;
  subtext?: string;
  hasWarning?: boolean;
}

interface StatRowProps {
  items: StatItem[];
}

export default function StatRow({ items }: StatRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 flex flex-col justify-between min-h-[105px] transition-all duration-300 hover:border-white/20 hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)] rounded-xl select-none"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] text-[#aaaaaa] uppercase">
            {item.label}
          </div>
          <div className="flex flex-col mt-2">
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
              {item.value}
            </div>
            {item.subtext && (
              <div className="text-[10px] font-mono tracking-wider mt-1 text-[#666666] uppercase">
                {item.subtext}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
