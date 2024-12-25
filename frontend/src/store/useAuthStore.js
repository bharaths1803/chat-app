import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningIn: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.post("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log(`Error in checkAuth ${error}`);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
