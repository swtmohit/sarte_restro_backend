import mongoose from "mongoose";

export const connectionDB = async ():Promise<void> => {
    const URI = process.env.MONGODB_URI;
    const PORT = process.env.PORT;
    if (!URI) throw new Error("MONGODB_URI not found in .env file");

    try {
      await mongoose.connect(URI);
        console.log(`MongoDB Database Connected ${PORT} `)
    } catch (err) {
        console.error("Database Connection Field:", err)
    }
}