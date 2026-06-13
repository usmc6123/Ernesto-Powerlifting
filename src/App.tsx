import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("reyes_theme") || "monochrome";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("reyes_theme", theme);
  }, [theme]);

  useEffect(() => {
    // Check if token already exists in localStorage on mount
    const savedToken = localStorage.getItem("reyes_jwt_token");
    if (savedToken) {
      setToken(savedToken);
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("reyes_jwt_token");
    setToken(null);
  };

  if (isInitializing) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a] text-[#f1f5f9] flex items-center justify-center p-4 font-sans overflow-hidden">
        {/* Hexagon Pattern Background Decorative Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-[0.03]">
          <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex-grid-init" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(0.85)">
                <path d="M28 0 L56 16.16 L56 48.5 L28 64.66 L0 48.5 L0 16.16 Z M28 97 L56 113.16 L56 145.5 L28 161.66 L0 145.5 L0 113.16 Z" fill="none" stroke="#ffffff" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex-grid-init)" />
          </svg>
        </div>
        <div className="relative z-10 space-y-3 text-center select-none">
          <div className="h-4 w-4 bg-[#ffffff] mx-auto animate-spin shadow-[0_0_12px_rgba(255,255,255,0.4)]"></div>
          <span className="text-xs font-mono text-[#aaaaaa]/80 tracking-widest uppercase">
            ESTABLISHING SECURE TRAINING SESSION...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-[#f1f5f9] font-sans overflow-x-hidden">
      {"/* Absolute Hexagon Background and Neon Glows */"}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: "var(--theme-hex-opacity, 0.03)" }} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-grid-app" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(0.85)">
              <path d="M28 0 L56 16.16 L56 48.5 L28 64.66 L0 48.5 L0 16.16 Z M28 97 L56 113.16 L56 145.5 L28 161.66 L0 145.5 L0 113.16 Z" fill="none" stroke="var(--theme-hex-stroke, #ffffff)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-grid-app)" />
          
          {/* Top-Right Networking Web & Glowing Dots */}
          <g stroke="#333333" strokeWidth="1" opacity="0.3">
            <line x1="85%" y1="12%" x2="92%" y2="6%" />
            <line x1="92%" y1="6%" x2="96%" y2="18%" />
            <line x1="96%" y1="18%" x2="88%" y2="24%" />
            <line x1="88%" y1="24%" x2="85%" y2="12%" />
            <circle cx="85%" cy="12%" r="2" fill="#ffffff" className="animate-pulse" />
            <circle cx="96%" cy="18%" r="2.5" fill="#ffffff" />
          </g>
        </svg>

        {/* Ambient deep base glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-white/[0.02] blur-[130px] -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-10 left-10 w-[700px] h-[600px] rounded-full bg-white/[0.02] blur-[150px] -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="relative z-10 w-full">
        {token ? (
          <Dashboard onLogout={handleLogout} theme={theme} setTheme={setTheme} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}
