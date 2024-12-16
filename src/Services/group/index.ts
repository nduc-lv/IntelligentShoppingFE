import { API } from "../base";

export interface Group {
    id: string;
    name: string;
    is_admin: boolean;
}

const groupApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllGroup: build.query<Group[], {  }>({
            query: ({  }) => ({
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