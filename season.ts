import { rankByEvent } from "./events";
import type { Score } from "./ranking";

export const DEFAULT_TABLE = [10, 8, 6, 5, 4, 3, 2, 1];

export type SeasonRow = {
    player: string;
    seasonPoints: number;
    wins: number;
    events: number;
    rank: number;
};

export function seasonStandings(
    scores: Score[],
    table: number[] = DEFAULT_TABLE
): SeasonRow[] {
    const totals = new Map<string, Omit<SeasonRow, "rank">>();

    for (const ranked of rankByEvent(scores).values()) {
        for (const r of ranked) {
            const t = totals.get(r.player) ?? {
                player: r.player,
                seasonPoints: 0,
                wins: 0,
                events: 0,
            };
            t.seasonPoints += table[r.rank - 1] ?? 0;
            if (r.rank === 1) t.wins += 1;
            t.events += 1;
            totals.set(r.player, t);
        }
    }

    const sorted = [...totals.values()].sort(
        (a, b) =>
            b.seasonPoints - a.seasonPoints ||
            b.wins - a.wins ||
            a.player.localeCompare(b.player)
    );

    let rank = 0;
    return sorted.map((p, i) => {
        const prev = sorted[i - 1];
        const tied =
            prev && prev.seasonPoints === p.seasonPoints && prev.wins === p.wins;
        if (!tied) rank = i + 1;
        return { ...p, rank };
    });
}