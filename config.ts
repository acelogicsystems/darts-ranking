import { readFileSync } from "node:fs";

export function parsePointsTable(text: string): number[] {
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error("Points file is not valid JSON");
    }

    const table = Array.isArray(data) ? data :  (data as { table?: unknown})?.table;
    if (!Array.isArray(table) || table.length === 0) {
        throw new Error('Points file must be a list of numbers or {"table": [...]}');
    }
    if (!table.every((n) => typeof n === "number" && Number.isFinite(n) && n >= 0)) {
        throw new Error("Pointd must be non-negative numbers ");
    }
    return table as number[];
}

export function loadPointsTable(path: string): number [] {
    return parsePointsTable(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
}