import { API } from "../base";

export interface Food {
    id: string;
    name: string;
    user: any;
    category: any;
}

export interface CreateRecipePayload {
    name: string;
    description: string;
    instructions: string;
    foods: Array<any>;
}

export interface UpdateRecipePayload {
    recipe_id: string;
    name: string;
    description: string;
    instructions: string;
    foods: Array<any>;
}


export interface Unit {
    name: string,
    id: string,
    user_id: string
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
        getMyRecipe: build.query<Recipe[], void>({
            query: () => ({
                url: `recipe/myrecipe`,
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
        createRecipe: build.mutation<Recipe, CreateRecipePayload>({
            query: (payload) => ({
                url: "recipe",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response: { recipe: any }, meta, arg) => response.recipe,
        }),

        updateRecipe: build.mutation<any, UpdateRecipePayload>({
            query: ({ recipe_id, ...payload }) => ({
                url: `recipe/${recipe_id}`,
                method: "PATCH",
                body: payload,
            }),
            transformResponse: (response: { recipe: Recipe[] }, meta, arg) => response.recipe,
        }),

        deleteRecipe: build.mutation<void, { recipe_id: string }>({
            query: ({ recipe_id }) => ({
                url: `recipe/${recipe_id}`,
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
    useLazyGetMyRecipeQuery,
    useLazyGetRecipeQuery,
    useSaveRecipeMutation,
    useCreateRecipeMutation,
    useUpdateRecipeMutation,
    useDeleteRecipeMutation,
    useUnsaveRecipeMutation
} = recipeAPI;
