"use client";

import {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode
} from "react";
import { getSession, clearSession, User } from "@/lib/auth";

type SessionUser = Omit<User, "password">;

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  logout: () => {},
  refreshSession: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(() => {
    const session = getSession();
    setUser(session);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin: user?.role === "admin",
      logout,
      refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);