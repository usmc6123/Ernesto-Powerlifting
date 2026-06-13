import { useState, useEffect } from "react";
import { Plus, Trash2, X, Info } from "lucide-react";
import { Session, Lift, SessionType } from "../types";
import { parseSetsInput, formatSetsOutput } from "../lib/utils";

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Omit<Session, "id"> & { id?: string }) => void;
  sessionToEdit?: Session | null;
  existingLiftNames?: string[];
}

interface LiftFormRow {
  name: string;
  workingWeight: string;
  setsText: string;
  notes: string;
}

export default function LogModal({ isOpen, onClose, onSave, sessionToEdit, existingLiftNames = [] }: LogModalProps) {
  const [date, setDate] = useState("");
  const [type, setType] = useState<SessionType>("trained");
  const [bodyWeight, setBodyWeight] = useState("");
  const [note, setNote] = useState("");
  const [lifts, setLifts] = useState<LiftFormRow[]>([]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (sessionToEdit) {
      setDate(sessionToEdit.date);
      setType(sessionToEdit.type);
      setBodyWeight(sessionToEdit.bodyWeight?.toString() || "");
      setNote(sessionToEdit.note || "");
      
      const formLifts = (sessionToEdit.lifts || []).map((l) => ({
        name: l.name,
        workingWeight: l.workingWeight?.toString() || "",
        setsText: formatSetsOutput(l.weightedSets),
        notes: l.notes || "",
      }));
      setLifts(formLifts);
    } else {
      // Default creation state
      const todayStr = new Date().toISOString().split("T")[0];
      setDate(todayStr);
      setType("trained");
      setBodyWeight("");
      setNote("");
      // Add one default lift row for convenience
      setLifts([{ name: "", workingWeight: "", setsText: "", notes: "" }]);
    }
    setValidationError("");
  }, [sessionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddLiftRow = () => {
    setLifts([...lifts, { name: "", workingWeight: "", setsText: "", notes: "" }]);
  };

  const handleRemoveLiftRow = (index: number) => {
    const updated = [...lifts];
    updated.splice(index, 1);
    setLifts(updated);
  };

  const handleLiftChange = (index: number, key: keyof LiftFormRow, value: string) => {
    const updated = [...lifts];
    updated[index][key] = value;
    setLifts(updated);
  };

  const handleSave = () => {
    if (!date) {
      setValidationError("DATE IS REQUIRED");
      return;
    }
    if (!type) {
      setValidationError("SESSION TYPE IS REQUIRED");
      return;
    }

    const compiledLifts: Lift[] = [];

    // Lifts are only valid if type is trained or home
    if (type === "trained" || type === "home") {
      for (let i = 0; i < lifts.length; i++) {
        const row = lifts[i];
        if (!row.name.trim()) {
          setValidationError(`LIFT NAME IS REQUIRED FOR ROW ${i + 1}`);
          return;
        }

        const workingWeightNum = row.workingWeight.trim() ? parseFloat(row.workingWeight) : null;
        if (row.workingWeight.trim() && isNaN(Number(row.workingWeight))) {
          setValidationError(`WORKING WEIGHT MUST BE A NUMERIC VALUE IN ROW ${i + 1}`);
          return;
        }

        const parsedSets = parseSetsInput(row.setsText, workingWeightNum);
        if (row.setsText.trim() && parsedSets.length === 0) {
          setValidationError(`UNABLE TO PARSE SETS FORMAT IN ROW ${i + 1}. USE "135x8, 145x6" OR "8,8,8"`);
          return;
        }

        compiledLifts.push({
          name: row.name.trim(),
          workingWeight: workingWeightNum,
          weightedSets: parsedSets,
          notes: row.notes.trim(),
        });
      }
    }

    const payload: Omit<Session, "id"> & { id?: string } = {
      date,
      type,
      note: note.trim(),
      bodyWeight: bodyWeight.trim() ? parseFloat(bodyWeight) : null,
      lifts: compiledLifts,
    };

    if (sessionToEdit) {
      payload.id = sessionToEdit.id;
    }

    onSave(payload);
  };

  const showLiftRows = type === "trained" || type === "home";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto select-none">
      {/* Autocomplete datalist of distinct lift names */}
      <datalist id="previous-lifts">
        {existingLiftNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 text-[#f1f5f9] flex flex-col max-h-[90vh] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4.5 border-b border-white/10 select-none">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-white flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
            {sessionToEdit ? "EDIT TRAINING LOG" : "LOG NEW SESSION"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#aaaaaa] hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {validationError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 text-xs font-mono tracking-widest text-center uppercase rounded-lg">
              {validationError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-[#aaaaaa] block uppercase">
                Date (YYYY-MM-DD)*
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 focus:border-white px-3 py-2 text-xs font-mono text-white outline-none rounded-lg focus:shadow-[0_0_8px_rgba(255,255,255,0.05)] transition-all"
              />
            </div>

            {/* Session Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-[#aaaaaa] block uppercase">
                Session Type*
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SessionType)}
                className="w-full bg-[#141414] border border-white/10 focus:border-white px-3 py-2 text-xs font-mono text-white outline-none rounded-lg transition-all focus:shadow-[0_0_8px_rgba(255,255,255,0.05)]"
              >
                <option value="trained">TRAINED (GYM)</option>
                <option value="home">HOME WORKOUT</option>
                <option value="skipped">SKIPPED SESSION</option>
                <option value="rest">REST DAY</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Body weight */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-[#aaaaaa] block uppercase">
                Body Weight (lbs, optional)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 182.4"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 focus:border-white px-3 py-2 text-xs font-mono text-white outline-none rounded-lg transition-all"
              />
            </div>

            {/* General notes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-[#aaaaaa] block uppercase">
                Session Note / Mindset
              </label>
              <input
                type="text"
                placeholder="e.g. Feeling strong, sleep was great"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 focus:border-white px-3 py-2 text-xs text-white outline-none rounded-lg transition-all"
              />
            </div>
          </div>

          {/* Dynamic Lifts Module */}
          {showLiftRows && (
            <div className="border-t border-white/10 pt-4 space-y-4">
              <div className="flex justify-between items-center bg-black/40 px-3.5 py-2.5 border border-white/10 rounded-lg">
                <span className="text-[10px] font-mono tracking-widest text-[#cbd5e1] font-bold">
                  LIFT EXERCISES LOGGED
                </span>
                <span className="text-[9px] font-mono text-white font-black bg-white/10 px-2 py-0.5 rounded border border-white/20">
                  {lifts.length} EXERCISES
                </span>
              </div>

              {lifts.length === 0 ? (
                <div className="text-center py-6 bg-transparent border border-dashed border-white/10 text-xs font-mono text-[#666666] rounded-lg">
                  NO EXERCISES LOGGED. CLICK &ldquo;+ ADD LIFT&rdquo; BELOW.
                </div>
              ) : (
                <div className="space-y-4">
                  {lifts.map((row, index) => (
                    <div
                      key={index}
                      className="border border-white/10 bg-white/[0.02] p-4.5 space-y-3 relative group rounded-lg hover:border-white/20 transition-all duration-300"
                    >
                      {/* Delete lift row button */}
                      <button
                        onClick={() => handleRemoveLiftRow(index)}
                        className="absolute top-4 right-4 text-[#666666] hover:text-red-400 cursor-pointer transition-colors"
                        title="Delete Exercise Row"
                      >
                        <Trash2 size={13} fill="none" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 sm:pt-0">
                        {/* Lift Name with autocomplete */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono tracking-wider text-[#aaaaaa] uppercase font-bold">
                            Exercise Name*
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Bench Press"
                            value={row.name}
                            list="previous-lifts"
                            onChange={(e) => handleLiftChange(index, "name", e.target.value)}
                            className="w-full bg-black border border-white/10 focus:border-white px-2.5 py-1.5 text-xs text-white outline-none rounded"
                          />
                        </div>

                        {/* Working Weight */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono tracking-wider text-[#aaaaaa] uppercase font-bold">
                            Working Weight (lbs)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 185"
                            value={row.workingWeight}
                            onChange={(e) => handleLiftChange(index, "workingWeight", e.target.value)}
                            className="w-full bg-black border border-white/10 focus:border-white px-2.5 py-1.5 text-xs font-mono text-white outline-none rounded"
                          />
                        </div>

                        {/* Sets Input */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono tracking-wider text-[#aaaaaa] uppercase font-bold flex items-center gap-1.5">
                            Sets / Reps*
                          </label>
                          <input
                            type="text"
                            placeholder="135×8, 145×6 or 8,8,8"
                            value={row.setsText}
                            onChange={(e) => handleLiftChange(index, "setsText", e.target.value)}
                            className="w-full bg-black border border-white/10 focus:border-white px-2.5 py-1.5 text-xs font-mono text-white outline-none rounded"
                          />
                        </div>
                      </div>

                      {/* Notes per lift */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono tracking-wider text-[#aaaaaa] uppercase font-bold">
                          Exercise Notes / Performance details
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. RPE 9, 2 min rests"
                          value={row.notes}
                          onChange={(e) => handleLiftChange(index, "notes", e.target.value)}
                          className="w-full bg-black border border-white/10 focus:border-white px-2.5 py-1.5 text-xs text-white outline-none rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add lift trigger button */}
              <button
                onClick={handleAddLiftRow}
                className="w-full border border-white/10 border-dashed hover:border-white p-2.5 text-[10px] font-mono tracking-widest flex items-center justify-center gap-1.5 text-[#cbd5e1] hover:text-white transition-all cursor-pointer rounded-lg bg-white/5 hover:bg-white/10"
              >
                <Plus size={12} />
                + ADD EXERCISE LIFT
              </button>

              <div className="bg-[#141414] border border-white/10 p-3.5 flex items-start gap-3 text-[10px] font-mono text-[#aaaaaa] leading-relaxed rounded-lg">
                <Info size={14} className="text-white shrink-0 mt-0.5" />
                <div>
                  <strong>HOW TO FORMAT SETS</strong>:<br />
                  1. Explicit load and reps: <strong>135×8, 145×6</strong> (or split using standard x letter <strong>135x8</strong>)<br />
                  2. Reps-only: <strong>8,8,8</strong> (Uses the Working Weight provided above for all subsets).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex border-t border-white/10 divide-x divide-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-center text-xs font-mono tracking-[0.2em] text-[#aaaaaa] hover:text-white hover:bg-white/5 transition-all cursor-pointer uppercase font-bold"
          >
            CANCEL
          </button>
          
          <button
            onClick={handleSave}
            className="flex-1 py-4 text-center text-xs font-mono tracking-[0.2em] text-white hover:bg-white/5 transition-all cursor-pointer font-bold uppercase"
          >
            SAVE SESSION
          </button>
        </div>
      </div>
    </div>
  );
}
