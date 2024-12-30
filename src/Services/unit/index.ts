import { API } from "../base";

export interface Unit {
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

const unitApi = API
.enhanceEndpoints({ addTagTypes: ['Unit'] })
.injectEndpoints({
    endpoints: (build) => ({
      getUnit: build.query<Unit[], void>({
        query: () => ({
          url: `unit`,
          method: "GET",
        }),
        transformResponse: (response: { rows: Unit[] }, meta, arg) => response.rows,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: "Unit" as const, id })),
                { type: "Unit", id: "LIST" },
              ]
            : [{ type: "Unit", id: "LIST" }],
      }),
      createUnit: build.mutation<any, CreateUnitRequest>({
        query: (payload) => ({
          url: `unit`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Unit", id: "LIST" }],
      }),
      updateUnit: build.mutation<any, UpdateUnitRequest>({
        query: ({ id, ...payload }) => ({
          url: `unit/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Unit", id }],
      }),
      deleteUnit: build.mutation<any, string>({
        query: (id) => ({
          url: `unit/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [{ type: "Unit", id }],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useLazyGetUnitQuery, useCreateUnitMutation, useUpdateUnitMutation, useDeleteUnitMutation
} = unitApi;