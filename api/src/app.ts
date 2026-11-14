import express from "express";
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./errors";
import { playersRouter } from "./routes/players";
import { scoresRouter } from "./routes/scores";
import { error } from "node:console";

export function createApp() {
    const app = express();
    app.use(express.json());

    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    app.use("/players", playersRouter);
    app.use("/scores", scoresRouter);

    app.use((_req, res) => {
        res.status(404).json({error: "Not found"});
    });

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof HttpError) {
            res
            .status(err.status)
            .json(
                err.details
                ? { error: err.message, details: err.details }
                : { error: err.message }
            );
            return;
        }
        if ((err as { status?: number }).status === 400) {
            res.status(400).json({error: "Malformed request body" });
            return
        }
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    });

    return app;
}