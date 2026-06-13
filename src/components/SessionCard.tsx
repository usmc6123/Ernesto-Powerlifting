import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Edit2, Scale, Dumbbell } from "lucide-react";
import { Session } from "../types";
import { formatDateString, calculateLiftVolume } from "../lib/utils";

interface SessionCardProps {
  key?: string | number;
  session: Session;
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
}

export default function SessionCard({ session, onEdit, onDelete }: SessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to determine if lift tag gets highlighted styling
  const isHighlightedLift = (name: string) => {
    const l = name.toLowerCase();
    return l.includes("bench") || l.includes("squat");
  };

  const hasLifts = session.lifts && session.lifts.length > 0;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`ARE YOU SURE YOU WANT TO DELETE THIS SESSION ON ${formatDateString(session.date)}?`)) {
      onDelete(session.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(session);
  };

  // Color mappings for session types
  const typeDisplay = {
    trained: { text: "TRAINED", class: "text-white bg-white/10 border-white/20" },
    skipped: { text: "SKIPPED", class: "text-[#888888] bg-white/5 border-white/10" },
    rest: { text: "REST DAY", class: "text-[#aaaaaa] bg-white/5 border-white/10" },
    home: { text: "HOME WORKOUT", class: "text-white bg-white/10 border-white/20" },
  };

  const currentType = typeDisplay[session.type] || { text: session.type.toUpperCase(), class: "text-[#888888]" };

  return (
    <div
      onClick={() => hasLifts && setIsExpanded(!isExpanded)}
      className={`glass-card transition-all duration-300 relative rounded-xl overflow-hidden ${
        hasLifts ? "cursor-pointer" : ""
      }`}
    >
      {/* Header card view */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-mono font-bold tracking-widest text-[#f8fafc]">
              {formatDateString(session.date)}
            </span>
            <span className={`text-[9px] font-mono font-bold border px-1.5 py-0.5 tracking-wider rounded-md ${currentType.class}`}>
              {currentType.text}
            </span>
            {session.bodyWeight && (
              <span className="text-[10px] font-mono text-[#aaaaaa] flex items-center gap-1 bg-white/10 border border-white/10 px-1.5 py-0.5 rounded-md">
                <Scale size={11} className="text-white" />
                {session.bodyWeight} LBS
              </span>
            )}
          </div>

          {session.note && (
            <p className="text-xs text-[#cbd5e1] italic font-sans mt-1 line-clamp-2 pl-2 border-l-2 border-white/20">
              &ldquo;{session.note}&rdquo;
            </p>
          )}

          {/* Lift tags */}
          {hasLifts && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {session.lifts.map((lift, i) => {
                const highlight = isHighlightedLift(lift.name);
                return (
                  <span
                    key={i}
                    className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 border rounded-md ${
                      highlight
                        ? "bg-white/10 border-white/40 text-white font-bold shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                        : "bg-black/40 border-white/5 text-[#aaaaaa]"
                    }`}
                  >
                    {lift.name.toUpperCase()}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Action button triggers */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end border-t border-white/10 sm:border-t-0 pt-2 sm:pt-0">
          <button
            onClick={handleEditClick}
            className="p-1 px-3 border border-white/10 hover:border-white text-[#cbd5e1] hover:text-white bg-white/[0.02] hover:bg-white/5 rounded-lg transition-all cursor-pointer text-[10px] font-mono flex items-center gap-1.5"
            title="Edit Session"
          >
            <Edit2 size={11} className="text-white/70 animate-pulse" />
            <span>EDIT</span>
          </button>
          
          <button
            onClick={handleDeleteClick}
            className="p-1 px-3 border border-red-500/25 hover:border-red-500/80 text-[#cbd5e1] hover:text-red-400 bg-[#1f1618]/30 hover:bg-red-500/5 rounded-lg transition-all cursor-pointer text-[10px] font-mono flex items-center gap-1.5"
            title="Delete Session"
          >
            <Trash2 size={11} className="text-red-400/80" />
            <span>DELETE</span>
          </button>

          {hasLifts && (
            <div className="text-[#666666] hover:text-white pl-2">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Sets Details view */}
      {isExpanded && hasLifts && (
        <div className="border-t border-white/10 bg-[#0d0d0d]/95 p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {session.lifts.map((lift, i) => {
              const totalVolume = calculateLiftVolume(lift.weightedSets);
              const isHighlight = isHighlightedLift(lift.name);

              return (
                <div
                  key={i}
                  className={`p-3.5 border rounded-lg transition-all ${
                    isHighlight 
                      ? "border-white/20 bg-white/[0.04]" 
                      : "border-white/5 bg-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2.5 border-b border-white/10 pb-1.5">
                    <span className="text-xs font-bold tracking-widest text-[#f8fafc] uppercase flex items-center gap-1.5">
                      <Dumbbell size={12} className="text-white" />
                      {lift.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#aaaaaa]">
                      VOLUME: <strong className="text-white font-semibold">{totalVolume} LB</strong>
                    </span>
                  </div>

                  {lift.workingWeight && (
                    <div className="text-[10px] font-mono text-[#aaaaaa] mb-2 bg-black/60 px-2 py-1 rounded inline-block">
                      WORKING WT: <span className="text-white font-bold">{lift.workingWeight} LB</span>
                    </div>
                  )}

                  {/* Sets pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {lift.weightedSets.map(([weight, reps], sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono tracking-wider bg-black/90 border border-white/10 px-2 py-1 text-[#cbd5e1] rounded"
                      >
                        SET {sIdx + 1}: <strong className="text-white font-bold">{weight}×{reps}</strong>
                      </span>
                    ))}
                  </div>

                  {lift.notes && (
                    <div className="text-[10px] font-sans text-[#aaaaaa] mt-2.5 border-l-2 border-white/10 pl-2 py-0.5">
                      {lift.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
