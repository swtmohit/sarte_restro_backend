import { RequestHandler } from "express";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import { Customer } from "../../models/customer";
import { createRouter } from "../../routes/createRouter";
import { validate } from "../../helpers/validate";
import { success } from "../../helpers/response";

const handler: RequestHandler = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            username,
            phoneNumber,
            deliveryAddress,
            pinCode,
            email,
            password,
        } = req.body;

        // Check if customer with email or username already exists
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { username }],
        });

        if (existingCustomer) {
            if (existingCustomer.email === email) {
                res.status(400).json({
                    type: "error",
                    message: "Email already registered",
                });
                return next();
            }
            if (existingCustomer.username === username) {
                res.status(400).json({
                    type: "error",
                    message: "Username already taken",
                });
                return next();
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create customer (status defaults to "pending" from schema)
        const customer = await Customer.create({
            firstName,
            lastName,
            username,
            phoneNumber,
            deliveryAddress,
            pinCode,
            email,
            password: hashedPassword,
        });

        // Return customer data without password
        const customerResponse = {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            username: customer.username,
            phoneNumber: customer.phoneNumber,
            deliveryAddress: customer.deliveryAddress,
            pinCode: customer.pinCode,
            email: customer.email,
            status: customer.status,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        };

        res.json(success("Customer registered successfully", customerResponse));
        return next();
    } catch (err: any) {
        console.error("Error creating customer:", err);
        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map((e: any) => e.message);
            res.status(400).json({
                type: "error",
                message: "Validation error",
                errors: errors,
            });
            return next();
        }
        // Handle duplicate key errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            res.status(400).json({
                type: "error",
                message: `${field} already exists`,
            });
            return next();
        }
        // Handle other errors
        res.status(500).json({
            type: "error",
            message: err.message || "Internal server error",
        });
        return next();
    }
};

// Validation rules
const customerValidation = validate([
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters"),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2 })
        .withMessage("Last name must be at least 2 characters"),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),
    body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage("Invalid phone number format"),
    body("deliveryAddress")
        .trim()
        .notEmpty()
        .withMessage("Delivery address is required")
        .isLength({ min: 10 })
        .withMessage("Delivery address must be at least 10 characters"),
    body("pinCode")
        .trim()
        .notEmpty()
        .withMessage("Pin code is required")
        .matches(/^[0-9]{4,6}$/)
        .withMessage("Pin code must be 4-6 digits"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
]);

// Register route
createRouter.post("/customer", customerValidation, handler);
