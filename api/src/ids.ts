import { HttpError } from "./errors";

export function parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id < 1) {
        throw new HttpError(400, "id must be a positive whole number");
    }
    return id;
}