import { API } from "../base";

export interface Group {
    group_id: string;
    name: string;
    is_admin: boolean;
}

const groupApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllGroup: build.query<Group[], void>({
            query: () => ({
                url: `group/`,
                method: "GET",
            })
        })
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllGroupQuery,
} = groupApi;