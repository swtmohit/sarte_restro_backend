import { RequestHandler } from "express";
import { authRouter } from "../../routes/authRouter";
import { success } from "../../helpers/response";

// Simple logout handler for JWT-based auth.
// The client is responsible for deleting the token;
// here we just respond with a success message and
// optionally clear any auth cookie if you decide to use one later.
const handler: RequestHandler = async (req, res, next) => {
    try {
        // If you ever store JWT in a cookie, clear it here:
        // res.clearCookie("token", { httpOnly: true, sameSite: "lax" });

        res.json(success("Logout successful", null));
        return next();
    } catch (err) {
        return next(err);
    }
};

// Route: POST /api/auth/logout
authRouter.post("/logout", handler);

