export type Player = { id: string; name: string };

export type Score = {
    id: string;
    playerId: string;
    event: string;
    points: number;
    legsWon: number
};

export type NewScore = Omit<Score, "id">;

export interface Store {
    listPlayers(): Promise<Player[]>;
    findPlayer(id: string): Promise<Player | undefined>;
    addPlayer(name: string): Promise<Player>;
    removePlayer(id: string): Promise<boolean>;
    listScores(): Promise<Score[]>;
    addScore(input: NewScore): Promise<Score>;
    removeScore(id: string): Promise<boolean>;
}