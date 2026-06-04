import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { normalizeUser, type ApiUser, type FrontendRole } from "@/lib/api/roles";
import { toast } from "sonner";

export interface User {
  id: string;
  nom: string;
  role: FrontendRole;
  langue: "fr" | "en";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const userData = await apiClient.get<ApiUser>("/auth/me", { skipErrorToast: true });
        if (userData && userData.id) {
          setUser(normalizeUser(userData));
        }
      } catch (error) {
        // Ignored, session not active
        console.log("No active session restored:", error);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Listen to refresh token failure events
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      toast.error("Votre session a expiré. Veuillez vous reconnecter.");
    };
    window.addEventListener("unauthorized-api-call", handleUnauthorized);
    return () => window.removeEventListener("unauthorized-api-call", handleUnauthorized);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // Trying JSON login
      const userData = await apiClient.post<ApiUser>("/auth/login", { email, password });
      setUser(normalizeUser(userData));
      toast.success(`Bienvenue, ${userData.nom} !`);
      return normalizeUser(userData);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout", {}, { skipErrorToast: true });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      toast.success("Vous avez été déconnecté.");
    }
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
