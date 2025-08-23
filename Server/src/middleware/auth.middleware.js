import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get the JWT token from the cookies sent by the client
    const token = req.cookies.jwt;
    // If token does not exist, user is not logged in → return 401 Unauthorized
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }
    // Verify the token using the secret key
    // If decoding fails (token invalid or expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    // Find the user in the database using the userId from the toke
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Attach the user object to req.user so that the next middleware or route can use it
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};