export interface LoginParams {
  googleAuthCode: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
  resellerId: string;
}

export interface ProfileResponse {
  data: {
    firstName: string;
    lastName: string;
    phone: string;
    dialingCode: string;
    email: string;
    id: number;
    pictureFileName: string | null;
    nationalCode: string | null;
    shebaNumber: string;
    cardNumber: string | null;
    accountNumber: string | null;
    resellerId: number;
    permissions: string[];
    roles: string[];
    createDate: string;
    hasPassword: boolean;
    dialingCountryIso: string;
    secretKey: string;
  };
}

export interface User {
  firstName: string;
  lastName: string;
  phone: string;
  dialingCode: string;
  email: string;
  id: number;
  pictureFileName: string | null;
  nationalCode: string | null;
  shebaNumber: string;
  cardNumber: string | null;
  accountNumber: string | null;
  resellerId: number;
  permissions: string[];
  roles: string[];
  createDate: string;
  hasPassword: boolean;
  dialingCountryIso: string;
  secretKey: string;
}
