import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningup: false,
  isLoggingin: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/get-current-user");
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
      get().connectSocket();
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
      get().disconnectSocket();
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

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });

      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      const backend = error.response?.data;

      if (backend?.errors && backend.errors.length > 0) {
        const firstError = Object.values(backend.errors[0])[0];
        toast.error(firstError);
      } else {
        toast.error(backend?.message || "Something went wrong");
      }
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
