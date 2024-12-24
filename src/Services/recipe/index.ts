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
    user_id: string,
    image_url: string,
    food_recipes: any[],
    instructions: string,
    foods: any,
    user: any,
    isSaved: boolean,
    ingredients: any
}


const recipeAPI = API.injectEndpoints({
    endpoints: (build) => ({
        getRecipeList: build.query<Recipe[], { per: number; page: number; search: string }>({
            query: ({ per, page, search }) => ({
                url: "recipe",
                method: "GET",
                params: { per, page, search },
            }),
            transformResponse: (response: { rows: Recipe[] }, meta, arg) => response.rows,
        }),
        getRecipe: build.query<Recipe, { recipeId: string }>({
            query: ({ recipeId }) => ({
                url: `recipe/${recipeId}`,
                method: "GET",
            }),
        }),
        getSavedRecipe: build.query<Recipe[], void>({
            query: () => ({
                url: `recipe/user`,
                method: "GET",
            }),
            transformResponse: (response: { rows: Recipe[] }, meta, arg) => response.rows,
        }),
        saveRecipe: build.mutation<any, { recipe_id: string }>({
            query: (recipe_id) => ({
                url: `recipe/save`,
                method: "POST",
                body: recipe_id,
            }),
        }),
        unsaveRecipe: build.mutation<any, { recipe_id: string }>({
            query: ({ recipe_id }) => ({
                url: `recipe/unsaved/${recipe_id}`,
                method: "DELETE",
            }),
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
    useLazyGetRecipeListQuery,
    useLazyGetSavedRecipeQuery,
    useLazyGetRecipeQuery,
    useSaveRecipeMutation,
    useCreateRecipeMutation,
    useUpdateRecipeMutation,
    useDeleteRecipeMutation,
    useUnsaveRecipeMutation
} = recipeAPI;
