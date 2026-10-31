import type { Score } from "./ranking";

export function findDuplicates(scores: Score[]): string[] {
    const seen = new Set<string>();
    const problems: string[] = [];

    for (const s of scores) {
        if (!s.event) continue;
        const key = `${s.event}::${s.player.toLowerCase()}`;
        if (seen.has(key)) {
            problems.push(`${s.player} appears more than once in ${s.event}`);
        }
        seen.add(key);
    }
    return problems;
} 