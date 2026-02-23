const AUTH_STORAGE_KEY = "smart-zone.auth";

const hasWindow = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const getStoredAuth = () => {
  if (!hasWindow()) return null;
  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.warn("Failed to parse auth storage", error);
    return null;
  }
};

export const persistAuth = (value) => {
  if (!hasWindow()) return;
  if (!value) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
};

export const getStoredToken = () => {
  const stored = getStoredAuth();
  return stored?.token ?? null;
};

/** Parse JWT payload (no verification, for reading claims like sub/userId) */
export const parseJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const clearStoredAuth = () => {
  if (!hasWindow()) return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export { AUTH_STORAGE_KEY };

