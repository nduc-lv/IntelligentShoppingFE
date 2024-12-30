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
    image_url: string;
}

export interface UpdateRecipePayload {
    recipe_id: string;
    name: string;
    description: string;
    instructions: string;
    foods: Array<any>;
    image_url: string;
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

const recipeAPI = API
.enhanceEndpoints({addTagTypes:["Recipe","SavedRecipe","MyRecipe"]})
.injectEndpoints({
    endpoints: (build) => ({
      getRecipeList: build.query<Recipe[], { per: number; page: number; search: string }>({
        query: ({ per, page, search }) => ({
          url: "recipe",
          method: "GET",
          params: { per, page, search },
        }),
        transformResponse: (response: { rows: Recipe[] }, meta, arg) => response.rows,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: "Recipe" as const, id })),
                { type: "Recipe", id: "LIST" },
              ]
            : [{ type: "Recipe", id: "LIST" }],
      }),
      getRecipe: build.query<Recipe, { recipeId: string }>({
        query: ({ recipeId }) => ({
          url: `recipe/${recipeId}`,
          method: "GET",
        }),
        providesTags: (result, error, { recipeId }) => [{ type: "Recipe", id: recipeId }],
      }),
      getSavedRecipe: build.query<Recipe[], void>({
        query: () => ({
          url: `recipe/user`,
          method: "GET",
        }),
        transformResponse: (response: { rows: Recipe[] }, meta, arg) => response.rows,
        providesTags: [{ type: "SavedRecipe", id: "LIST" }],
      }),
      getMyRecipe: build.query<Recipe[], void>({
        query: () => ({
          url: `recipe/myrecipe`,
          method: "GET",
        }),
        transformResponse: (response: { rows: Recipe[] }, meta, arg) => response.rows,
        providesTags: [{ type: "MyRecipe", id: "LIST" }],
      }),
      saveRecipe: build.mutation<any, { recipe_id: string }>({
        query: (recipe_id) => ({
          url: `recipe/save`,
          method: "POST",
          body: recipe_id,
        }),
        invalidatesTags: [{ type: "SavedRecipe", id: "LIST" }],
      }),
      unsaveRecipe: build.mutation<any, { recipe_id: string }>({
        query: ({ recipe_id }) => ({
          url: `recipe/unsaved/${recipe_id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "SavedRecipe", id: "LIST" }],
      }),
      createRecipe: build.mutation<Recipe, CreateRecipePayload>({
        query: (payload) => ({
          url: "recipe",
          method: "POST",
          body: payload,
        }),
        transformResponse: (response: { recipe: any }, meta, arg) => response.recipe,
        invalidatesTags: [{ type: "Recipe", id: "LIST" }, { type: "MyRecipe", id: "LIST" }],
      }),
      updateRecipe: build.mutation<any, UpdateRecipePayload>({
        query: ({ recipe_id, ...payload }) => ({
          url: `recipe/${recipe_id}`,
          method: "PATCH",
          body: payload,
        }),
        transformResponse: (response: { recipe: Recipe[] }, meta, arg) => response.recipe,
        invalidatesTags: (result, error, { recipe_id }) => [{ type: "Recipe", id: recipe_id }],
      }),
      deleteRecipe: build.mutation<void, { recipe_id: string }>({
        query: ({ recipe_id }) => ({
          url: `recipe/${recipe_id}`,
          method: "DELETE",
        }),
        transformResponse: (response: { data: void }, meta, arg) => response.data,
        invalidatesTags: (result, error, { recipe_id }) => [{ type: "Recipe", id: recipe_id }],
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
