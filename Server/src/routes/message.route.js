import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// It gives you all users except the one who is logged in (LEFT SIDE)
router.get("/users", protectRoute, getUsersForSidebar);
// basically this gives the chat history between two users.
router.get("/:id", protectRoute, getMessages);
// This is a backend logic for sending chat messages with optional image upload support.
router.post("/send/:id", protectRoute, sendMessage);

export default router;