// lib/store/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  firstname:string;
  lastname:string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

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
        console.log(data)
        // Adjust based on your API response
        set({
          user: {
            id: data.user.id,
            firstname:data.user.firstname,
            lastname:data.user.lastname,
            email: data.user.email,
            role: data.user.role,
          },
          token: data.token,
        });
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
    }
  )
);
