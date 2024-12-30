import { User } from "@/Store/types";
import { API } from "../base";

export interface GenericResponse {
  message: string;
  [key: string]: any;
  user: any;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}
export interface RegisterRequest {
  username: string;
  password: string;
  email: string,
  name: string,
  link_avatar: string,
}
export interface PasswordChangeRequest{
  old_password:string;
  new_password:string;
}
export const userApi = API
  .enhanceEndpoints({ addTagTypes: ['User'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getUser: build.query<User, string>({
        query: (id) => `user/${id}`,
        providesTags: (result, error, id) => [{ type: 'User', id }],
      }),
      getMe: build.query<User, void>({
        query: () => `user/me`,
        // providesTags: (result, error) => [{ type: 'User', id: 'me' }],
      }),
      getUserByEmail: build.query<any, string>({
        query: (id) => `user/email/${id}`,
        providesTags: (result, error, id) => [{ type: 'User', id }],
      }),
      getUserByUsername: build.query<any, string>({
        query: (id) => `user/username/${id}`,
        providesTags: (result, error, id) => [{ type: 'User', id }],
      }),
      login: build.mutation<GenericResponse, LoginRequest>({
        query: (credentials) => ({
          url: `auth/login`,
          method: "POST",
          body: credentials,
        }),
        invalidatesTags: (result, error) => [{ type: 'User', id: 'me' }],
      }),
      loginWithoutCache: build.mutation<GenericResponse, LoginRequest>({
        query: (credentials) => ({
          url: `auth/login_without_cache`,
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
        invalidatesTags: (result, error) => [{ type: 'User', id: 'me' }],
      }),
      updateUser: build.mutation<User, Partial<Omit<User, "is_active" | "is_confirmed" | "updated_at" | "created_at">> & { id: string }>({
        query: ({ id, ...data }) => ({
          url: `user/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'User', id: id }],
      }),
      updateMe: build.mutation<User, Partial<Omit<User, "is_active" | "is_confirmed" | "updated_at" | "created_at">>>({
        query: (data) => ({
          url: `user/me`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error) => [{ type: 'User', id: 'me' }],
      }),
      updatePassword: build.mutation<GenericResponse, PasswordChangeRequest>({
        query: (data) => ({
          url: `user/me`,
          method: "PATCH",
          body: data,
        }),
      })
    }),
    overrideExisting: true,
  });
export const { useGetMeQuery,useUpdatePasswordMutation, useLazyGetUserQuery, useLazyGetUserByEmailQuery, useLazyGetUserByUsernameQuery, useRegisterMutation, useLoginMutation,useLoginWithoutCacheMutation, useUpdateUserMutation, useUpdateMeMutation,  } = userApi;
