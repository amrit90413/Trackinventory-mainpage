import { useMemo, useState, useEffect, useCallback } from "react";
import { getStoredAuth, persistAuth, clearStoredAuth } from "../../common/storage";
import { AuthContext } from "./context";

const createInitialState = () => {
  const stored = getStoredAuth();
  return {
    token: stored?.token ?? null,
    user: stored?.user ?? null,
  };
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(createInitialState);

  const login = useCallback((nextToken, nextUser) => {
    if (!nextToken) {
      console.warn("AuthProvider.login called without a token");
      return;
    }

    setAuthState((prev) => ({
      token: nextToken,
      user: nextUser ?? prev.user,
    }));
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      token: null,
      user: null,
    });
    clearStoredAuth();
  }, []);

  const updateUser = useCallback((nextUser) => {
    setAuthState((prev) => ({
      ...prev,
      user: nextUser,
    }));
  }, []);

  useEffect(() => {
    if (authState.token) {
      persistAuth(authState);
    } else {
      clearStoredAuth();
    }
  }, [authState]);

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      isAuthenticated: Boolean(authState.token),
      login,
      logout,
      setUser: updateUser,
    }),
    [authState, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};