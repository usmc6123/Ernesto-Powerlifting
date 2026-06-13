export function parseSetsInput(input: string, workingWeight: number | null): [number, number][] {
  if (!input || typeof input !== "string") return [];
  const parts = input.split(/,\s*/);
  const setsList: [number, number][] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Match weights like "135x8" or "135×8"
    const crossMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*[x×X]\s*(\d+)$/);
    if (crossMatch) {
      const weight = parseFloat(crossMatch[1]);
      const reps = parseInt(crossMatch[2], 10);
      setsList.push([weight, reps]);
    } else {
      // Reps only format (e.g. "8") - uses working weight
      const repsOnly = parseInt(trimmed, 10);
      if (!isNaN(repsOnly)) {
        const weight = workingWeight !== null ? Number(workingWeight) : 0;
        setsList.push([weight, repsOnly]);
      }
    }
  }
  return setsList;
}

export function formatSetsOutput(sets: [number, number][]): string {
  if (!sets || !Array.isArray(sets)) return "";
  return sets.map(([weight, reps]) => `${weight}×${reps}`).join(", ");
}

export function calculateLiftVolume(sets: [number, number][]): number {
  if (!sets || !Array.isArray(sets)) return 0;
  return sets.reduce((sum, [weight, reps]) => sum + (Number(weight) || 0) * (Number(reps) || 0), 0);
}

export function calculateEstimated1RM(sets: [number, number][]): number {
  if (!sets || !Array.isArray(sets) || sets.length === 0) return 0;
  let max1RM = 0;
  sets.forEach(([weight, reps]) => {
    const w = Number(weight) || 0;
    const r = Number(reps) || 0;
    if (r > 0) {
      const est = w * (1 + r / 30);
      if (est > max1RM) max1RM = est;
    }
  });
  return Math.round(max1RM);
}

export function formatDateString(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr.toUpperCase();
  
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (monthIdx >= 0 && monthIdx < 12) {
    return `${months[monthIdx]} ${day}, ${year}`;
  }
  return dateStr.toUpperCase();
}

/**
 * Custom function to build class names (Vite boilerplate compatibility)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
