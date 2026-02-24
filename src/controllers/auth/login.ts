import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { User } from "../../models/panelUser";
import { authRouter } from "../../routes/authRouter";
import { JWT_SECRET } from "../../constant";
import { validate } from "../../helpers";
import { success } from "../../helpers/response";

const handler: RequestHandler = async function (req, res, next) {
    try {
        const { username, password } = req.body;
        const isEmail = username.includes("@");
        const user = await User.findOne({
            [isEmail ? "email" : "username"]: username,
        });
        if (!user) {
            res.status(401).json({ message: "Invalid username or password" });
            return next();
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid username or password" });
            return next();
        }
        if (user.status !== "active") {
            res.status(401).json({ message: "Your account is not active." });
            return next();
        }
        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            JWT_SECRET as string,
            { expiresIn: "7d" }
        );
        res.json(
            success("Login Successful", {
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    profilePic: user.profilePic,
                },
                token,
            })
        );
        return next();
    } catch (err) {
        return next(err);
    }
};
authRouter.post(
    "/login",
    validate([
        body("username").notEmpty().withMessage("Username is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ]),
    handler
);

