import Leaderboard from "@/components/Leaderboard";
import { getReport } from "@/lib/getReport";

export default function Home() {
  const result = getReport();

  return (
    <main className="mx-auto max-w-4xl px-5 pb-16">
      <header className="border-b border-line py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          League standings
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold text-green sm:text-6xl">
          Darts Rankings
        </h1>
        <p className="mt-3 max-w-md text-muted ">
          Season table, overall totals and every event. Tied players share a rank.
        </p>
      </header>

      {result.ok ? (
        <Leaderboard report={result.report}/>
      ) : (
        <div className="mt-10 rounded-2xl border border-gold bg-gold-soft p-6">
          <h2 className="font-display text-2xl font-bold text-green">
            The data needs attention
          </h2>
          <p className="mt-2 text-muted">{result.error} </p>
          {result.problems && (
            <ul className="mt-3 list-disc pl-5 text-ink">
              {result.problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  )
}