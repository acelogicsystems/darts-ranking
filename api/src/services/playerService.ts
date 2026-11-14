import { HttpError } from "../errors";
import * as store from "../store";

export function list() {
    return store.listPlayers();
}

export function get(id: number) {
    const player = store.findPlayer(id);
    if (!player) throw new HttpError(404, "Player not found");
    return player;
}

export function create(name: string) {
    const taken = store
    .listPlayers()
    .some((p) => p.name.toLowerCase() === name.toLowerCase());
   if (taken)  throw new HttpError(409, "Player already exists");
   return store.addPlayer(name);
}

export function remove(id: number) {
    if (!store.removePlayer(id)) throw new HttpError(404, "Player not found");
}