import React, { useState } from "react";
import { KeyRound, ShieldAlert } from "lucide-react";
import { api } from "../lib/api";

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage("PASSWORD IS REQUIRED");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await api.login(password);
      localStorage.setItem("reyes_jwt_token", data.token);
      onLoginSuccess(data.token);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message?.toUpperCase() || "AUTHENTICATION FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent flex items-center justify-center p-4 overflow-hidden font-sans select-none">
      
      {/* 1. Hexagon Pattern & Network Nodes Background Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: "var(--theme-hex-opacity, 0.03)" }} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-grid" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(0.85)">
              <path d="M28 0 L56 16.16 L56 48.5 L28 64.66 L0 48.5 L0 16.16 Z M28 97 L56 113.16 L56 145.5 L28 161.66 L0 145.5 L0 113.16 Z" fill="none" stroke="var(--theme-hex-stroke, #ffffff)" strokeWidth="1" />
            </pattern>
          </defs>
          
          {/* Spanned Hex grid */}
          <rect width="100%" height="100%" fill="url(#hex-grid)" />
          
          {/* Top-Right Networking Web & Glowing Dots */}
          <g stroke="#333333" strokeWidth="1" opacity="0.65">
            <line x1="75%" y1="12%" x2="85%" y2="6%" />
            <line x1="85%" y1="6%" x2="92%" y2="18%" />
            <line x1="92%" y1="18%" x2="82%" y2="24%" />
            <line x1="82%" y1="24%" x2="75%" y2="12%" />
            <line x1="82%" y1="24%" x2="85%" y2="6%" />
            <line x1="75%" y1="12%" x2="92%" y2="18%" />
            
            <circle cx="75%" cy="12%" r="2.5" fill="#ffffff" className="animate-pulse" />
            <circle cx="85%" cy="6%" r="1.5" fill="#ffffff" />
            <circle cx="92%" cy="18%" r="3.5" fill="#ffffff" />
            <circle cx="82%" cy="24%" r="2" fill="#ffffff" />
          </g>

          {/* Bottom-Left Networking Web & Glowing Dots */}
          <g stroke="#333333" strokeWidth="1" opacity="0.65">
            <line x1="12%" y1="78%" x2="22%" y2="86%" />
            <line x1="22%" y1="86%" x2="16%" y2="94%" />
            <line x1="16%" y1="94%" x2="6%" y2="86%" />
            <line x1="6%" y1="86%" x2="12%" y2="78%" />
            <line x1="12%" y1="78%" x2="16%" y2="94%" />
            <line x1="6%" y1="86%" x2="22%" y2="86%" />

            <circle cx="12%" cy="78%" r="1.5" fill="#ffffff" />
            <circle cx="22%" cy="86%" r="3" fill="#ffffff" className="animate-pulse" />
            <circle cx="16%" cy="94%" r="1.5" fill="#ffffff" />
            <circle cx="6%" cy="86%" r="2.5" fill="#ffffff" />
          </g>
        </svg>

        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[550px] rounded-full bg-white/[0.01] blur-[130px] mix-blend-color-dodge"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.01] blur-[120px] -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/[0.01] blur-[150px] translate-y-1/3 -translate-x-1/3"></div>

        {/* Dynamic Sparkle star in lower right */}
        <svg className="absolute bottom-16 right-16 md:bottom-28 md:right-36 w-8 h-8 text-neutral-800/50 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12 11.25 11.25 12 0 12C11.25 12 12 12.75 12 24C12 12.75 12.75 12 24 12C12.75 12 12 11.25 12 0Z" fill="currentColor" />
        </svg>
      </div>

      {/* 2. Main Glassmorphic Container Card */}
      <div className="glass-card relative w-full max-w-[530px] p-8 sm:p-12 pt-20 pb-10 rounded-[32px] flex flex-col space-y-7 z-10">
        
        {/* Absolute Floating Barbell Lion Badge */}
        <svg width="220" height="96" viewBox="0 0 220 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-[48px] left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] select-none pointer-events-none">
          <defs>
            <linearGradient id="metal-accent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="40%" stopColor="#9ca3af" />
              <stop offset="70%" stopColor="#4b5563" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
            <linearGradient id="metal-light" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#70828e" />
              <stop offset="30%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="blue-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#cccccc" />
              <stop offset="85%" stopColor="#888888" />
              <stop offset="100%" stopColor="#555555" />
            </linearGradient>
            <radialGradient id="ring-depth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          {/* Solid Barbell Shaft */}
          <rect x="25" y="44" width="170" height="8" rx="2" fill="url(#metal-light)" stroke="#131922" strokeWidth="1" />
          
          {/* Symmetrical Left Collar & Barbell Plates */}
          <rect x="58" y="38" width="6" height="20" rx="1.2" fill="url(#metal-accent)" stroke="#131922" strokeWidth="0.8" />
          <rect x="46" y="21" width="10" height="54" rx="2.5" fill="url(#metal-light)" stroke="#111827" strokeWidth="1" />
          <line x1="51" y1="22" x2="51" y2="74" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1" />
          <rect x="36" y="24" width="8" height="48" rx="2" fill="url(#metal-light)" stroke="#111827" strokeWidth="0.95" />
          <rect x="28" y="28" width="6" height="40" rx="1.5" fill="url(#metal-accent)" stroke="#111827" strokeWidth="0.8" />

          {/* Symmetrical Right Collar & Barbell Plates */}
          <rect x="156" y="38" width="6" height="20" rx="1.2" fill="url(#metal-accent)" stroke="#131922" strokeWidth="0.8" />
          <rect x="164" y="21" width="10" height="54" rx="2.5" fill="url(#metal-light)" stroke="#111827" strokeWidth="1" />
          <line x1="169" y1="22" x2="169" y2="74" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1" />
          <rect x="176" y="24" width="8" height="48" rx="2" fill="url(#metal-light)" stroke="#111827" strokeWidth="0.95" />
          <rect x="186" y="28" width="6" height="40" rx="1.5" fill="url(#metal-accent)" stroke="#111827" strokeWidth="0.8" />

          {/* Bolt Ends */}
          <polygon points="26,41 28,41 28,55 26,55" fill="#334155" />
          <polygon points="194,41 192,41 192,55 194,55" fill="#334155" />

          {/* Central Circular Lion Shield Ring */}
          <circle cx="110" cy="48" r="29" fill="#222222" opacity="0.3" />
          <circle cx="110" cy="48" r="27.5" fill="url(#metal-light)" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="110" cy="48" r="23" fill="#0d0d0d" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
          <circle cx="110" cy="48" r="23" fill="url(#ring-depth)" />

          {/* Precision Lion Face Vector Artwork */}
          <g transform="translate(93, 29)" stroke="url(#metal-light)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Outline Mane points */}
            <path d="M 17 0 L 11 3 L 8 10 L 4 6 L 0 13 L 5 18 L 1 24 L 7 28 L 17 38 L 27 28 L 33 24 L 29 18 L 34 13 L 30 6 L 26 10 L 23 3 Z" fill="#151e29" strokeWidth="1" />
            {/* Crown and brows */}
            <path d="M 8 13 L 13 16 L 17 12 L 21 16 L 26 13" />
            {/* Muzzle frame */}
            <path d="M 8 20 L 12 24 L 17 28 L 22 24 L 26 20" />
            <path d="M 17 12 L 17 24 M 14 20 L 17 22 L 20 20" />
            {/* Nose and Glowing Eyes */}
            <polygon points="15,24 17,26 19,24" stroke="url(#blue-glow)" strokeWidth="1" fill="#ffffff" />
            <path d="M 12 15.5 L 14.5 16.2" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 22 15.5 L 19.5 16.2" stroke="#ffffff" strokeWidth="1.5" />
            {/* Beard / jaws */}
            <path d="M 14 26 L 17 29 L 20 26" />
            <path d="M 17 29 L 17 33" stroke="url(#blue-glow)" strokeWidth="1" />
          </g>
        </svg>

        {/* 3. Text Header Section */}
        <div className="text-center space-y-1.5 select-none pt-2">
          <h1 className="text-2xl sm:text-3xl font-sans font-semibold tracking-[0.08em] text-[#f8fafc] text-center pt-2">
            REYES TRAINING LOG
          </h1>
          <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#aaaaaa] uppercase">
            POWERLIFTING TRACKER V2026
          </p>
        </div>

        {/* 4. Glassmorphic Error Banner */}
        {errorMessage && (
          <div className="bg-red-950/45 border border-red-500/30 text-red-100 p-3.5 text-xs font-mono tracking-widest flex items-center gap-2 rounded-xl backdrop-blur-sm shadow-md animate-shake">
            <ShieldAlert size={14} className="shrink-0 text-red-400" />
            <span className="uppercase">{errorMessage}</span>
          </div>
        )}

        {/* 5. Custom Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3.5">
            <label className="text-[11px] font-sans font-semibold tracking-[0.16em] text-[#aaaaaa] block uppercase pl-1">
              REYES PASSKEY CODE
            </label>
            <div className="relative">
              
              {/* Metallic Silver Key SVG Emblem inside Input bar */}
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[22px] h-[22px] opacity-92 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.55)] select-none pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="silver-metal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="42%" stopColor="#cbd5e1" />
                    <stop offset="85%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>
                <circle cx="7.5" cy="12" r="3.8" stroke="url(#silver-metal)" strokeWidth="2.2" fill="none" />
                <circle cx="7.5" cy="12" r="1.3" fill="#0d0d0d" />
                <rect x="11.2" y="11" width="8.5" height="2" rx="0.4" fill="url(#silver-metal)" />
                <rect x="15.5" y="12.2" width="1.8" height="3" rx="0.3" fill="url(#silver-metal)" />
                <rect x="18" y="12.2" width="1.8" height="3" rx="0.3" fill="url(#silver-metal)" stroke="#ffffff" strokeWidth="0.25" />
              </svg>

              <input
                type="password"
                placeholder="ENTER SECURE PASSCODE"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                id="login-password-field"
                className="w-full bg-[#141414] border border-white/10 focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] pl-14 pr-8 py-3.5 text-xs font-mono tracking-[0.25em] text-center text-white outline-none rounded-[15px] placeholder-[#555555] transition-all duration-300"
              />
            </div>
          </div>

          {/* Premium Glowing Custom Verification Button */}
          <button
            type="submit"
            disabled={isLoading}
            id="btn-login"
            className="relative w-full overflow-hidden h-[53px] bg-white hover:bg-[#eaeaea] border border-white text-black font-sans text-xs font-bold tracking-[0.22em] rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 cursor-pointer uppercase flex items-center justify-center"
          >
            {/* Top and Bottom neon light laser bars */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-85 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
            
            <span className="relative z-10">
              {isLoading ? "AUTHENTICATING..." : "VERIFY SECURITY KEY"}
            </span>
          </button>
        </form>

        {/* 6. Centered Footnote tagline */}
        <div className="text-center pt-2">
          <span className="text-[10px] font-mono text-[#666666] tracking-wider uppercase select-none">
            FALLBACK LOCAL ACCESS CODE: <strong className="text-white font-mono">password123</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
