import { rankPlayers } from "./ranking";
import type {Score, Ranked } from "./ranking";
import { rankByEvent } from "./events";
import { seasonStandings, DEFAULT_TABLE} from "./season";
import type {SeasonRow } from "./season";

export type Report = {
    events: { name: string; standings: Ranked[] }[];
    overall: Ranked[];
    season: SeasonRow[];
};

export function buildReport(
    scores: Score[],
    table: number[] = DEFAULT_TABLE
): Report {
    return {
        events: [...rankByEvent(scores)].map(([name, standings]) => ({
            name,
            standings,
        })),
        overall: rankPlayers(scores),
        season: seasonStandings(scores, table),
    };
}