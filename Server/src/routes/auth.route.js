import express from "express";
import { checkAuth, login, logout, signup, updateProfile} from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";
const router = express.Router();

router.get('/', (req,res)=>{
    res.send("api/auth");
})
// For more precisely we make login, logout, signup  on another place.
router.post('/signup', signup); 
router.post('/login', login);
router.post('/logout', logout);

// protectRoute -> It is a middleware
// protectRoute -> check user is login or logout
// If login then move next function -> updateProfile
router.put('/update-profile', protectRoute, updateProfile);

// checkAuth is just a simple endpoint to confirm the user is logged in and return their info.
router.get('/check', protectRoute, checkAuth);

export default router;