import type { NewScore, Player, Score, Store } from "./store";

export function createMemoryStore(): Store {
    let players: Player[] = [];
    let scores: Score[] = [];
    let nextPlayerId = 1;
    let nextScoreId = 1;

    return {
        async listPlayers() {
            return [...players];
        },
        
        async findPlayer(id) {
            return players.find((p) => p.id === id);
        },

        async addPlayer(name) {
            const player = { id: String(nextPlayerId++), name };
            players.push(player);
            return player
        },

        async removePlayer(id) {
            const before = players.length;
            players = players.filter((p) => p.id !== id);
            const removed = players.length < before;
            if (removed) {
                scores = scores.filter((s) => s.playerId !== id);
            }
            return removed;
        },

        async listScores() {
            return[...scores];
        },

        async addScore(input: NewScore) {
            const score = { id: String(nextScoreId++), ...input };
            scores.push(score);
            return score;
        },

        async removeScore(id) {
            const before = scores.length;
            scores = scores.filter((s) => s.id !== id);
            return scores.length < before;
        },
    };
}