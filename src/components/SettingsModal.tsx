import { X } from "lucide-react";

interface SettingsModalProps {
  theme: "midnight" | "monochrome";
  onThemeChange: (theme: "midnight" | "monochrome") => void;
  onClose: () => void;
}

export default function SettingsModal({ theme, onThemeChange, onClose }: SettingsModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#0d0d0d] border border-white/10 text-[#f1f5f9] flex flex-col rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.85)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Settings Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10 select-none">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-white flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
            ⚙ SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#aaaaaa] hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono tracking-widest text-[#aaaaaa] uppercase">
              APPEARANCE
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Midnight Theme Card */}
              <button
                onClick={() => onThemeChange("midnight")}
                className={`flex flex-col text-left p-4 rounded-xl border bg-black/40 cursor-pointer transition-all duration-300 hover:bg-black/60 group ${
                  theme === "midnight"
                    ? "border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono font-bold text-white tracking-wider group-hover:text-cyan-400 transition-colors">
                    MIDNIGHT
                  </span>
                  <div className={`h-2.5 w-2.5 rounded-full border ${theme === "midnight" ? "bg-cyan-400 border-cyan-400" : "border-white/30"}`}></div>
                </div>

                {/* Swatch Preview */}
                <div className="w-full h-16 bg-[#070d11] rounded-lg border border-[#202e3a]/80 p-2 flex flex-col justify-between overflow-hidden">
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded-[3px] bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.5)]"></div>
                    <div className="h-3 w-8 rounded-[3.5px] bg-[#121921]/90 border border-cyan-400/20"></div>
                  </div>
                  <div className="h-3.5 w-full bg-[#121921]/80 rounded border border-[#202e3a]/50 flex items-center px-1">
                    <div className="h-1 w-8 bg-cyan-400/40 rounded-full"></div>
                  </div>
                </div>
              </button>

              {/* Monochrome Theme Card */}
              <button
                onClick={() => onThemeChange("monochrome")}
                className={`flex flex-col text-left p-4 rounded-xl border bg-black/40 cursor-pointer transition-all duration-300 hover:bg-black/60 group ${
                  theme === "monochrome"
                    ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono font-bold text-white tracking-wider group-hover:text-neutral-100 transition-colors">
                    MONOCHROME
                  </span>
                  <div className={`h-2.5 w-2.5 rounded-full border ${theme === "monochrome" ? "bg-white border-white" : "border-white/30"}`}></div>
                </div>

                {/* Swatch Preview */}
                <div className="w-full h-16 bg-[#0a0a0a] rounded-lg border border-white/5 p-2 flex flex-col justify-between overflow-hidden">
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded-[3px] bg-white"></div>
                    <div className="h-3 w-8 rounded-[3.5px] bg-white/5 border border-white/10"></div>
                  </div>
                  <div className="h-3.5 w-full bg-white/5 rounded border border-white/5 flex items-center px-1">
                    <div className="h-1 w-8 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-white/10 flex justify-end gap-3 select-none">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-black font-sans text-xs font-bold tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer rounded-lg uppercase"
          >
            GO BACK TO APP
          </button>
        </div>
      </div>
    </div>
  );
}
