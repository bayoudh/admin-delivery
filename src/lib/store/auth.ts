import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import Cookies from "js-cookie";

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
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create a separate interface for persisted data
interface PersistedAuthState {
  user: User | null;
  token: string | null;
}

// Cookie storage adapter for Zustand
const cookieStorage = {
  getItem: (name: string): StorageValue<PersistedAuthState> | null => {
    const value = Cookies.get(name);
    if (!value) return null;

    try {
      return JSON.parse(value) as StorageValue<PersistedAuthState>;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<PersistedAuthState>): void => {
    Cookies.set(name, JSON.stringify(value), {
      expires: 7, // 7 days
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(`/api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: "Login failed" }));
            throw new Error(errorData.message || "Login failed");
          }

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
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
          throw error;
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: cookieStorage, // ✅ use cookies instead of sessionStorage
      partialize: (state): PersistedAuthState => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
