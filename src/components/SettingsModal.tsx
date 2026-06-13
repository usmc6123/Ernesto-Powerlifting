import { X, Check } from "lucide-react";

interface SettingsModalProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  onClose: () => void;
}

interface ThemeOption {
  id: string;
  name: string;
  swatchBg: string; // Swatch hex background
  swatchAccent: string; // Swatch hex accent
  swatchCard: string; // Swatch hex card
  glowColor: string; // Card border/shadow preview glow shadow
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "midnight",
    name: "MIDNIGHT",
    swatchBg: "#0d1117",
    swatchAccent: "#06b6d4",
    swatchCard: "#121921",
    glowColor: "rgba(6, 182, 212, 0.4)",
  },
  {
    id: "monochrome",
    name: "MONOCHROME",
    swatchBg: "#0a0a0a",
    swatchAccent: "#ffffff",
    swatchCard: "rgba(255, 255, 255, 0.08)",
    glowColor: "rgba(255, 255, 255, 0.15)",
  },
  {
    id: "blood_iron",
    name: "BLOOD IRON",
    swatchBg: "#0a0000",
    swatchAccent: "#dc2626",
    swatchCard: "rgba(220, 38, 38, 0.15)",
    glowColor: "rgba(220, 38, 38, 0.35)",
  },
  {
    id: "gold_standard",
    name: "GOLD STANDARD",
    swatchBg: "#0a0800",
    swatchAccent: "#f59e0b",
    swatchCard: "rgba(245, 158, 11, 0.15)",
    glowColor: "rgba(245, 158, 11, 0.35)",
  },
  {
    id: "matrix",
    name: "MATRIX",
    swatchBg: "#000a00",
    swatchAccent: "#22c55e",
    swatchCard: "rgba(34, 197, 94, 0.15)",
    glowColor: "rgba(34, 197, 94, 0.35)",
  },
  {
    id: "neon_pump",
    name: "NEON PUMP",
    swatchBg: "#0d000f",
    swatchAccent: "#e879f9",
    swatchCard: "rgba(232, 121, 249, 0.15)",
    glowColor: "rgba(232, 121, 249, 0.4)",
  },
  {
    id: "arctic",
    name: "ARCTIC",
    swatchBg: "#020d1a",
    swatchAccent: "#7dd3fc",
    swatchCard: "rgba(125, 211, 252, 0.15)",
    glowColor: "rgba(125, 211, 252, 0.35)",
  },
  {
    id: "carbon_fire",
    name: "CARBON FIRE",
    swatchBg: "#0a0a0a",
    swatchAccent: "#f97316",
    swatchCard: "rgba(249, 115, 22, 0.15)",
    glowColor: "rgba(249, 115, 22, 0.35)",
  },
  {
    id: "chalk",
    name: "CHALK",
    swatchBg: "#f5f0e8",
    swatchAccent: "#1a1a1a",
    swatchCard: "rgba(0, 0, 0, 0.08)",
    glowColor: "rgba(0, 0, 0, 0.1)",
  },
];

export default function SettingsModal({ theme, onThemeChange, onClose }: SettingsModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-drawer-slide {
          animation: slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div 
        className="w-[380px] max-w-full bg-[#0d0d0d] border-l border-white/10 h-full flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.6)] animate-drawer-slide relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10 select-none">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-white flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-theme-accent rounded-full animate-pulse" />
            ⚙ SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#aaaaaa] hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5"
          >
            <span className="sr-only">Close Settings</span>
            <X size={16} />
          </button>
        </div>

        {/* Content with Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="text-[10px] font-mono tracking-[0.16em] text-[#aaaaaa] font-semibold uppercase">
              APPEARANCE
            </div>
            
            {/* 2-column grid of theme cards */}
            <div className="grid grid-cols-2 gap-3.5">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = theme === opt.id;
                
                // Card border preview glow box-shadow
                const shadowStyle = isSelected
                  ? { boxShadow: `0 0 14px ${opt.glowColor}`, borderColor: opt.swatchAccent }
                  : { borderColor: "rgba(255,255,255,0.08)" };

                return (
                  <button
                    key={opt.id}
                    onClick={() => onThemeChange(opt.id)}
                    style={shadowStyle}
                    className={`flex flex-col text-left p-3.5 rounded-xl border bg-black/40 cursor-pointer relative overflow-hidden transition-all duration-200 transform hover:scale-[1.03] group ${
                      isSelected
                        ? "border-2 z-10"
                        : "hover:border-white/25 hover:bg-neutral-900/40"
                    }`}
                  >
                    {/* Selected Checkmark Badge in Top Right Corner */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-neutral-100 z-20">
                        <Check size={10} className="text-black stroke-[3.5px]" />
                      </div>
                    )}

                    <div className="mb-3.5">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-white block truncate uppercase pr-4">
                        {opt.name}
                      </span>
                    </div>

                    {/* Color Swatch Strip with 3 Colors (Background, Accent, Card) */}
                    <div 
                      style={{ backgroundColor: opt.swatchBg }}
                      className="w-full h-10 rounded-lg border border-white/[0.04] p-1 flex items-end justify-between overflow-hidden relative shadow-inner"
                    >
                      <div className="flex gap-1 absolute top-1.5 left-1.5">
                        {/* Swatch Background circle */}
                        <div 
                          style={{ backgroundColor: opt.swatchBg }} 
                          className="h-2.5 w-2.5 rounded-full border border-white/15"
                          title="Background"
                        />
                        {/* Swatch Accent circle */}
                        <div 
                          style={{ backgroundColor: opt.swatchAccent }} 
                          className="h-2.5 w-2.5 rounded-full border border-white/5"
                          title="Accent"
                        />
                        {/* Swatch Card color representation */}
                        <div 
                          style={{ backgroundColor: opt.swatchCard }} 
                          className="h-2.5 w-2.5 rounded-full border border-white/10"
                          title="Card Color"
                        />
                      </div>
                      
                      {/* Simulates a tiny UI layout card inside the colorSwatch */}
                      <div 
                        style={{ backgroundColor: opt.swatchCard, borderColor: `${opt.swatchAccent}2a` }}
                        className="w-full h-4 rounded border flex items-center px-1 mt-auto"
                      >
                        <div 
                          style={{ backgroundColor: opt.swatchAccent }}
                          className="h-1 w-7 rounded-sm opacity-50"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider & About Section */}
          <div className="pt-6 border-t border-white/10 space-y-4 select-none">
            <div className="text-[10px] font-mono tracking-[0.16em] text-[#aaaaaa] font-semibold uppercase">
              ABOUT
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#888888]">APPLICATION</span>
                <span className="text-white font-bold">REYES ATHLETICS</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#888888]">ENGINE VERSION</span>
                <span className="text-theme-accent font-bold">V2026.1</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#888888]">STATUS</span>
                <span className="text-green-400 font-bold tracking-wider">ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 flex justify-end gap-3 select-none">
          <button
            onClick={onClose}
            className="w-full px-5 py-3 bg-white text-black font-sans text-[11px] font-bold tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer rounded-lg uppercase shadow-lg"
          >
            GO BACK TO APP
          </button>
        </div>
      </div>
    </div>
  );
}
