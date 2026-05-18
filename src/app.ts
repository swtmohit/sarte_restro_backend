import express,{Request , Response} from "express";
import cors from 'cors'
import {apiRouter} from "./routes/apiRouter";

export const app = express()

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Server is running properly.....✌️",
    });
  });

app.use(cors())
app.use(express.json())

app.use("/api", apiRouter);

