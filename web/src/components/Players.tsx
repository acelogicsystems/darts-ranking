"use client"

import { useState } from "react";
import type { Report } from "@/engine/report";
import type { Profile } from "@/engine/profiles";
import ProgressChart from "@/components/ProgressChart";
import { chip, chipBase } from "@/lib/ui";

function FormChips({ form }: { form: number[] }) {
    return (
        <div className="mt-3.5 flex gap-1.5">
            {form.map((r, i) => (
                <span key={i} className={`${chipBase} ${chip(r)}`}>
                    {r}
                </span>
            ))}
        </div>
    );
}

function ProfileView({
    profile: P,
    onBack,
}: {
    profile: Profile;
    onBack: () => void;  
  
} ) {
    const stats: [string, number] [] = [
       ["Season Points", P.seasonPoints],
       ["Wins" , P.wins],
       ["Podiums" , P.podiums],
       ["Best finish", P.bestRank],
       ["Average finish", P.averageRank],
       ["Events", P.events],
];
const th = 
   "px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted";
const card = "mb-7 rounded-2xl border border-line bg-card p-5 shadow-sm";
const eyebrow = "text-xs font-semibold uppercase tracking-[0.16em] text-gold";

return (
    <div>
        <button
        type="button"
        onClick={onBack}
        className="mb-5 rounded-full border border-line bg-card px-5 py-2 text-sm font-medium transition hover:border-gold">
            ← All players
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Player profile
        </p>
        <h2 className="mb-5 mt-1 font-display text-4xl font-bold text-green sm:text-5xl">
            {P.player}
        </h2>

        <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
            {stats.map(([label, value]) => (
        <article
        key={label}
        className="rounded-2xl border border-line bg-card p-5 shadow-sm"
        >
            <p className="text-4xl font-semibold leading-none text-green">
                {value}
            </p>
            <p className="mt-1 text-sm text-muted">{label}</p>
            </article>
            ))}
        </div>

        <div className={card}>
            <p className={eyebrow}>Recent form</p>
            <FormChips form={P.form} />
            <p className="mt-3 text-sm text-muted">
                Finishing place in the last {P.form.length}{" "}
                {P.form.length === 1 ? "event" : "events"}, oldest first
            </p>
        </div>

        <div className={card}>
            <p className={`${eyebrow} mb-2`}>Season points progression</p>
            <ProgressChart results={P.results} />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-sm">
            <table className="w-full min-w-[360px] border-collapse">
                <thead>
                    <tr>
                        <th className={`${th} text-left`}>Event</th>
                        <th className={`${th} text-left`}>Place</th>
                        <th className={`${th} text-right`}>Points</th>
                        <th className={`${th} text-right`}>Legs</th>
                        <th className={`${th} text-right`}>Season pts</th>
                    </tr>
                </thead>
                <tbody>
                    {P.results.map((r) => (
                        <tr
                          key={r.event}
                          className="border-t border-line hover:bg-gold-soft/40"
                          >
                            <td className="px-5 py-4">{r.event}</td>
                            <td className="px-5 py-4">
                                <span className={`${chipBase} ${chip(r.rank)}`}>{r.rank}</span>
                            </td>
                            <td className="px-5 py-4 text-right tabular-nums">{r.points}</td>
                            <td className="px-5 py-4 text-right tabular-nums">{r.legsWon}</td>
                            <td className="px-5 py-4 text-right tabular-nums">
                                {r.seasonPoints}
                            </td>
                          </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

}

export default function Players({ report }: { report: Report }) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<string | null>(null);

    const profile= report.profiles.find((p) => p.player === selected);
    if (profile) {
        return <ProfileView profile={profile} onBack={() => setSelected(null)} />;
    }

    const q = query.trim().toLowerCase();
    const shown = report.profiles.filter((p) => 
    p.player.toLowerCase().includes(q)
);

return (
    <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players"
          aria-label="Search players"
          className="mb-5 w-full max-w-sm rounded-full border border-line bg-card px-5 py-3 text-[15px] text-ink placeholder:text-muted focus:border-gold focus:outline-none max-sm:max-w-none"
          />

          {shown.length === 0 ? (
            <p>
                No players match ″{query.trim()} ″.
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                {shown.map((p) => (
                    <button 
                    key={p.player}
                    type="button"
                    onClick={() => {
                        setSelected(p.player);
                        window.scrollTo(0, 0);
                    }}
                    className="w-full rounded-2xl border border-line bg-card p-5 text-left shadow-sm transition hover:border-gold sm:hover:-translate-y-0.5"
                    >
                        <p className="font-display text-3xl font-bold">{p.player}</p>
                        <p className="mt-2 text-4xl font-semibold leading-none text-green">
                            {p.seasonPoints}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                            season points · {p.events} events
                        </p>
                        <FormChips form={p.form} />
                    </button>
                ))}
                </div>
          )}
    </div>
);
}