import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
dotenv.config(); // used for env
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app,server } from "./lib/socket.js";


import path from "path"
const __dirname =path.resolve();
const PORT=process.env.PORT;

app.use(express.json());
app.use(cookieParser());



// you’re telling your backend to handle requests coming from a different origin (frontend side).
app.use(
  cors({
    origin: "http://localhost:5173",  // Allow only this frontend
  credentials: true,                // Allow cookies, tokens, sessions
  })
);

app.use("/api/auth", authRoutes); // Handle login,logout,signup route
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Client", "dist", "index.html"));
  });
}

server.listen(PORT, ()=>{
    console.log("Server is running on PORT: "+PORT);
    connectDB();
});