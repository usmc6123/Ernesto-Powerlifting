import { Trash2, TrendingUp, Target } from "lucide-react";
import { Goal } from "../types";

interface GoalBarProps {
  goals: Goal[];
  currentWeights: { [liftName: string]: number }; // e.g. { "Bench Press": 185 }
  onDeleteGoal?: (id: string) => void;
  onAddGoal?: () => void;
}

export default function GoalBar({ goals, currentWeights, onDeleteGoal, onAddGoal }: GoalBarProps) {
  const getLiftCurrentWeight = (liftName: string) => {
    // case-insensitive matching
    const l = liftName.toLowerCase();
    for (const [k, v] of Object.entries(currentWeights)) {
      const keys = k.toLowerCase();
      if (keys === l || keys.includes(l) || l.includes(keys)) {
        return v;
      }
    }
    return 0;
  };

  return (
    <div className="border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 w-full rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-white/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4 select-none">
        <div className="flex items-center gap-2">
          <Target size={15} className="text-white animate-pulse" />
          <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-[#f8fafc]">
            GOAL TRACKING PROGRESS
          </h3>
        </div>
        {onAddGoal && (
          <button
            onClick={onAddGoal}
            className="text-[10px] font-mono tracking-widest px-3 py-1 border border-white/20 hover:border-white text-white hover:bg-white/5 transition-all cursor-pointer rounded-md uppercase"
          >
            + ADD GOAL
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-6 text-xs font-mono text-[#666666] uppercase">
          NO ACTIVE TRAINING GOALS LOGGED
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((g) => {
            const current = getLiftCurrentWeight(g.lift);
            const baseline = g.baselineWeight;
            const target = g.targetWeight;

            // Compute progress percentage
            const range = target - baseline;
            let percent = 0;
            if (range > 0) {
              const currentOffset = current - baseline;
              percent = Math.min(100, Math.max(0, (currentOffset / range) * 100));
            } else if (current >= target) {
              percent = 100;
            }

            const formattedPercent = Math.round(percent);

            return (
              <div key={g.id} className="group relative">
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#f8fafc] uppercase font-sans">
                      {g.lift}
                    </span>
                    <span className="text-[10px] font-mono text-[#aaaaaa] ml-2">
                      (Target: {target} LB by {g.targetDate})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-white">
                      {formattedPercent}%
                    </span>
                    {onDeleteGoal && (
                      <button
                        onClick={() => onDeleteGoal(g.id)}
                        className="text-[#666666] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
                        title="Delete Goal"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Outer Progress bar */}
                <div className="h-5 bg-[#141414] border border-white/10 relative overflow-hidden rounded-md">
                  <div
                    className="h-full bg-gradient-to-r from-white/70 to-white/95 shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-1000 ease-out"
                    style={{ width: `${formattedPercent}%` }}
                  ></div>
                  
                  {/* Subtle info label overlay */}
                  <div className="absolute inset-0 flex justify-between items-center px-2.5 text-[9px] font-mono font-bold text-[#f8fafc] mix-blend-difference">
                    <span>Baseline: {baseline} LB</span>
                    <span className="flex items-center gap-1">
                      Current: {current} LB <TrendingUp size={10} />
                    </span>
                    <span>Target: {target} LB</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
