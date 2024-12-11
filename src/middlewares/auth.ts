import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
};

export function AuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "token nao fornecido" });
    }

    const [, token] = authorization.split(" ");

    try {
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            throw new Error("JWT_SECRET não está definido");
        }

        const decoded = jwt.verify(token, secret);
        const { id } = decoded as TokenPayload;

        req.userId = id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "token invalido" });
    }
}
