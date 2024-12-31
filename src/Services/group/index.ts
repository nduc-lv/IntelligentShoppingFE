import { API } from "../base";

export interface Group {
    group_id: string;
    name: string;
    is_admin: boolean;
    link_avatar: string;
}

export interface CreateGroupPayload {
    name: string;
    imageUrl?: string;
}

export interface UpdateGroupPayload {
    id: string;
    name?: string;
    imageUrl?: string;
}

const groupApi = API.enhanceEndpoints({addTagTypes:["Group"]}).injectEndpoints({
    endpoints: (build) => ({
      getAllGroup: build.query<Group[], void>({
        query: () => ({
          url: `group/`,
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ group_id:id }) => ({ type: "Group" as const, id })),
                { type: "Group", id: "LIST" },
              ]
            : [{ type: "Group", id: "LIST" }],
      }),
      getGroupInfo: build.query<any, { groupId: string }>({
        query: ({ groupId }) => ({
          url: `group/${groupId}`,
          method: "GET",
        }),
      }),
      createGroup: build.mutation<any, CreateGroupPayload>({
        query: (payload) => ({
          url: `group`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Group", id: "LIST" }],
      }),
      updateGroup: build.mutation<any, UpdateGroupPayload>({
        query: ({ id, ...payload }) => ({
          url: `group/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Group", id },
          { type: "Group", id: "LIST" },
        ],
      }),
      deleteGroup: build.mutation<any, string>({
        query: (id) => ({
          url: `group/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "Group", id },
          { type: "Group", id: "LIST" },
        ],
      }),
    }),
    overrideExisting: true,
  });
export const {
    useLazyGetAllGroupQuery,
    useLazyGetGroupInfoQuery,
    useCreateGroupMutation,
    useUpdateGroupMutation,
    useDeleteGroupMutation
} = groupApi;