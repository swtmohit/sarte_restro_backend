import {Router} from "express";

export const createRouter = Router()

// Import controllers to register routes
import "../controllers/staffUser/staffUser";
import "../controllers/customer/createCustomer";