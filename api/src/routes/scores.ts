import { Router } from "express";
import { z }from "zod";
import { parseId } from "../ids";
import { validateBody } from "../middleware";
import type { ScoreService } from "../services/scoreService";

const scoreSchema = z.object({
    playerId: z.string().trim().min(1, "playerId is required"),
    event: z
      .string()
      .trim()
      .min(1, "event is required")
      .max(60, "event must be 60 characters or fewer"),
      points: z.number().int().min(0, "points must be 0 or more"),
      legsWon: z.number().int().min(0, "legsWon must be 0 or more"),
});

export function scoresRouter(scores: ScoreService) {
    const router = Router();

    router.get("/", async (req, res) => {
        const event = 
         typeof req.query.event === "string" ? req.query.event : undefined;
         res.json(await scores.list(event));  
        });

    router.post("/", validateBody(scoreSchema), async (req, res) => {
        res.status(201).json(await scores.create(req.body));
    });

    router.delete("/:id", async (req, res) => {
        await scores.remove(parseId(req.params.id));
        res.status(204).end();
    });

    return router;
}