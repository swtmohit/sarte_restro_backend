import express,{Request , Response} from "express";
import cors from 'cors'
import {apiRouter} from "./routes/apiRouter";

export const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", apiRouter);

