import { readFileSync } from "node:fs";
import type { Score } from "./ranking";
import { parseLine } from "./csv";

export function loadScores(path: string): Score[] {
    const text = readFileSync(path, "utf8").replace(/^\uFEFF/, "");

    const rows = text
      .split(/\r?\n/)
      .map((line, i) => ({ line, row: i + 1}))
      .filter((r) => r.line.trim() !== "");

if (rows.length === 0) throw new Error("CSV file is empty");

const header = parseLine(rows[0].line);
const iPlayer = header.indexOf("player");
const iPoints = header.indexOf("points");
const iLegs = header.indexOf("legsWon");

if ([iPlayer, iPoints, iLegs].includes(-1)) {
    throw new Error("CSV must have player, points and legsWon columns");
}
return rows.slice(1).map(({line, row}) => {
    const cells = parseLine(line);
    const player = cells[iPlayer];
    if (!player) throw new Error(`missing player name on CSV row ${row}`);
    const points = Number(cells[iPoints]);
    const legsWon = Number(cells[iLegs]);
    if (Number.isNaN(points) || Number.isNaN(legsWon)){
        throw new Error(`Bad number on CSV row ${row}`);
    }
    return { player, points, legsWon};
});
}