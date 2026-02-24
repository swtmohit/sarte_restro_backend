import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayloadCustom {
    userId: string;
    role?: string;
}

// Token generate karne ka helper
export const signToken = (payload: JwtPayloadCustom) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // 1 ghante ke liye valid
};

// Middleware: Token check karega
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadCustom;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
