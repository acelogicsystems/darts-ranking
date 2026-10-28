export function parseLine(line: string): string[] {
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"' && line[i + 1] === '"'){
                cur += '"';
                i++;
            } else if (ch === '"'){
                inQuotes = false;
            } else {
                cur += ch;
            }
        } else if (ch === '"'){
            inQuotes = true;
        } else if (ch === ','){
            cells.push(cur.trim());
            cur = "";
        } else {
            cur += ch;
        }
    }
    cells.push(cur.trim());
    return cells;
}