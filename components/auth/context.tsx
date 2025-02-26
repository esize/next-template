"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

import { getSession, invalidateSession } from "@/lib/auth/session";
import { SessionUser } from "@/types/auth";

type AuthContextType = {
  user: SessionUser | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const currentUrl = usePathname();
  const router = useRouter();

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const userData = await getSession();
      setUser(userData?.user);
      const returnTo = encodeURIComponent(currentUrl);
      if (!userData?.user) {
        router.push(`/login?returnTo=${returnTo}`);
      }
    } catch (error) {
      console.error(error);
      setUser(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await invalidateSession();
    setUser(undefined);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
