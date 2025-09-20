import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/* // Create a typed sessionStorage adapter
const sessionStorageAdapter = {
  getItem: (name: string): StorageValue<AuthState> | null => {
    const str = sessionStorage.getItem(name);
    if (!str) return null;
    return JSON.parse(str) as StorageValue<AuthState>;
  },
  setItem: (name: string, value: StorageValue<AuthState>): void => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string): void => {
    sessionStorage.removeItem(name);
  },
};
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const res = await fetch(`/api/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();

        set({
          user: {
            id: data.user.id,
            firstname: data.user.firstname,
            lastname: data.user.lastname,
            email: data.user.email,
            role: data.user.role,
          },
          token: data.token,
        });
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      /* storage: sessionStorageAdapter, */
    }
  )
);
