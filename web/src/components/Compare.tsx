"use client";
import { useState} from "react";
import type { Report} from "@/engine/report";
import { headToHead } from "@/engine/h2h";
import { chip, chipBase } from "@/lib/ui";

const th = "px-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted";
const selectCls = "w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm font-medium text-ink";
const heading = "mb-3 mt-8 font-display text-2xl font-bold text-green";

export default function Compare({ report }: { report: Report}) {
    const profiles = report.profiles;
    const [pickA, setPickA] = useState(profiles[0]?.player ?? "");
    const [pickB, setPickB] = useState(profiles[1]?.player ?? "");

    if (profiles.length < 2) {
        return (
            <p className="py-10 text-center text-muted">
                Two players are needed to compare.
            </p>
        );
    }

    const a = profiles.find((p) => p.player === pickA) ?? profiles[0];
    const b =
     profiles.find((p) => p.player === pickB && p.player !== a.player) ??
     profiles.find((p) => p.player !== a.player) ??
     profiles[1];

    const h = headToHead(a, b);

    const cards: [string, number, boolean][] = [
        [a.player, h.winsA, h.winsA > h.winsB],
        ["Tied", h.ties, false],
        [b.player, h.winsB, h.winsB > h.winsA],
    ];
    const glance: [string, number, number][] = [
        ["Season points", a.seasonPoints, b.seasonPoints],
        ["Wins", a.wins, b.wins],
        ["Podiums", a.podiums, b.podiums],
        ["Best finish", a.averageRank, b.averageRank],
        ["Events played", a.events, b.events],
    ];

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end gap-3.5">
                <label className="flex min-w-[140px] flex-1 flex-col gap-1.5">
                    <span className="text-sm text-muted">Player A</span>
                    <select
                       value={a.player}
                       onChange={(e) => setPickA(e.target.value)}
                       className={selectCls}
                       >
                        {profiles
                         .filter((p) => p.player !== b.player)
                          .map((p) => (
                          <option key={p.player} value={p.player}>
                            {p.player}
                          </option>
                        ))}
                    </select>
                </label>

                <span className="pb-3 font-display text-2xl font-bold text-gold">vs</span>

                <label className="flex min-w-[140px] flex-1 flex-col gap-1.5">
                    <span className="text-sm text-muted">Player B</span>
                    <select 
                      value={b.player}
                      onChange={(e) => setPickB(e.target.value)}
                      className={selectCls}
                      >
                        {profiles
                          .filter((p) => p.player !== a.player)
                          .map((p) => (
                            <option key={p.player} value={p.player}>
                                {p.player}
                            </option>
                          ))}
                      </select>
                </label>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                {cards.map(([name, n, lead]) => (
                    <article
                      key={name}
                      className={`rounded-2xl border p-5 shadow-sm ${
                        lead ? "border-gold bg-gold-soft" : "border-line bg-card"
                      }`}
                      >
                        <p className="font-display text-3xl font-bold">{name}</p>
                        <p className="mt-2 text-4xl font-semibold leading-none text-green">
                            {n}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                            {n === 1 ? "event" : "events"}
                        </p>
                      </article>
                ))}
            </div>

            {h.meetings.length === 0 ? (
                <p className="py-10 text-center text-muted">
                    {a.player} and {b.player} have not met in an event yet.
                </p>
            ) : (
                <>
                 <h3 className={heading}>Shared events</h3>
                 <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-sm">
                    <table className="w-full min-w-[420px] border-collapse">
                        <thead>
                            <tr>
                                <th className={`${th} text-left`}>Event</th>
                                <th className={`${th} text-left`}>{a.player}</th>
                                <th className={`${th} text-left`}>{b.player}</th>
                                <th className={`${th} text-left`}>Better finish</th>
                            </tr>
                        </thead>
                        <tbody>
                            {h.meetings.map((m) => (
                                <tr
                                key={m.event}
                                className="border-t border-line hover:bg-gold-soft/40"
                                >
                                    <td className="px-5 py-4">{m.event}</td>
                                    <td className="px-5 py-4">
                                        <span className={`${chipBase} ${chip(m.rankA)}`}>
                                            {m.rankA}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`${chipBase} ${chip(m.rankB )}`}>
                                          {m.rankB}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
                </>
            )}

            <h3 className={heading}>Season at a glance</h3>
            <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-sm">
                <table className="w-full min-w-[360px] border-collapse">
                <thead>
                    <tr>
                        <th className={`${th} text-left`} />
                        <th className={`${th} text-right`}>{a.player}</th>
                        <th className={`${th} text-right`}>{b.player}</th>
                    </tr>
                </thead>
                <tbody>
                    {glance.map(([label, va, vb]) => (
                        <tr key={label} className="border-t border-line">
                            <td className="px-5 py-4 text-muted">{label}</td>
                            <td className="px-5 py-4 text-right tabular-nums">{va}</td>
                            <td className="px-5 py-4 text-right tabular-nums">{vb}</td>
                        </tr>
                       ))}
                </tbody>
                </table>
            </div>
        </div>
    );

}