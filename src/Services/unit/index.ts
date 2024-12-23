import { API } from "../base";

export interface UnitResponse {
    id: string;
    name: string;
};

export interface UpdateUnitRequest {
    id: string;
    name: string;
};

export interface CreateUnitRequest {
    name: string;
};

const unitApi = API.injectEndpoints({
    endpoints: (build) => ({
        getUnit: build.query<UnitResponse[], void>({
            query: () => ({
                url: `unit`,
                method: "GET",
            }),
            transformResponse: (response: { rows: UnitResponse[] }, meta, arg) => response.rows,
        }),
        createUnit: build.mutation<any, CreateUnitRequest>({
            query: (payload) => ({
                url: `unit`,
                method: "POST",
                body: payload,
            })
        }),
        updateUnit: build.mutation<any, UpdateUnitRequest>({
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
    useLazyGetUnitQuery, useCreateUnitMutation, useUpdateUnitMutation, useDeleteUnitMutation
} = unitApi;