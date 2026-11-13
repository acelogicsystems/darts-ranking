export type Player = { id: number; name: string };

let players: Player[] = [];
let nextId = 1;

export function listPlayers(): Player[]  {
    return [...players];
}

export function findPlayer(id: number): Player | undefined {
    return players.find((p) => p.id === id);
    
}

export function addPlayer(name: string): Player {
    const player = { id: nextId++, name};
    players.push(player);
    return player;
}

export function removePlayer(id: number): boolean {
    const before = players.length;
    players = players.filter((p) => p.id !== id);
    return players.length < before;
}

export function resetStore(): void {
    players = [];
    nextId = 1;
}