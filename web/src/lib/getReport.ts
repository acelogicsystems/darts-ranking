import path from "node:path";
import {loadScores } from  "@/engine/loadCsv";
import { loadPointsTable } from "@/engine/config";
import { findDuplicates } from "@/engine/validate";
import { buildReport } from "@/engine/report";
import type { Report } from "@/engine/report";

export type ReportResult = 
  | { ok: true; report: Report }
  | { ok: false; status: number; error: string; problems?: string[] };

export function getReport(): ReportResult {
    try {
        const dataDir = path.join(process.cwd(), "data");
        const scores = loadScores(path.join(dataDir, "scores.csv"));

        const problems = findDuplicates(scores);
        if (problems.length > 0) {
            return { ok: false, status: 422, error: "Invalid data", problems};
        }

        const table = loadPointsTable(path.join(dataDir, "points.json"));
        return {  ok: true, report: buildReport(scores, table) };
    } catch (e) {
        return { ok: false, status: 500, error: (e as Error).message };
    }
}  