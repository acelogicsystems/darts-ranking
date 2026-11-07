import type { EventResult } from "@/engine/profiles";

export default function ProgressChart({ results }: { results: EventResult[] }) {
    const pts:  { event: string; total: number}[] = [];
    let total = 0;
    for (const r of results) {
        total += r.seasonPoints;
        pts.push({ event: r.event, total })
    };

    const W = 640;
    const H = 240;
    const L = 44;
    const R = 24;
    const T = 20;
    const B = 44;
    const max = Math.max(10, ...pts.map((p) => p.total));

    const x = (i: number) => 
        pts.length === 1 ? (L + W -R) / 2 : L + (i * (W - L -R)) / (pts.length - 1);
    const y = (v: number) => T + (1 - v / max) * (H - T - B);
    const ticks = [0, 1, 2, 3, 4].map((i) => Math.round((max * i) / 4));

    return (
        <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Season points after each event"
        className="h-auto w-full"
        >
            {ticks.map((v, i) => (
                <g key={i}>
                    <line x1={L} x2={W -R} y1={y(v)} y2={y(v)} stroke="#e8e0d0" />
                    <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#7a7467">
                        {v}
                    </text>
                </g>
            ))}

            <polyline
              points={pts.map((p, i) => `${x(i)},${y(p.total)}`).join(" ")}
              fill="none"
              stroke="#1f4d3a"
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {pts.map((p, i) => (
                <g key={p.event}>
                    <circle cx={x(i)} cy={y(p.total)} r={6} fill="#b8893b" stroke="fffdf8" strokeWidth={2}>
                        <title>{`${p.event}: ${p.total} season points`}</title>
                    </circle>
                    <text x={x(i)} y={H -18} textAnchor="middle" fontSize="11" fill="#7a7467">
                        {p.event.length > 12 ? `${p.event.slice(0, 11)}…` : p.event}
                    </text>
                </g>
            ))}
        </svg>
    )

}