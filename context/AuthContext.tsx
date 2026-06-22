"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../lib/api";
import { User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("arthub_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("arthub_token"))
      .finally(() => setLoading(false));
  }, []);

  function login(token: string, userData: User) {
    localStorage.setItem("arthub_token", token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("arthub_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
