import { API } from "../base";

export interface UserGroup {
    group_id: string;
    user_id: string;
    is_admin: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
        username: string;
        name: string;
    };
}

export interface CreateUserGroupPayload {
    group_id: string;
    user_id: string;
    is_admin: boolean;
}

export interface UpdateUserGroupPayload {
    group_id: string;
    user_id: string;
    is_admin: number;
}

const usergroupApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllUserGroup: build.query<UserGroup[], { per: number; page: number; groupId: string }>({
            query: ({ per, page, groupId }) => ({
                url: `usergroup/${groupId}`,
                method: "GET",
            }),
            transformResponse: (response: { rows: UserGroup[] }, meta, arg) => response.rows,
        }),
        createUserGroup: build.mutation<any, CreateUserGroupPayload>({
            query: (payload) => ({
                url: `usergroup`,
                method: "POST",
                body: payload,
            })
        }),
        updateUserGroup: build.mutation<any, UpdateUserGroupPayload>({
            query: ({group_id, user_id, ...payload}) => ({
                url: `usergroup/${group_id}/${user_id}`,
                method: "PUT",
                body: payload,
            })
        }),
        deleteUserGroup: build.mutation<any, {group_id: string, user_id: string}>({
            query: ({group_id, user_id}) => ({
                url: `usergroup/${group_id}/${user_id}`,
                method: "DELETE",
            })
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllUserGroupQuery,
    useCreateUserGroupMutation,
    useUpdateUserGroupMutation,
    useDeleteUserGroupMutation
} = usergroupApi;