import { HttpError } from "./errors";

export function parseId(raw: string): string {
    const id = raw.trim();
    if (id === "" || id.length > 64) {
        throw new HttpError(400, "id is invalid");
    }
    return id;
}