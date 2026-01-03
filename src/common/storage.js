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

export const clearStoredAuth = () => {
  if (!hasWindow()) return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export { AUTH_STORAGE_KEY };

