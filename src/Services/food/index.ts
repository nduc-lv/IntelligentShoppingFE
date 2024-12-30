import { API } from "../base";

export interface Category {
    id: string;
    name: string;
}

export interface Food {
    id: string;
    name: string;
    category: Category;
    image_url: string | null;
}

export interface UpdateFoodPayload {
    id: string;
    name?: string;
    imageUrl?: string;
    category_id?: string;
}

export interface CreateFoodPayload {
    name: string;
    category_id: string;
    imageUrl?: string;
}

const foodApi = API
.enhanceEndpoints({addTagTypes:["Food"]})
.injectEndpoints({
    endpoints: (build) => ({
      getAllFood2: build.query<Food[], void>({
        query: () => ({
          url: `food`,
          method: "GET",
        }),
        transformResponse: (response: { rows: Food[] }, meta, arg) => response.rows,
        providesTags: (result, error, arg) => [{ type: "Food", id: "LIST" }],
      }),
      createFood: build.mutation<any, CreateFoodPayload>({
        query: (payload) => ({
          url: `food`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Food", id: "LIST" }],
      }),
      updateFood: build.mutation<any, UpdateFoodPayload>({
        query: ({ id, ...payload }) => ({
          url: `food/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Food", id: `${id}` },
          { type: "Food", id: "LIST" },
        ],
      }),
      deleteFood: build.mutation<any, string>({
        query: (id) => ({
          url: `food/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Food", id: "LIST" }],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useLazyGetAllFood2Query,
    useCreateFoodMutation,
    useUpdateFoodMutation,
    useDeleteFoodMutation
} = foodApi;