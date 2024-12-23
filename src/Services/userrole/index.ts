import { API } from "../base";

export interface UserRoleResponse {
    id: string;
    email: string;
    link_avatar: string;
    name: string;
    username: string;
    is_active: boolean;
    user_role: any;
    created_at: Date;
};

const userroleApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllUserrole: build.query<UserRoleResponse[], void>({
            query: () => ({
                url: `userrole/user`,
                method: "GET",
            }),
            transformResponse: (response: { rows: UserRoleResponse[] }, meta, arg) => response.rows,
        }),
        banUser: build.mutation<any, {id: string}>({
            query: ({id}) => ({
                url: `user/ban/${id}`,
                method: "PUT",
            })
        }),
        unbanUser: build.mutation<any, {id: string}>({
            query: ({id}) => ({
                url: `user/unban/${id}`,
                method: "PUT",
            })
        }),
        deleteUser: build.mutation<any, {id: string}>({
            query: ({id}) => ({
                url: `user/${id}`,
                method: "DELETE",
            })
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllUserroleQuery, useBanUserMutation, useUnbanUserMutation, useDeleteUserMutation
} = userroleApi;