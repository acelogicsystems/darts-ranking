export type Player = { id: number; name: string };
export type Score = {
    id: number;
    playerId: number;
    event: string;
    points: number;
    legsWon: number;
};

let players: Player[] = [];
let scores: Score[] = [];
let nextPlayerId = 1;
let nextScoreId = 1;

export function listPlayers(): Player[] {
    return [...players];
}

export function findPlayer(id: number): Player | undefined {
    return players.find((p) => p.id === id);
}

export function addPlayer(name: string): Player {
    const player = { id: nextPlayerId++, name };
    players.push(player);
    return player;
}

export function removePlayer(id: number): boolean {
    const before = players.length;
    players = players.filter((p) => p.id !== id);
    const removed = players.length < before;
    if (removed) {
        scores = scores.filter((s) => s.playerId !== id);
    }
    return removed;
}

export function listScores(): Score[] {
    return [...scores];
}

export function addScore(input: Omit<Score, "id">): Score {
    const score = { id: nextScoreId++, ...input };
    scores.push(score);
    return score;
}

export function removeScore(id: number): boolean {
    const before = scores.length;
    scores = scores.filter((s)  => s.id !== id);
    return scores.length < before;
}

export function resetStore(): void {
    players = [];
    scores = [];
    nextPlayerId = 1;
    nextScoreId = 1;
}