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

const usergroupApi = API
  .enhanceEndpoints({ addTagTypes: ['UserGroup'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getAllUserGroup: build.query<UserGroup[], { per: number; page: number; groupId: string }>({
        query: ({ per, page, groupId }) => ({
          url: `usergroup/${groupId}`,
          method: "GET",
        }),
        transformResponse: (response: { rows: UserGroup[] }, meta, arg) => response.rows,
        providesTags: (result, error, { groupId }) =>
          result
            ? [
                ...result.map(({ group_id:id }) => ({ type: "UserGroup" as const, id })),
                { type: "UserGroup", id: groupId },
              ]
            : [{ type: "UserGroup", id: groupId }],
      }),
      createUserGroup: build.mutation<any, CreateUserGroupPayload>({
        query: (payload) => ({
          url: `usergroup`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "UserGroup", id: "LIST" }],
      }),
      updateUserGroup: build.mutation<any, UpdateUserGroupPayload>({
        query: ({ group_id, user_id, ...payload }) => ({
          url: `usergroup/${group_id}/${user_id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { group_id }) => [{ type: "UserGroup", id: group_id }],
      }),
      deleteUserGroup: build.mutation<any, { group_id: string; user_id: string }>({
        query: ({ group_id, user_id }) => ({
          url: `usergroup/${group_id}/${user_id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, { group_id }) => [{ type: "UserGroup", id: group_id }],
      }),
      leaveGroup: build.mutation<any, { group_id: string }>({
        query: ({ group_id }) => ({
          url: `usergroup/${group_id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, { group_id }) => [{ type: "UserGroup", id: group_id }],
      }),
    }),
    overrideExisting: true,
  });
export const {
    useLazyGetAllUserGroupQuery,
    useCreateUserGroupMutation,
    useUpdateUserGroupMutation,
    useDeleteUserGroupMutation,
    useLeaveGroupMutation
} = usergroupApi;