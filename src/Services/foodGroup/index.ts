import { API } from "../base";

export interface CreateFoodGroupPayload {
    food_id: string;
    category_id: string;
    group_id: string;
    unit_name: string;
    quantity: number;
    exprire_date: string;
}

export interface CreateFoodPayload {
    category_id: string;
    name: string;
}
export interface Food {
    id: string;
    name: string;
    description: string;
}


const foodGroupsApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllFoodByCategory: build.query<Food[], { group_id: string; category_id: string }>({
            query: ({ group_id, category_id }) => ({
                url: `foodgroup/food/${group_id}/${category_id}`,
                method: "GET",
            }),
            transformResponse: (response: { rows: Food[] }, meta, arg) => response.rows,
        }),
        createFoodGroup: build.mutation<any, CreateFoodGroupPayload>({
            query: (payload) => ({
                url: `foodgroup`,
                method: "POST",
                body: payload,
            }),
        }),
        createFood: build.mutation<any, CreateFoodPayload>({
            query: (payload) => ({
                url: `food`,
                method: "POST",
                body: payload,
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllFoodByCategoryQuery,
    useCreateFoodGroupMutation,
    useCreateFoodMutation
} = foodGroupsApi;