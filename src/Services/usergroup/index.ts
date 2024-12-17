import { API } from "../base";

export interface UserGroup {
    group_id: string;
    user_id: string;
    isDeleted: boolean;
    is_admin: boolean;
    createdAt: Date;
    updatedAt: Date;
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
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllUserGroupQuery,
} = usergroupApi;