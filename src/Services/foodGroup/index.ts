import { API } from "../base";

export interface Category {
    id: string;
    name: string;
    description: string;
}

export interface CreateCategoryPayload {
    name: string;
    imageUrl?: string;
}

export interface UpdateCategoryPayload {
    id: string;
    name?: string;
    imageUrl?: string;
}

export interface Food {
    id: string;
    name: string;
    description: string;
}


const categoryApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllFoodByCategory: build.query<Food[], { group_id: string; category_id: string }>({
            query: ({ group_id, category_id }) => ({
                url: `foodgroup/food/${group_id}/${category_id}`,
                method: "GET",
            }),
            transformResponse: (response: { rows: Category[] }, meta, arg) => response.rows,
        }),
        getCategoryInfo: build.query<any, { categoryId: string }>({
            query: ({ categoryId }) => ({
                url: `category/${categoryId}`,
                method: "GET",
            })
        }),
        createCategory: build.mutation<any, CreateCategoryPayload>({
            query: (payload) => ({
                url: `category`,
                method: "POST",
                body: payload,
            })
        }),
        updateCategory: build.mutation<any, UpdateCategoryPayload>({
            query: ({ id, ...payload }) => ({
                url: `category/${id}`,
                method: "PUT",
                body: payload,
            })
        }),
        deleteCategory: build.mutation<any, string>({
            query: (id) => ({
                url: `category/${id}`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllFoodByCategoryQuery,
    useLazyGetCategoryInfoQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;