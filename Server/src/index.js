import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
dotenv.config(); // used for env
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";

const app=express();
const PORT=process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes); // Handle login,logout,signup route
app.use("/api/mesages", messageRoutes);

app.listen(PORT, ()=>{
    console.log("Server is running on PORT: "+PORT);
    connectDB();
});