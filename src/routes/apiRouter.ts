// import { Router } from "express";
// import {authRouter} from "./authRouter";
//
// export const apiRouter = Router()
// apiRouter.use("/auth" , authRouter)

import { Router } from "express";
import { authRouter } from "./authRouter";
import { createRouter } from "./createRouter";

// Import models to ensure they are registered with Mongoose
import "../models/customer";
import "../models/StaffUser";

export const apiRouter = Router();

// mount auth router
apiRouter.use("/auth", authRouter);
// mount create router
apiRouter.use("/create", createRouter);
