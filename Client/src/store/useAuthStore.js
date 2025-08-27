import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

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
    }


}))