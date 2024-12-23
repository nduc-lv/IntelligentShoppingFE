import { API } from "../base";

export interface Unit {
    id: string;
    name: string;
    description: string;
}

export interface CreateUnitPayload {
    name: string;
    imageUrl?: string;
}

export interface UpdateUnitPayload {
    id: string;
    name?: string;
    imageUrl?: string;
}

const unitApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllUnit: build.query<Unit[], void>({
            query: () => ({
                url: `unit`,
                method: "GET",
            }),
            transformResponse: (response: { rows: Unit[] }, meta, arg) => response.rows,
        }),
        getUnitInfo: build.query<any, { unitId: string }>({
            query: ({ unitId }) => ({
                url: `unit/${unitId}`,
                method: "GET",
            })
        }),
        createUnit: build.mutation<any, CreateUnitPayload>({
            query: (payload) => ({
                url: `unit`,
                method: "POST",
                body: payload,
            })
        }),
        updateUnit: build.mutation<any, UpdateUnitPayload>({
            query: ({ id, ...payload }) => ({
                url: `unit/${id}`,
                method: "PUT",
                body: payload,
            })
        }),
        deleteUnit: build.mutation<any, string>({
            query: (id) => ({
                url: `unit/${id}`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllUnitQuery,
    useLazyGetUnitInfoQuery,
    useCreateUnitMutation,
    useUpdateUnitMutation,
    useDeleteUnitMutation
} = unitApi;