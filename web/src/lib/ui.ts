export function chip(rank: number): string {
    if (rank === 1) return "bg-gold text-card";
    if (rank === 2) return "bg-[#d9d4c7] text-ink";
    if (rank === 3) return "bg-[#e4c9a6] text-[#5b3d17]";
    return "bg-green-soft text-green";
}

export const chipBase = 
"inline-grid size-8 lace-items-center rounded-full text-sm font-semibold";