import { loadScores } from "./loadCsv";
import { rankPlayers } from "./ranking";
import {rankByEvent} from "./events";
import { formatBroadcast } from "./formatter";

const file = process.argv[2] ?? "scores.csv";
const scores = loadScores(file);

for (const [event, ranked] of rankByEvent(scores)) {
    console.log(`\n=== ${event} ===`);
    console.table(ranked);
    console.log(formatBroadcast(ranked, `DARTS RANKINGS - ${event}`));
}

const overall = rankPlayers(scores);
console.log(`\n=== OVERALL ===`);
console.table(overall);
console.log(formatBroadcast(overall, "DARTS RANKINGS - OVERALL"));