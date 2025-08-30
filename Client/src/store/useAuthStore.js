import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    // checkAuth() asks backend: “Hey, is this user already logged in?”
    // If yes → saves user info in store (authUser).
    // If no → clears authUser.
    // In Backend -> router.get('/check', protectRoute, checkAuth);
    checkAuth: async() => {   
        try {
            // baseURL: "http://localhost:5001/api" this mention in the "axiosInstance"
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data }); // get data from backend
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
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },


}))