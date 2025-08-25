import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    // Get the ID of the logged-in user
    const loggedInUserId = req.user._id;
    // Find all users in the database except the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    // Send the list of users back as JSON
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // extract user you want to chat with
    const myId = req.user._id; // current logged-in user’s ID

    // Message.find({...}) → It checks both directions:
    // ✅ So you get the entire conversation history between the two users.
    const messages = await Message.find({ 
      $or: [ // // find messages where either
        { senderId: myId, receiverId: userToChatId }, // I sent msg to him
        { senderId: userToChatId, receiverId: myId }, // OR he sent msg to me
      ],
    });

    res.status(200).json(messages); // send all those messages to frontend
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;         // user sends message text and optional image
    const { id: receiverId } = req.params;    // receiver's ID comes from route params (like /messages/:id)
    const senderId = req.user._id;            // sender ID comes from logged-in user (req.user set by auth middleware)
    
    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // Cloudinary gives a secure hosted URL
    }

    // create new message document
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save(); // save message in MongoDB

    res.status(201).json(newMessage); // return saved message as response
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};   