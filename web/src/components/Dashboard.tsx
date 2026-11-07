"use client";

import { useState } from "react";
import type { Report } from "@/engine/report";
import Leaderboard from "@/components/Leaderboard";
import Players from "@/components/Players";

type Section = "standings" | "players";

const SECTIONS: { key: Section; label: string }[] =[
    { key: "standings", label: "Standings" },
    { key: "players", label: "Players"},
];

export default function Dashboard({ report }: { report: Report }) {
    const [section, setSection] = useState<Section>("standings");

    return (
        <div>
            <nav className="mt-6 flex gap-7 border-b border-line">
                {SECTIONS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSection(s.key)}
                      aria-pressed={section === s.key}
                      className={`-mb-px border-b-2 pb-3 text-sm font-semibold uppercase tracking-[0.14em] transition ${
                        section === s.key
                          ? "border-gold text-green"
                          : "border-transparent text-muted hover:text-ink"
                      }`}
                      >
                        {s.label}
                      </button>
                ))}
            </nav>

            {section === "standings" && <Leaderboard report={report} />}
            {section === "players" && (
                <div className="pt-8">
                    <Players report={report} />
                </div>    
            )}
        </div>
    );
}