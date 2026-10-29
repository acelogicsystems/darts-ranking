import type { Ranked } from "./ranking";
import type { SeasonRow } from "./season";

export function formatBroadcast(
    ranked: Ranked[],
    title = "DARTS RANKING SYSTEM"
): string {
    const groups = new Map<number, Ranked[]>();
    for (const r of ranked) {
        const g = groups.get(r.rank)  ?? [];
        g.push(r);
        groups.set(r.rank, g);
    }
    const lines = [...groups.entries()].map(([ranked, players]) => {
        const names = players.map((p) => p.player).join(" / ");
        return `*${ranked}.* ${names} - ${players[0].points} pts`;
    });

    return [`*${title}*`, "", ...lines].join("\n");

}
export function formatSeasonBroadcast(
    rows: SeasonRow[],
    title = "DARTS RANKINGS - SEASON"
): string {
    const groups = new Map<number, SeasonRow[]>();
    for (const r of rows) {
        const g = groups.get(r.rank) ?? [];
        g.push(r);
        groups.set(r.rank, g);
    }

    const lines = [...groups.entries()].map(([rank, players]) => {
        const names = players.map((p) => p.player).join(" / ");
        return `*${rank}.* ${names} - ${players[0].seasonPoints} pts`;
    });

    return [`*${title}*`, "", ...lines].join("\n");
}