import { API } from "../base";

export interface UserRoleResponse {
  id: string;
  role: string;
  username: string;
  isBanned: boolean;
}

const userRoleApi = API
.enhanceEndpoints({ addTagTypes: ['UserRole'] })
.injectEndpoints({
  endpoints: (build) => ({
    getAllUserrole: build.query<UserRoleResponse[], void>({
      query: () => ({
        url: `userrole/user`,
        method: "GET",
      }),
      transformResponse: (response: { rows: UserRoleResponse[] }, meta, arg) => response.rows,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "UserRole", id })) as unknown as any,
              { type: "UserRole", id: "LIST" },
            ]
          : [{ type: "UserRole", id: "LIST" }],
    }),
    banUser: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `user/ban/${id}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "UserRole", id: "LIST" }],
    }),
    unbanUser: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `user/unban/${id}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "UserRole", id: "LIST" }],
    }),
    deleteUser: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "UserRole", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllUserroleQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useDeleteUserMutation,
  useLazyGetAllUserroleQuery
} = userRoleApi;
