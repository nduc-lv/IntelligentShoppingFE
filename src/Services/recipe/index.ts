import { API } from "../base";

export interface Food {
    id: string;
    name: string;
    user: any;
    category: any;
}

export interface Shopping {
    id: string;
    name: string;
    date: string;
    group: any;
    foods: any[];
    tasks: any[];
}

export interface CreateShoppingPayload {
    name: string;
    date: string;
    groupId: string;
    foods: Array<any>;
}

export interface UpdateShoppingPayload {
    id: string;
    name?: string;
    date?: string;
    groupId?: string;
    foods?: Array<any>;
}
export interface Food {
    id: string,
    name: string,
    image_url: string,
    user_id: string,
    category: any
}

export interface Unit {
    name: string,
    id: string,
    user_id: string
}

export interface User {
    id: string,
    name: string,
    username: string
}

export interface Recipe {
    id: string,
    name: string,
    description: string,
    user_id: string
}


const recipeAPI = API.injectEndpoints({
    endpoints: (build) => ({
        getRecipeList: build.query<Recipe[], { per: number; page: number; query: string }>({
            query: ({ per, page, query }) => ({
                url: "recipe",
                method: "GET",
                params: { per, page, query },
            }),
            transformResponse: (response: { rows: Recipe[] }, meta, arg) => response.rows,
        }),
        getRecipe: build.query<Recipe[], { recipeId: string }>({
            query: ({ recipeId }) => ({
                url: `recipe/${recipeId}`,
                method: "GET",
            }),
            transformResponse: (response: { recipe: Recipe[] }, meta, arg) => response.recipe
        }),
        createRecipe: build.mutation<Recipe, CreateShoppingPayload>({
            query: (payload) => ({
                url: "recipe",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response: { recipe: any }, meta, arg) => response.recipe,
        }),

        updateRecipe: build.mutation<any, UpdateShoppingPayload>({
            query: ({ id, ...payload }) => ({
                url: `recipe/${id}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response: { recipe: Recipe[] }, meta, arg) => response.recipe,
        }),

        deleteRecipe: build.mutation<void, string>({
            query: (id) => ({
                url: `recipe/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response: { data: void }, meta, arg) => response.data,
        }),

    }),
    overrideExisting: true,
});

export const {
    useGetRecipeListQuery,
    useGetRecipeQuery,
    useCreateRecipeMutation,
    useUpdateRecipeMutation,
    useDeleteRecipeMutation,
} = recipeAPI;
