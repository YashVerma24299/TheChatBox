import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    onlineUsers: [],

    socket:null,

    // checkAuth() asks backend: “Hey, is this user already logged in?”
    // If yes → saves user info in store (authUser).
    // If no → clears authUser.
    // In Backend -> router.get('/check', protectRoute, checkAuth);
    checkAuth: async() => {   
        try {
            // baseURL: "http://localhost:5001/api" this mention in the "axiosInstance"
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data }); // get data from backend
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
      set({ isSigningUp: true });
      try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created successfully");
          get().connectSocket();
      } catch (error) {
          toast.error(error.response.data.message);
      } finally {
          set({ isSigningUp: false });
      }
    },

    // Login: Sends credentials → gets JWT + user data → saves user in store → shows toast → unlocks app.
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            // Sends a POST request to your backend (/api/auth/login) and data contains { email, password }.
            const res = await axiosInstance.post("/auth/login", data);
            // Backend verifies credentials:
                // If correct → generates JWT token + sends back user object.
                // If incorrect → sends error message.
            set({ authUser: res.data });// Saves the logged-in user’s data and Now any component that uses authUser knows the user is logged in.
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            // shows the exact backend message.
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    }, 

    // Logout: Sends logout request → clears cookie in backend → removes user from store → shows toast → app redirects to login.
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            // Backend clears the JWT cookie (res.cookie("jwt", "", { maxAge: 0 })).
            // This removes the session → user is no longer authenticated.
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            // Makes a PUT request to your backend endpoint /auth/update-profile.
            // data contains the updated fields the user wants to change  (only profile picture ka data)
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: ()=> {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: ()=> {
        if (get().socket?.connected) get().socket.disconnect();
    }
}))