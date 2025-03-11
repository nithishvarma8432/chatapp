// store/useStore.js
import {create} from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useStore;
