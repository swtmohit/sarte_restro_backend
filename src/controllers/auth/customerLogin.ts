import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { Customer } from "../../models/customer";
import { authRouter } from "../../routes/authRouter";
import { JWT_SECRET } from "../../constant";
import { validate } from "../../helpers";
import { success, error } from "../../helpers/response";

const handler: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find customer by email
        const customer = await Customer.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!customer) {
            res.status(401).json(error("Invalid email or password"));
            return next();
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            res.status(401).json(error("Invalid email or password"));
            return next();
        }

        // Optional: only allow active customers
        if (customer.status !== "active") {
            res
                .status(403)
                .json(error("Your account is not active. Please contact support."));
            return next();
        }

        // Generate JWT token
        const token = jwt.sign(
            { customerId: customer._id, email: customer.email },
            JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        // Build safe response object
        const customerResponse = {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            username: customer.username,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            deliveryAddress: customer.deliveryAddress,
            pinCode: customer.pinCode,
            status: customer.status,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        };

        res.json(
            success("Customer login successful", {
                customer: customerResponse,
                token,
            })
        );
        return next();
    } catch (err) {
        console.error("Customer login error:", err);
        res.status(500).json(error("Internal server error"));
        return next(err);
    }
};

// Validation rules for customer login
const customerLoginValidation = validate([
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
]);

// Route: POST /api/auth/customer-login
authRouter.post("/customer-login", customerLoginValidation, handler);

