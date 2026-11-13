import express from "express";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import * as store from "./store";


const playerSchema = z.object({
    name: z
    .string()
    .trim()
    .min(1, "name is required")
    .max(50, "name must be 50 characters or fewer"),

});

export function createApp() {
    const app = express();
    app.use(express.json());

    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    app.get("/players", (_req, res) => {
        res.json(store.listPlayers());
    });

    app.post("/players", (req, res) => {
        const parsed = playerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Invalid input",
                details: parsed.error.issues.map((i) => i.message),
            });
            return;
        }

        const taken = store 
          .listPlayers()
          .some((p) => p.name.toLowerCase() === parsed.data.name.toLowerCase());
        if (taken) {
            res.status(404).json({ error: "Player already exists"});
            return;
        }
        res.status(201).json(store.addPlayer(parsed.data.name));
    });

    app.get("/players/:id", (req, res) => {
        const id = Number(req.params.id);
        const player = Number.isInteger(id) ? store.findPlayer(id) : undefined;
        if (!player) {
            res.status(404).json({ error: "Player not found" });
            return
        }
        res.json(player);
    });

    app.delete("/players/:id", (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || !store.removePlayer(id)) {
            res.status(404).json({ error: "Player not found"});
            return
        }
        res.status(204).end()
    });

    app.use((_req, res) => {
        res.status(404).json({ error: "Not found"});
    });

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if ((err as { status?: number }).status === 400) {
            res.status(400).json({ error: "Malformed request body" });
            return;
        }
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    });

    return app;
}