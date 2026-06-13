import { LogOut, Calendar } from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
  onOpenSettings: () => void;
}

export default function Header({ onLogout, onOpenSettings }: HeaderProps) {
  // Current UTC/Local Date formatted beautifully in Space Mono
  const today = new Date();
  const dayStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-theme-border flex justify-between items-center px-4 py-4 sm:px-6 transition-all" style={{ background: "var(--theme-header-bg)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-4 select-none">
        {/* Scaled-down Metallic Barbell Lion Badge */}
        <svg width="110" height="48" viewBox="0 0 220 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <defs>
            <linearGradient id="header-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--logo-metal-start, #e2e8f0)" />
              <stop offset="40%" stopColor="var(--logo-metal-mid, #94a3b8)" />
              <stop offset="70%" stopColor="var(--logo-metal-end, #475569)" />
              <stop offset="100%" stopColor="var(--logo-ring-bg, #1e293b)" />
            </linearGradient>
            <linearGradient id="header-metal-light" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--logo-metal-end, #64748b)" />
              <stop offset="30%" stopColor="var(--logo-metal-start, #cbd5e1)" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="var(--logo-metal-start, #94a3b8)" />
              <stop offset="100%" stopColor="var(--logo-metal-end, #334155)" />
            </linearGradient>
            <linearGradient id="header-white-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--logo-accent, #ffffff)" />
              <stop offset="50%" stopColor="var(--logo-metal-start, #cccccc)" />
              <stop offset="100%" stopColor="var(--logo-metal-end, #666666)" />
            </linearGradient>
          </defs>

          {/* Barbell Shaft */}
          <rect x="25" y="44" width="170" height="8" rx="2" fill="url(#header-metal-light)" stroke="#0f172a" strokeWidth="1" />
          
          {/* Left Plates */}
          <rect x="58" y="38" width="6" height="20" rx="1.2" fill="url(#header-metal)" stroke="#0f172a" strokeWidth="0.8" />
          <rect x="46" y="21" width="10" height="54" rx="2.5" fill="url(#header-metal-light)" stroke="#111827" strokeWidth="1" />
          <rect x="36" y="24" width="8" height="48" rx="2" fill="url(#header-metal-light)" stroke="#111827" strokeWidth="0.95" />
          <rect x="28" y="28" width="6" height="40" rx="1.5" fill="url(#header-metal)" stroke="#111827" strokeWidth="0.8" />

          {/* Right Plates */}
          <rect x="156" y="38" width="6" height="20" rx="1.2" fill="url(#header-metal)" stroke="#0f172a" strokeWidth="0.8" />
          <rect x="164" y="21" width="10" height="54" rx="2.5" fill="url(#header-metal-light)" stroke="#111827" strokeWidth="1" />
          <rect x="176" y="24" width="8" height="48" rx="2" fill="url(#header-metal-light)" stroke="#111827" strokeWidth="0.95" />
          <rect x="186" y="28" width="6" height="40" rx="1.5" fill="url(#header-metal)" stroke="#111827" strokeWidth="0.8" />

          {/* Lion Shield Ring */}
          <circle cx="110" cy="48" r="27.5" fill="url(#header-metal-light)" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="110" cy="48" r="23" fill="var(--logo-ring-bg, #131922)" stroke="var(--logo-accent, #1e293b)" strokeWidth="1.5" />

          {/* Lion Head Drawing */}
          <g transform="translate(93, 29)" stroke="var(--logo-lion-stroke, #ffffff)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 17 0 L 11 3 L 8 10 L 4 6 L 0 13 L 5 18 L 1 24 L 7 28 L 17 38 L 27 28 L 33 24 L 29 18 L 34 13 L 30 6 L 26 10 L 23 3 Z" fill="#111827" strokeWidth="0.8" />
            <path d="M 8 13 L 13 16 L 17 12 L 21 16 L 26 13" />
            <path d="M 8 20 L 12 24 L 17 28 L 22 24 L 26 20" />
            <path d="M 17 12 L 17 24 M 14 20 L 17 22 L 20 20" />
            <polygon points="15,24 17,26 19,24" stroke="url(#header-white-glow)" strokeWidth="1" fill="#ffffff" />
            <path d="M 12 15.5 L 14.5 16.2" stroke="#ffffff" strokeWidth="1.2" />
            <path d="M 22 15.5 L 19.5 16.2" stroke="#ffffff" strokeWidth="1.2" />
          </g>
        </svg>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-sans font-semibold tracking-[0.08em] text-[#f8fafc]">
            REYES TRAINING LOG
          </h1>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-[#8ea2b5]/85 uppercase leading-none mt-0.5">
            POWERLIFTING TRACKER V2026
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex items-center gap-2 text-xs font-mono tracking-wider text-[#8ea2b5]/75">
          <Calendar size={13} className="text-white/85" />
          <span>{dayStr}</span>
        </div>

        <button
          onClick={onOpenSettings}
          id="btn-settings"
          className="flex items-center gap-2 px-4 py-1.5 border border-white/20 hover:border-white/80 text-[10px] font-mono font-bold tracking-widest text-[#cbd5e1] hover:text-white hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer rounded-lg uppercase"
        >
          <span className="text-white text-[11px]">⚙</span>
          <span>SETTINGS</span>
        </button>

        <button
          onClick={onLogout}
          id="btn-logout"
          className="flex items-center gap-2 px-4 py-1.5 border border-white/20 hover:border-white/80 text-[10px] font-mono font-bold tracking-widest text-[#cbd5e1] hover:text-white hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer rounded-lg uppercase"
        >
          <LogOut size={12} className="text-white" />
          <span>LOGOUT</span>
        </button>
      </div>
    </header>
  );
}
