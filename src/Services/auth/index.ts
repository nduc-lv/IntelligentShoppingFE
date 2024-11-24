import { API } from "../base";

export interface LoginResponse {
  message: string;
  user: User|null;
}

export interface User {
  id: string;
  email: string;
  link_avatar: string;
  name: string;
  username: string;
  password: string | null;
  is_active: boolean | null;
  is_confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

const userApi = API.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<LoginResponse, string>({
      query: () => `auth/login`,
    }),
  }),
  overrideExisting: true,
});

export const { useLazyGetUserQuery } = userApi;
