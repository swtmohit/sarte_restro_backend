import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    deliveryAddress: string;
    pinCode: string;
    email: string;
    password: string;
    status: "active" | "inactive" | "pending" | "banned";
    createdAt: Date;
    updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        phoneNumber: { type: String, required: true },
        deliveryAddress: { type: String, required: true },
        pinCode: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        status: {
            type: String,
            enum: ["active", "inactive", "pending", "banned"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
