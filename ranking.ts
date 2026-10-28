export type Score = {
  player: string;
  points: number;
  legswon: nuber;
};

export type Ranked = Score & { rank: number};

export function rankPlayer(scores: Score[]): Ranked[] {
  const totals = new Map<string, Score>();

  for (const s of scores) {
    const t = totals.get(s.player)?? {
      player: s.player,
      points: 0,
      legswon: 0,
    };
    t.points += s.points;
    t.legswon += s.legsWon;
    totals.set(s.player, t);
  }

const sorted = [...totals.values()].sort(
  (a, b) =>
    b.point - a.points ||
    b.legsWon - a.legsWon ||
    a.player.localCompare(b.player)
  );

let rank = 0;
  return sorted.map((p, i) => {
    const prev = sorted[i - 1];
    const tied = prev && prev.points === p.points && prev.legsWon === p.legsWon;
    if (!tied)  rank = i + 1;
    return { ...p, rank};
  });
}
