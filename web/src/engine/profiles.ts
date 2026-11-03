import { rankByEvent } from "./events";
import { DEFAULT_TABLE } from "./season";
import type { Score} from "./ranking";

export type EventResult = {
    event: string;
    rank: number;
    points: number;
    legsWon: number;
    seasonPoints: number;
};

export type Profile = {
    player: string;
    results: EventResult[];
    events: number;
    wins: number;
    podiums: number;
    bestRank: number;
    averageRank: number;
    form: number[];
    totalPoints: number;
    totalLegs: number;
    seasonPoints: number;
};

export function buildProfiles(
    scores: Score[],
    table: number[] = DEFAULT_TABLE
): Profile[] {
    const byPlayer = new Map<string, EventResult[]>();

    for (const [event, ranked] of rankByEvent(scores)) {
        for (const r of ranked) {
            const list = byPlayer.get(r.player) ?? [];
            list.push({
                event,
                rank: r.rank,
                points: r.points,
                legsWon: r.legsWon,
                seasonPoints: table[r.rank - 1]  ?? 0,
            });
            byPlayer.set(r.player, list);
        }
    }

    return [...byPlayer]
      .map(([player, results]) => {
        const ranks = results.map((r) => r.rank);
        const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);
        return {
            player,
            results,
            events: results.length,
            wins: ranks.filter((r) => r === 1).length,
            podiums: ranks.filter((r) => r <= 3).length,
            bestRank: Math.min(...ranks),
            averageRank: Math.round((sum(ranks) / ranks.length) * 10) / 10,
            form: ranks.slice(-3),
            totalPoints: sum(results.map((r) => r.points)),
            totalLegs: sum(results.map((r) => r.legsWon)),
            seasonPoints: sum(results.map((r) => r.seasonPoints)),
        };
      })
      .sort((a, b) => a.player.localeCompare(b.player));
}