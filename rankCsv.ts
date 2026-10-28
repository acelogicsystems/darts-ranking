import { loadScores } from "./loadCsv"
import { rankPlayers } from "./ranking";
import { rankByEvent } from "./events";
import { formatBroadcast } from "./formatter";

const file = process.argv[2] ?? "scores.csv";
const only = process.argv[3];

const scores = loadScores(file);
const byEvent = rankByEvent(scores);

if (only) {
    const ranked = byEvent.get(only);
    if (!ranked) {
        console.error(
            `No event called "${only}". Available: ${[...byEvent.keys()].join(", ")}`
        );
        process.exit(1)
    }
    console.table(ranked);
    console.log("\n" + formatBroadcast(ranked, `DARTS RANKING - ${only}`));
} else {
    for (const [event, ranked] of byEvent) {
        console.log(`\n=== ${event} ===`);
        console.table(ranked);
        console.log(formatBroadcast(ranked, `DARTS RANKINGS - ${event}`));
    }
    const overall = rankPlayers(scores);
    console.log("\n=== OVERALL ===");
    console.table(overall);
    console.log(formatBroadcast(overall, "DARTS RANKING - OVERALL"));
}