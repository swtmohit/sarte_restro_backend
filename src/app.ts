import express,{Request , Response} from "express";
import cors from 'cors'
import {authRouter} from "./routes/authRouter";

export const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", authRouter);

