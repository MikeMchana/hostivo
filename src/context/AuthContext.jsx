import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("hostivo_token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("hostivo_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState(
    Boolean(token)
  );

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    async function validateToken() {
      try {
        const currentUser = await apiRequest(
          "/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          "Failed to validate authentication"
        );

        setUser({
          user_id: currentUser.user_id,
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
        });
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    validateToken();
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(
        "hostivo_token",
        token
      );
    } else {
      localStorage.removeItem("hostivo_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "hostivo_user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("hostivo_user");
    }
  }, [user]);

  function login(authData) {
    setIsAuthLoading(false);

    setToken(authData.access_token);

    setUser({
      user_id: authData.user_id,
      username: authData.username,
      email: authData.email,
      role: authData.role,
    });
  }

  function logout() {
    setToken(null);
    setUser(null);
    setIsAuthLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}