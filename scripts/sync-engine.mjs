import { copyFileSync, mkdirSync } from "node:fs";
const engine = [
    "ranking", "events", "season", "profiles", "h2h", "report",
    "csv", "loadCsv", "validate", "config", "formatter",
];
const data = ["scores.csv", "points.json"];

mkdirSync("web/src/engine", { recursive: true });
mkdirSync("web/data", { recursive: true});

for (const f of engine) copyFileSync(`${f}.ts`, `web/src/engine/${f}.ts`);
for (const f of data) copyFileSync(f, `web/data/${f}`);

console.log(`copied ${engine.length} engine files and ${data.length} data files into web/`);