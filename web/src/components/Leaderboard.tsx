"use client";

import { useState } from "react";
import type  { Report } from "@/engine/report";
import { formatBroadcast, formatSeasonBroadcast } from "@/engine/formatter";
import  { chip } from "@/lib/ui";

type View = "season" | "overall" | "events";

type Row = { rank: number; player: string; value: number;cells: number[] };

type ViewData = {
    valueLabel: string;
    headers: string[];
    rows: Row[];
    message: string;
};

const TABS: { key: View; label: string }[] = [
    { key: "season", label: "Season" },
    { key: "overall", label: "Overall" },
    { key: "events", label: "By event" },
];

function buildView(report: Report, view: View, eventIndex: number): ViewData {
    if (view === "season") {
        return {
            valueLabel: "season points",
            headers: ["Season pts", "Wins", "Events"],
            rows: report.season.map((r) => ({
                rank: r.rank,
                player: r.player,
                value: r.seasonPoints,
                cells: [r.seasonPoints, r.wins, r.events],
            })),
            message: formatSeasonBroadcast(report.season, "DARTS RANKINGS - SEASON"),
        };
    }

    if (view === "overall") {
        return {
            valueLabel: "points",
            headers: ["Points", "Legs won"],
            rows: report.overall.map((r) => ({
                rank: r.rank,
                player: r.player,
                value: r.points,
                cells: [r.points, r.legsWon],
            })),
            message: formatBroadcast(report.overall, "DARTS RANKINGS - OVERALL"
            ),
        };
    }

    const event = report.events[eventIndex];
    const standings = event ? event.standings : [];
    return {
        valueLabel: "points",
        headers: ["Points", "Legs won"],
        rows: standings.map((r) => ({
            rank: r.rank,
            player: r.player,
            value: r.points,
            cells: [r.points, r.legsWon],
        })),
        message: formatBroadcast(
            standings ,
            `DARTS RANKINGS - ${event ? event.name : "EVENT"}`
        ),
    };
}

    export default function Leaderboard({ report }: { report: Report }) {
        const [view, setView] = useState<View>("season");
        const [eventIndex, setEventIndex] = useState(0);
        const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

        const data = buildView(report, view, eventIndex);
        const top = data.rows.slice(0, 3);
        async function copy() {
            try {
                await navigator.clipboard.writeText(data.message);
                setCopied("ok")
            } catch {
                setCopied("fail");
            }
            setTimeout(() => setCopied("idle"), 2000);
        }

        const th = 
        "px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted";

        return (
            <section>
                <nav className="mb-6 mt-8 flex flex-wrap items-center gap-2" >
                    {TABS.map((t) => (
                        <button
                        key={t.key}
                        type="button"
                        onClick={() => setView(t.key)}
                        aria-pressed={view === t.key}
                        className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                            view === t.key
                            ? "border-green bg-green text-card"
                            : "border-line bg-card text-ink hover:border-gold"
                        }`}>
                            {t.label}
                        </button>
                    ))}
                    {view === "events" && report.events.length > 0 && (
                        <select
                           value={eventIndex}
                           onChange={(e) => setEventIndex(Number(e.target.value))}
                           aria-label="Choose an event"
                           className="rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm font-medium text-ink max-sm:w-full"
                           >
                            {report.events.map((ev, i) => (
                                <option key={ev.name} value={i}>
                                  {ev.name}
                                </option>
                            ))}
                           </select>
                    )}
                </nav>

                <div className="mb-4 flex justify-end max-sm:justify-stretch">
                    <button 
                    type="button"
                    onClick={copy}
                    className="rounded-full border border-gold bg-gold-soft px-5 py-2.5 text-sm font-semibold text-green transition hoveer:bg-gold hover:text-card max-sm:w-full"
                    >
                        {copied === "ok"
                        ? "copied ✔"
                        : copied === "fail"
                          ? "Copy failed"
                          : "Copy for WhatsApp"
                    }
                    </button>

                </div>

                {data.rows.length === 0 ? (
                    <p className="py-10 text-center text-muted">No results yet.</p>
                 ) : (
                    <>
                    <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr)] gap-4">
                        {top.map((r) => (
                            <article
                             key={r.player}
                             className={`rounded-2xl border p-5 shadow-sm ${
                                r.rank === 1 ? "border-gold bg-gold-soft" : "border-line bg-card"
                             }`}
                             >
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                                    Rank {r.rank}
                                </p>
                                <p className="mt-1.5 font-display text-3xl font-bold">
                                    {r.player}
                                </p>
                                <p className="mt-2 text-4xl font-semibold leading-none text-green">
                                    {r.value}
                                </p>
                                <p className="mt-1 text-sm text-muted">{data.valueLabel}</p>

                             </article>
                        ))}
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-sm">
                            <table className="w-full min-w-[360px] border-collapse">
                                <thead>
                                    <tr>
                                        <th className={`${th} text-left`}>Rank</th>
                                        <th className={`${th} text-left`}>Player</th>
                                        {data.headers.map((h) => (
                                            <th key={h} className={`${th} text-right`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.rows.map((r) => (
                                        <tr
                                        key={r.player}
                                        className="border-t border-line hover:bg-gold-soft/40"
                                        >
                                            <td className="px-5 py-4">
                                                <span 
                                                className={`inline-grid size-8 place-items-center rounded-full text-sm font-semibold ${chip(r.rank)}`}
                                                >
                                                    {r.rank}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-medium">{r.player}</td>
                                            {r.cells.map((c, i) => (
                                                <td key={i} className="px-5 py-4 text-right tabular-num">
                                                    {c}
                                                </td>
                                            ))}

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                        </>
                 )}
            </section>
        );
       
    
}