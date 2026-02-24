// import {Router} from "express";
// import {apiRouter} from "./apiRouter";
// import { app } from "../app"
//
//  const authRouter = Router();
// apiRouter.use("/auth",authRouter);
// app.use("/api" , apiRouter);
//
// export default authRouter;

import { Router } from "express";

export const authRouter = Router();

// Import controllers to register routes
import "../controllers/auth/login";
import "../controllers/auth/customerLogin";
import "../controllers/auth/logout";
