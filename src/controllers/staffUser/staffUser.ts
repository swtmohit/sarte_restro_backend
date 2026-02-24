import { RequestHandler } from "express";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "../../models/StaffUser";
import { createRouter } from "../../routes/createRouter";
import { validate } from "../../helpers/validate";
import { success } from "../../helpers/response";

const handler: RequestHandler = async (req, res, next) => {
    try {
        const { name, email, password, phoneNumber, status } = req.body;

        // ✅ hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            status: status || "pending",
        });

        res.json(success("User created successfully", user));
        return next();
    } catch (err) {
        return next(err);
    }
};

// ✅ Validation rules
const userValidation = validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
]);

// ✅ Route (simple & clean)
createRouter.post(
    "/user",
    userValidation,
    handler
);
