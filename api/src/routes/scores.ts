import { Router } from "express";
import { z } from "zod";
import { parseId } from "../ids";
import { validateBody } from "../middleware";
import * as scores from "../services/scoreService";

const scoreSchema = z.object({
    playerId: z.number().int().positive(),
    event: z
    .string()
    .trim()
    .min(1, "event is required")
    .max(60, "event must be 60 characters or fewer"),
    points: z.number().int().min(0, "points must be 0 or more"),
    legsWon: z.number().int().min(0, "legsWon must be 0 or more"),
});

export const scoresRouter = Router();

scoresRouter.get("/", (req, res) => {
    const event = typeof req.query.event === "string" ? req.query.event : undefined;
    res.json(scores.list(event));
});

scoresRouter.post("/", validateBody(scoreSchema), (req, res) => {
    res.status(201).json(scores.create(req.body));
});

scoresRouter.delete("/:id", (req, res) => {
    scores.remove(parseId(req.params.id));
    res.status(204).end();
})

