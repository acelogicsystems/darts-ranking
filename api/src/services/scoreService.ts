import { HttpError } from "../errors";
import * as store from "../store";

export type NewScore = {
    playerId: number;
    event: string;
    points: number;
    legsWon: number;
};

export function list(event?: string) {
    const all = store.listScores();
    if (!event) return all;
    return all.filter((s) => s.event.toLowerCase() === event.toLowerCase());
}

export function create(input: NewScore) {
    if (!store.findPlayer(input.playerId)) {
        throw new HttpError(422, "playerId does not match any player");
    }

    const duplicate = store
      .listScores()
      .some(
        (s) =>
            s.playerId === input.playerId &&
        s.event.toLowerCase() === input.event.toLowerCase()
      );
      if (duplicate) {
        throw new HttpError(409, "That player already has a score for this event");
      }
      return store.addScore(input);

}

export function remove(id: number) {
    if (!store.removeScore(id)) throw new HttpError(404, "Score not found");
}