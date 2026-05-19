import mongoose from "mongoose";

export const connectionDB = async (): Promise<void> => {
    const URI = process.env.MONGODB_URI;

    if (!URI) {
        throw new Error("MONGODB_URI not found in .env file");
    }

    try {
        await mongoose.connect(URI);

        console.log("✅ MongoDB Database Connected");
    } catch (err) {
        console.error("Database Connection Failed:", err);

        process.exit(1);
    }
};