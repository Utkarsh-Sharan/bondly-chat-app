import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuth.store.js";

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
      const res = await axiosInstance.get(`message/get-messages/${userId}`);

      set({ messages: res.data.data.messages });
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

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser.data.user._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });  //immediately add sender's message to the chat container.

    try {
      const res = await axiosInstance.post(
        `message/send-message/${selectedUser._id}`,
        messageData
      );

      set({ messages: messages.concat(res.data.data.newMessage) });
    } catch (error) {
      set({messages: messages});  //set to previous state if optimistic message fails

      const backend = error.response?.data;

      if (backend?.errors && backend.errors.length > 0) {
        const firstError = Object.values(backend.errors[0])[0];
        toast.error(firstError);
      } else {
        toast.error(backend?.message || "Something went wrong");
      }
    }
  },
}));
