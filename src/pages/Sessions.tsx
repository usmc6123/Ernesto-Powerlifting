import React from "react";
import { Plus, Dumbbell } from "lucide-react";
import { Session } from "../types";
import SessionCard from "../components/SessionCard";

interface SessionsProps {
  sessions: Session[];
  onAddSession: () => void;
  onEditSession: (session: Session) => void;
  onDeleteSession: (id: string) => void;
  selectedMonthLabel?: string;
}

export default function Sessions({
  sessions,
  onAddSession,
  onEditSession,
  onDeleteSession,
  selectedMonthLabel,
}: SessionsProps) {
  return (
    <div className="space-y-5">
      {/* Sessions View Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] select-none">
        <div>
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
            TRAINING LOG DIRECTORY {selectedMonthLabel && `— ${selectedMonthLabel}`}
          </h2>
          <p className="text-[10px] font-sans text-[#aaaaaa] mt-1">
            Displaying {sessions.length} logged training sessions in reverse chronological order.
          </p>
        </div>

        <button
          onClick={onAddSession}
          id="btn-add-session"
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-[#eaeaea] text-black text-xs font-mono font-black tracking-widest rounded-lg shadow-[0_0_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_18px_rgba(255,255,255,0.3)] transition-all ease-out duration-300 active:scale-95 cursor-pointer uppercase"
        >
          <Plus size={13} strokeWidth={3} />
          + LOG WORKOUT
        </button>
      </div>

      {/* Directory listing */}
      {sessions.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="h-2 w-2 bg-white animate-ping"></div>
          <span className="text-xs font-mono text-[#aaaaaa] tracking-widest uppercase">
            NO SESSIONS LOGGED FOR THIS MONTH DEFINITION
          </span>
          <button
            onClick={onAddSession}
            className="text-[10px] font-mono tracking-widest px-4 py-2 border border-white/20 hover:border-white text-white rounded-lg transition-all cursor-pointer bg-white/5 hover:bg-white/10 uppercase font-bold"
          >
            CREATE FIRST LOG
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onEdit={onEditSession}
              onDelete={onDeleteSession}
            />
          ))}
        </div>
      )}
    </div>
  );
}
