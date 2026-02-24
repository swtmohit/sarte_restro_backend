import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    phoneNumber?: string;
    profilePic?: string;
    status: "active" | "inactive" | "pending" | "banned";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String },
        profilePic: { type: String },
        status: {
            type: String,
            enum: ["active", "inactive", "pending", "banned"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
