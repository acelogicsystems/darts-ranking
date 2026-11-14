import { Router } from "express";
import  { z } from "zod"; 
import { parseId } from "../ids";
import { validateBody } from "../middleware";
import * as players from "../services/playerService";

const playerSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, "name is required")
      .max(50, "name must be 50 characters or fewer"),
});

export const playersRouter = Router();

playersRouter.get("/", (_req, res) => {
    res.json(players.list());
});

playersRouter.post("/", validateBody(playerSchema), (req, res) => {
    res.status(201).json(players.create(req.body.name));
});

playersRouter.get("/:id", (req, res) => {
    res.json(players.get(parseId(req.params.id)));
});

playersRouter.delete("/:id", (req, res) => {
    players.remove(parseId(req.params.id));
    res.status(204).end();
})
