import { loadScores } from "./loadCsv"
import { rankPlayers } from "./ranking";
import { rankByEvent } from "./events";
import { seasonStandings } from "./season";
import { formatBroadcast, formatSeasonBroadcast } from "./formatter";

const args = process.argv.slice(2);
const wantSeason = args.includes("--season");
const positional = args.filter((a) => !a.startsWith("--"));

const file = positional[0] ?? "scores.csv";
const only = positional[1];

const scores = loadScores(file);

if (wantSeason) {
    const season = seasonStandings(scores);
    console.table(season);
    console.log("\n" + formatSeasonBroadcast(season));
} else {
    const byEvent = rankByEvent(scores);

    if (only) {
        const ranked = byEvent.get(only);
        if (!ranked) {
            console.error(
                `No event called "${only}". Available: ${[...byEvent.keys()].join(", ")}`
            );
            process.exit(1);
        }
        console.table(ranked);
        console.log("\n" + formatBroadcast(ranked, `DARTS RANKING - ${only}`));
    } else {
        for (const [event, ranked] of byEvent) {
            console.log(`\n=== ${event} ===`);
            console.table(ranked);
            console.log(formatBroadcast(ranked, `DARTS RANKING - ${event}`));
        }

        const overall = rankPlayers(scores);
        console.log("\n=== OVERALL ===");
        console.table(overall);
        console.log(formatBroadcast(overall, "DARTS RANKINGS - OVERALL"));
    }
}

