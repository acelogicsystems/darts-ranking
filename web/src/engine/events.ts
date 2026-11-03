import { rankPlayers } from "./ranking";
import type { Score, Ranked } from "./ranking";

export function rankByEvent(scores: Score[]): Map<string, Ranked[]> {
    const grouped = new Map<string, Score[]>();

    for (const s of scores) {
        const key = s.event ?? "Unnamed event";
        const list = grouped.get(key) ?? [];
        list.push(s);
        grouped.set(key, list);
    }

    const result = new Map<string, Ranked[]>();
    for (const [event, list] of grouped) {
        result.set(event, rankPlayers(list));
    }

    return result;
}