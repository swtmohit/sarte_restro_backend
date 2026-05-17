import express,{Request , Response} from "express";
import cors from 'cors'
import {apiRouter} from "./routes/apiRouter";

export const app = express()

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "I love You Sweta ❤️❤️❤️I Miss You So Much My Sweetheart❤️❤️❤️",
    });
  });

app.use(cors())
app.use(express.json())

app.use("/api", apiRouter);

