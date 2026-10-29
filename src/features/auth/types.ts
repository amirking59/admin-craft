export interface LoginParams {
  username: string;
  password: string;
}

/** POST /auth/login's answer: the session's tokens (and who logged in, unused: the profile has it). */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

/** GET /auth/me: the logged-in user, the fields the app uses. */
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  /** The picture's URL. */
  image: string;
  role: string;
}
