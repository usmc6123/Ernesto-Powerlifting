import { Session } from "../types";

interface CalendarGridProps {
  selectedMonth: string; // "2026-MM"
  sessions: Session[];
}

export default function CalendarGrid({ selectedMonth, sessions }: CalendarGridProps) {
  // Parse month
  const parts = selectedMonth.split("-");
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1; // 0-11

  // Days in month
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  // Start day of week (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = new Date(year, monthIdx, 1).getDay();

  // Create mapping of sessions by date
  const sessionByDate: { [date: string]: Session } = {};
  sessions.forEach((s) => {
    sessionByDate[s.date] = s;
  });

  // Today's date is 2026-06-13, let's check relative to today
  const todayStr = "2026-06-13";

  // Days headers
  const dayHeaders = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Populate calendar grid cells
  const cells: any[] = [];

  // Empty padding for start of month
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push({ isEmpty: true });
  }

  // Active days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${formattedDay}`;
    const session = sessionByDate[dateStr];
    const isFuture = dateStr > todayStr;

    cells.push({
      isEmpty: false,
      day,
      dateStr,
      session,
      isFuture,
    });
  }

  // Get style class based on session and future state
  const getCellStyles = (cell: any) => {
    if (cell.isEmpty) return "bg-transparent border border-transparent";

    const { session, isFuture } = cell;

    if (isFuture) {
      // Future dates are very faded
      return "bg-[#111111] border border-white/5 text-[#555555] rounded-md";
    }

    if (!session) {
      // Past day with no logged session is counted as skipped / unlogged
      return "bg-[#2a2a2a] border border-transparent text-[#666666] hover:border-white/10 rounded-md";
    }

    switch (session.type) {
      case "trained":
        return "bg-white text-black font-bold border border-white shadow-[0_0_12px_rgba(255,255,255,0.4)] hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] rounded-md cursor-pointer";
      case "home":
        return "bg-[#cccccc] border border-white text-black font-bold shadow-[0_0_8px_rgba(255,255,255,0.2)] rounded-md cursor-pointer";
      case "rest":
        return "bg-[#1a1a1a]/80 border border-white/10 text-[#aaaaaa] hover:text-white rounded-md cursor-pointer";
      case "skipped":
        return "bg-[#2a2a2a] border border-white/10 text-white/50 hover:border-white/20 rounded-md cursor-pointer";
      default:
        return "bg-[#111111] text-[#cbd5e1] border border-white/10 rounded-md";
    }
  };

  return (
    <div className="border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 w-full rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] select-none">
      <div className="text-[10px] font-mono tracking-[0.2em] text-[#aaaaaa] mb-4 uppercase select-none flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping"></span>
        CONSISTENCY CALENDAR GRID — {selectedMonth}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Headers */}
        {dayHeaders.map((h) => (
          <div
            key={h}
            className="text-center font-mono text-[9px] font-bold text-[#666666] tracking-widest pb-1.5"
          >
            {h}
          </div>
        ))}

        {/* Days cells */}
        {cells.map((cell, idx) => (
          <div
            key={idx}
            className={`aspect-square flex flex-col justify-between items-center p-1 sm:p-2 font-mono text-xs font-semibold transition-all duration-300 relative ${getCellStyles(
              cell
            )}`}
          >
            {!cell.isEmpty && (
              <>
                <span className="self-start text-[10px]">{cell.day}</span>
                
                {/* Micro indicators inside cell */}
                {cell.session?.lifts?.length > 0 && cell.session.type !== "trained" && (
                  <span className="h-1 w-1 bg-current rounded-full mb-0.5" />
                )}
                {cell.session?.type === "trained" && (
                  <span className="h-1 w-1 bg-[#0a0a0a] rounded-full mb-0.5" />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend below calendar */}
      <div className="mt-5 border-t border-white/10 pt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-white border border-white rounded-sm shadow-[0_0_5px_rgba(255,255,255,0.3)]"></div>
          <span className="text-[9px] font-mono tracking-wider text-[#cbd5e1] uppercase">
            TRAINED (GYM)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[#cccccc] border border-white rounded-sm"></div>
          <span className="text-[9px] font-mono tracking-wider text-[#cbd5e1] uppercase">
            HOME WORKOUT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[#1a1a1a]/80 border border-white/10 rounded-sm"></div>
          <span className="text-[9px] font-mono tracking-wider text-[#cbd5e1] uppercase">
            REST DAY
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[#2a2a2a] border border-white/10 rounded-sm"></div>
          <span className="text-[9px] font-mono tracking-wider text-[#cbd5e1] uppercase">
            SKIPPED LOG
          </span>
        </div>

        <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
          <div className="w-3.5 h-3.5 bg-[#111111] border border-white/5 rounded-sm"></div>
          <span className="text-[9px] font-mono tracking-wider text-[#cbd5e1] uppercase">
            UNLOGGED FUTURE
          </span>
        </div>
      </div>
    </div>
  );
}
