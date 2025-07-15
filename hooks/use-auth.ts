"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Vérifier le cookie utilisateur côté client
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-user="))
          ?.split("=")[1];

        if (userCookie) {
          const user = JSON.parse(decodeURIComponent(userCookie));
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}
