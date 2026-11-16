import { Router } from "express";
import { z } from "zod";
import { parseId } from "../ids";
import { validateBody } from "../middleware";
import type { PlayerService } from "../services/playerService";


const playerSchema = z.object({
    name: z
    .string()
    .trim()
    .min(1, "name is required")
    .max(50, "name must be 50 characters or fewer"),
});

export function playersRouter(players: PlayerService) {
    const router = Router();

    router.get("/", async (_req, res) => {
        res.json(await players.list());
    });

    router.post("/", validateBody(playerSchema), async (req, res) => {
        res.status(201).json(await players.create(req.body.name));
    });

    router.get("/:id", async (req, res) => {
        res.json(await players.get(parseId(req.params.id)));
    });

    router.delete("/:id", async (req, res) => {
        await players.remove(parseId(req.params.id));
        res.status(204).end();
    });

    return router;
}