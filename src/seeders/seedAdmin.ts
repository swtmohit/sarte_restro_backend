import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/StaffUser";

dotenv.config();
const adminUser = {
    name: "Mohit Singh",
    username: "swtmohit",
    email: "msDeveloper3106@gmail.com",
    password: "adminPlanner",
    phoneNumber: "9995558781",
    profilePic: "../admin/img/admin.jpg",
    status: "active",
};

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB Connected");
        await User.deleteMany({});
        console.log("Old users removed");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminUser.password, salt);
        const user = await User.create({ ...adminUser, password: hashedPassword });
        console.log("Admin user created:", user);
        process.exit();
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
};

seedAdmin();
