import { HttpError } from "../errors";
import type { NewScore, Store } from "../store";

export function createScoreService(store: Store) {
    return {
        async list(event?: string) {
            const all = await store.listScores();
            if (!event) return all;
            return all.filter((s) => s.event.toLowerCase() === event.toLowerCase());
        },

        async create(input: NewScore) {
            if (!(await store.findPlayer(input.playerId))) {
                throw new HttpError(422, "playerId does not match any player");
            }

            const duplicate = (await store.listScores()).some(
                (s) =>
                    s.playerId === input.playerId &&
                s.event.toLowerCase() === input.event.toLowerCase()
            );
            if (duplicate) {
                throw new HttpError(409, "That player already has a score for this event");
            }
             return store.addScore(input);
        },

        async remove(id: string) {
            if (!(await store.removeScore(id))) {
                throw new HttpError(404, "Score not found");
            }
        },
    };
}

export type ScoreService = ReturnType<typeof createScoreService>;