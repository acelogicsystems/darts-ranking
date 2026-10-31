import { writeFileSync, mkdirSync } from "node:fs";
import { loadScores } from "./loadCsv";
import { rankPlayers } from "./ranking";
import { rankByEvent } from "./events";
import { seasonStandings } from "./season";
import { loadPointsTable } from "./config";
import { formatBroadcast, formatSeasonBroadcast } from "./formatter";
import { buildReport } from "./report";
import { findDuplicates } from "./validate";

const args = process.argv.slice(2);
const wantSeason = args.includes("--season");
const pointsArg = args.find((a) => a.startsWith("--points="));
const positional = args.filter((a) => !a.startsWith("--"));

const file = positional[0] ?? "scores.csv";
const only = positional[1];
let table: number[] | undefined;
if (pointsArg) {
    try {
        table = loadPointsTable(pointsArg.slice("--points=".length));
    } catch (e) {
        console.error((e as Error).message);
        process.exit(1);
    }
}

const scores = loadScores(file);

const problems = findDuplicates(scores);
if (problems.length > 0) {
    console.error("Problems found in " + file + ":");
    for (const p of problems) console.error(" – " + p);
    process.exit(1);
}

if (args.includes("--json")) {
    const report = buildReport(scores, table);
    mkdirSync("docs", { recursive: true })
    writeFileSync("docs/leaderboard.json", JSON.stringify(report, null, 2));
    console.log("Wrote docs/leaderboard.json");
    process.exit(0);
}

if (wantSeason) {
    const season = seasonStandings(scores, table);
    console.table(season);
    console.log("\n" + formatSeasonBroadcast(season));
} else {
    const byEvent = rankByEvent(scores);

    if(only) {
        const ranked = byEvent.get(only);
        if (!ranked) {
            console.error(
                `No event called "${only}". Available: ${[...byEvent.keys()].join(", ")}`
            );
            process.exit(1);
        }
        console.table(ranked);
        console.log("\n" + formatBroadcast(ranked, `DARTS RANKINGS - ${only}`));
    } else {
        for (const [event, ranked] of byEvent) {
            console.log(`\n=== ${event} ===`);
            console.table(ranked);
            console.log(formatBroadcast(ranked, `DARTS RANKINGS - ${event}`));
        }
        
        const overall = rankPlayers(scores);
        console.log("\n=== OVERALL ===");
        console.table(overall);
        console.log(formatBroadcast(overall, "DARTS RaNKINGS - OVERALL"));
    }
}