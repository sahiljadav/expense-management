import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserRole } from "@/types";
import { authService } from "@/services/authService";
import { toast } from "sonner";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      const authUser: AuthUser = {
        id: data.user.id.toString(),
        name: data.user.name,
        email: data.user.email,
        role: data.user.role as UserRole
      };
      setUser(authUser);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(authUser));
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
