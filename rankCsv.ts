import { loadScores } from "./loadCsv";
import { rankPlayers} from "./ranking";

const file = process.argv[2] ?? "scores.csv";
console.table(rankPlayers(loadScores(file)));