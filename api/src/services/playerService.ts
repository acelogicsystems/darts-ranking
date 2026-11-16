import { HttpError } from "../errors";
import type { Store } from "../store";

export function createPlayerService(store: Store) {
  return {
    list() {
      return store.listPlayers();
    },

    async get(id: string) {
      const player = await store.findPlayer(id);
      if (!player) throw new HttpError(404, "Player not found");
      return player;
    },

    async create(name: string) {
      const taken = (await store.listPlayers()).some(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );
      if (taken) throw new HttpError(409, "Player already exists");
      return store.addPlayer(name);
    },

    async remove(id: string) {
      if (!(await store.removePlayer(id))) {
        throw new HttpError(404, "Player not found");
      }
    },
  };
}

export type PlayerService = ReturnType<typeof createPlayerService>;