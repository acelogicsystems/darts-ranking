import { readFileSync } from "node:fs";
import type { Score } from "./ranking";

export function loadScores(path: string): Score[] {
    const lines = readFileSync(path, "utf8").split(/\r?\n/);
    const header = lines[0].split(",").map((h) => h.trim());
    const col = (name: string) => header.indexOf(name);

    const iPlayer = col("player");
    const iPoints = col("points");
    const iLegs = col("legsWon");

    if ([iPlayer, iPoints, iLegs].includes(-1)) {
        throw new Error("CSV must have player, points and legsWon columns");
    }

    return lines.slice(1).map((line, n) => {
        const cells = line.split(",").map((c) => c.trim());
        const points = Number(cells[iPoints]);
        const legsWon = Number(cells[iLegs]);
        if (Number.isNaN(points) || Number.isNaN(legsWon)) {
            throw new Error(`Bad number on CSV row ${n + 2}`);
        }
        return { player: cells[iPlayer], points, legsWon };
    });
}