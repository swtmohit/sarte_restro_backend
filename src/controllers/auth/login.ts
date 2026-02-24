import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { User } from "../../models/StaffUser";
import { Customer } from "../../models/customer";
import { authRouter } from "../../routes/authRouter";
import { JWT_SECRET } from "../../constant";
import { validate } from "../../helpers";
import { success, error } from "../../helpers/response";

const handler: RequestHandler = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        // Try to find a staff user first
        let account: any = await User.findOne({ email: normalizedEmail });
        let role: "staff" | "customer" | null = null;

        if (account) {
            role = "staff";
        } else {
            // If not found in staff users, try customers
            account = await Customer.findOne({ email: normalizedEmail });
            if (account) {
                role = "customer";
            }
        }

        if (!account || !role) {
            res.status(401).json(error("Invalid email or password", []));
            return next();
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            res.status(401).json(error("Invalid email or password", []));
            return next();
        }

        // Check account status (only active accounts can log in)
        if (account.status !== "active") {
            res
                .status(403)
                .json(
                    error(
                        "Your account is not active. Please contact administrator.",
                        []
                    )
                );
            return next();
        }

        // Build unified user object
        const unifiedUser =
            role === "staff"
                ? {
                      id: account._id,
                      name: account.name,
                      username: account.username,
                      email: account.email,
                      phoneNumber: account.phoneNumber,
                      profilePic: account.profilePic,
                      status: account.status,
                      role,
                  }
                : {
                      id: account._id,
                      name: `${account.firstName} ${account.lastName}`.trim(),
                      username: account.username,
                      email: account.email,
                      phoneNumber: account.phoneNumber,
                      deliveryAddress: account.deliveryAddress,
                      pinCode: account.pinCode,
                      status: account.status,
                      role,
                  };

        // Generate JWT token
        const token = jwt.sign(
            { id: account._id, email: account.email, role },
            JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        // Return success response
        res.json(
            success("Login Successful", {
                user: unifiedUser,
                token,
            })
        );
        return next();
    } catch (err: any) {
        console.error("Login error:", err);
        res.status(500).json(
            error("Internal server error", [])
        );
        return next();
    }
};

authRouter.post(
    "/login",
    validate([
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address")
            .normalizeEmail(),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 1 })
            .withMessage("Password cannot be empty"),
    ]),
    handler
);

