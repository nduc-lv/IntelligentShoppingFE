import { API } from "../base";

export interface Group {
    group_id: string;
    name: string;
    is_admin: boolean;
}

export interface UpdateGroupPayload {
    id: string;
    name?: string;
    iamgeUrl?: string;
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
    useUpdateGroupMutation,
} = groupApi;