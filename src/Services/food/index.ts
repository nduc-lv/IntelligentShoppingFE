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

const foodApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllFood: build.query<Food[], void>({
            query: () => ({
                url: `food`,
                method: "GET",
            }),
            transformResponse: (response: { rows: Food[] }, meta, arg) => response.rows,
        }),
        createFood: build.mutation<any, CreateFoodPayload>({
            query: (payload) => ({
                url: `food`,
                method: "POST",
                body: payload,
            })
        }),
        updateFood: build.mutation<any, UpdateFoodPayload>({
            query: ({ id, ...payload }) => ({
                url: `food/${id}`,
                method: "PUT",
                body: payload,
            })
        }),
        deleteFood: build.mutation<any, string>({
            query: (id) => ({
                url: `food/${id}`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllFoodQuery,
    useCreateFoodMutation,
    useUpdateFoodMutation,
    useDeleteFoodMutation
} = foodApi;