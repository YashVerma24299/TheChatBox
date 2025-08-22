import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
const router = express.Router();

router.get('/', (req,res)=>{
    res.send("api/auth");
})
// For more precisely we make login, logout, signup  on another place.
router.post('/signup', signup); 
router.post('/login', login);
router.post('/logout', logout);

export default router;