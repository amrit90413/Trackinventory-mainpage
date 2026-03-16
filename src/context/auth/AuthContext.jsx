import { useMemo, useState, useEffect, useCallback } from "react";
import { getStoredAuth, persistAuth, clearStoredAuth } from "../../common/storage";
import api from "../../composables/instance";
import { AuthContext } from "./context";

const createInitialState = () => {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");

  const stored = getStoredAuth();
  
  if (urlToken && (!stored || stored.token !== urlToken)) {
    const newState = { token: urlToken, user: null };
    persistAuth(newState);
    return newState;
  }

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
    if (!authState.token) return;

    let isActive = true;

    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get("/User/GetUserDetails");
        let resolvedUser = data?.data ?? data?.result ?? data;

        if (Array.isArray(resolvedUser)) {
          resolvedUser = resolvedUser[0];
        }

        if (isActive && resolvedUser) {
          setAuthState((prev) => ({
            ...prev,
            user: resolvedUser,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
        if (error?.response?.status === 401) {
          logout();
        }
      }
    };

    fetchUserDetails();

    return () => {
      isActive = false;
    };
  }, [authState.token, logout]);

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