import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled); //first update the local storage
    set({ isSoundEnabled: !get().isSoundEnabled }); //then update the state
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/message/contacts");

      set({ allContacts: res.data.data.filteredUsers });
    } catch (error) {
      const backend = error.response?.data;

      if (backend?.errors && backend.errors.length > 0) {
        const firstError = Object.values(backend.errors[0])[0];
        toast.error(firstError);
      } else {
        toast.error(backend?.message || "Something went wrong");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatParteners: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/message/chats");

      set({ chats: res.data.data.chatPartners });
    } catch (error) {
      const backend = error.response?.data;

      if (backend?.errors && backend.errors.length > 0) {
        const firstError = Object.values(backend.errors[0])[0];
        toast.error(firstError);
      } else {
        toast.error(backend?.message || "Something went wrong");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get("message/get-messages");
      console.log(res.data);

      // set({messages: res.data});
    } catch (error) {
      const backend = error.response?.data;

      if (backend?.errors && backend.errors.length > 0) {
        const firstError = Object.values(backend.errors[0])[0];
        toast.error(firstError);
      } else {
        toast.error(backend?.message || "Something went wrong");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));
