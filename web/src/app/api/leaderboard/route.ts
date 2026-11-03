import { NextResponse } from "next/server";
import path from "node:path";
import { loadScores } from  "@/engine/loadCsv";
import { loadPointsTable } from "@/engine/config";
import { findDuplicates } from "@/engine/validate";
import { buildReport } from "@/engine/report";


export function GET() {
    try {
        const dataDir = path.join(process.cwd(), "data");
        const scores = loadScores(path.join(dataDir, "scores.csv"));

        const problems = findDuplicates(scores);
        if (problems.length > 0) {
            return NextResponse.json(
                { error: "Invalid data", problems },
                { status: 422}
            );
        }

            const table = loadPointsTable(path.join(dataDir, "points.json"));
            return NextResponse.json(buildReport(scores, table));
         } catch (e) {
            return NextResponse.json(
                { error: (e as Error).message },
                { status: 500 }
            );
         }
}