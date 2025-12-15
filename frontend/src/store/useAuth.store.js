import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningup: false,
  isLoggingin: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/login");
      set({ authUser: res.data });
    } catch (error) {
      console.log(`Error in auth check ${error}`);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningup: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
    } catch (error) {
      const backend = error.response?.data;

      if (backend?.errors && backend.errors.length > 0) {
        // Show the first validation error
        const firstError = Object.values(backend.errors[0])[0];
        toast.error(firstError);
      } else {
        toast.error(backend?.message || "Something went wrong");
      }
    } finally {
      set({ isSigningup: false });
    }
  },

  login: async (data) => {
    set({ isLoggingin: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully!");
    } catch (error) {
      const backend = error.response?.data;

      if (backend?.errors && backend.errors.length > 0) {
        // Show the first validation error
        const firstError = Object.values(backend.errors[0])[0];
        toast.error(firstError);
      } else {
        toast.error(backend?.message || "Something went wrong");
      }
    } finally {
      set({ isLoggingin: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logged out successfully!");
    } catch (error) {
      const backend = error.response?.data;

      if (backend?.errors && backend.errors.length > 0) {
        // Show the first validation error
        const firstError = Object.values(backend.errors[0])[0];
        toast.error(firstError);
      } else {
        toast.error(backend?.message || "Something went wrong");
      }
    }
  },
}));
