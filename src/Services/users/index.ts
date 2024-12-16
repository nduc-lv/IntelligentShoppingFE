import { User } from "@/Store/types";
import { API } from "../base";

export interface GenericResponse {
  message: string;
  [key:string]: any;
}

export interface LoginRequest {
  username?: string;
  email?:string;
  password: string;
}
export interface RegisterRequest {
  username: string;
  password: string;
  email:string,
  name:string,
  link_avatar: string,
}

export const userApi = API.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<User, string>({
      query: (id) => `user/${id}`,
    }),
    getMe: build.query<User, void>({
      query: () => `user/me`,
    }),
    login: build.mutation<GenericResponse, LoginRequest>({
      query: (credentials) => ({
        url: `auth/login`,
        method: "POST",
        body: credentials,
      }),
    }),
    register: build.mutation<GenericResponse, RegisterRequest>({
      query: (credentials) => ({
        url: `auth/register`,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useLazyGetUserQuery,useLazyGetMeQuery,useRegisterMutation,useLoginMutation } = userApi;
