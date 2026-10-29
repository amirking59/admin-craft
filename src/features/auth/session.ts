import { storage } from "@/lib/storage";

// The session's tokens, kept in this browser. Its own module, so the API client can use them without importing
// the auth services (which use the API client).
const accessTokenKey = "accessToken";
const refreshTokenKey = "refreshToken";

export const getAccessToken = () => storage.get(accessTokenKey);
export const getRefreshToken = () => storage.get(refreshTokenKey);

export const setTokens = ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
  storage.set(accessTokenKey, accessToken);
  storage.set(refreshTokenKey, refreshToken);
};

let onLogout = () => {};

/** src/router.tsx sets this: clear the old session's cached data and go to the login page. */
export const setLogoutHandler = (handler: () => void) => {
  onLogout = handler;
};

export const logout = () => {
  storage.remove(accessTokenKey);
  storage.remove(refreshTokenKey);
  onLogout();
};
