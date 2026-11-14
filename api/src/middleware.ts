import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { HttpError } from "./errors";

export function validateBody(schema: z.ZodType) {
    return (req: Request,_res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            throw new HttpError(
                400,
                "Invalid input",
                parsed.error.issues.map((i) => i.message)
            );
        }
        req.body = parsed.data;
        next();
    };
}