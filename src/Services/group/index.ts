import { API } from "../base";

export interface Group {
    group_id: string;
    name: string;
    is_admin: boolean;
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

const groupApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllGroup: build.query<Group[], void>({
            query: () => ({
                url: `group/`,
                method: "GET",
            })
        }),
        getGroupInfo: build.query<any, {groupId: string}>({
            query: ({groupId}) => ({
                url: `group/${groupId}`,
                method: "GET",
            })
        }),
        createGroup: build.mutation<any, CreateGroupPayload>({
            query: (payload) => ({
                url: `group`,
                method: "POST",
                body: payload,
            })
        }),
        updateGroup: build.mutation<any, UpdateGroupPayload>({
            query: ({ id, ...payload }) => ({
                url: `group/${id}`,
                method: "PUT",
                body: payload,
            })
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllGroupQuery,
    useLazyGetGroupInfoQuery,
    useCreateGroupMutation,
    useUpdateGroupMutation,
} = groupApi;