import { loadScores } from "./loadCsv";
import { rankPlayers} from "./ranking";
import { formatBroadcast } from "./formatter";

const file = process.argv[2] ?? "scores.csv";
const ranked = rankPlayers(loadScores(file));


console.table(rankPlayers(loadScores(file)));
console.log("\n" + formatBroadcast(ranked));

