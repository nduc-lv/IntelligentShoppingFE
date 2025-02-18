import { update } from "lodash";
import { API } from "../base";

export interface CreateFoodGroupPayload {
    food_id: string;
    category_id: string;
    group_id: string;
    unit_name: string;
    quantity: number;
    exprire_date: string;
}

export interface UpdateFoodGroupPayload {
    id: string;
    unit_name: string;
    quantity: number;
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


const foodGroupsApi = API
.enhanceEndpoints({addTagTypes:["FoodGroup"]})
.injectEndpoints({
    endpoints: (build) => ({
      getAllFoodByCategory: build.query<Food[], { group_id: string; category_id: string; search: string }>({
        query: ({ group_id, category_id, search }) => ({
          url: `foodgroup/food/${group_id}/${category_id}`,
          method: "GET",
          params: { search },
        }),
        transformResponse: (response: { rows: Food[] }, meta, arg) => response.rows,
        providesTags: (result, error, { group_id, category_id }) => [
          { type: "FoodGroup", id: `${group_id}-${category_id}` },
          { type: "FoodGroup", id: "LIST" },
        ],
      }),
      createFoodGroup: build.mutation<any, CreateFoodGroupPayload>({
        query: (payload) => ({
          url: `foodgroup`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "FoodGroup", id: "LIST" }],
      }),
      deleteFoodGroup: build.mutation<void, { id: string }>({
        query: ({ id }) => ({
          url: `foodgroup/${id}`,
          method: "DELETE",
        }),
        transformResponse: (response: { data: void }, meta, arg) => response.data,
        invalidatesTags: [{ type: "FoodGroup", id: "LIST" }],
      }),
      createFood: build.mutation<any, CreateFoodPayload>({
        query: (payload) => ({
          url: `food`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "FoodGroup", id: "LIST" }],
      }),
      updateFoodGroup: build.mutation<any, UpdateFoodGroupPayload>({
        query: ({ id, ...payload }) => ({
          url: `foodgroup/${id}`,
          method: "PATCH",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "FoodGroup", id: `${id}` },
          { type: "FoodGroup", id: "LIST" },
        ],
      }),
    }),
    overrideExisting: true,
  });
export const {
    useLazyGetAllFoodByCategoryQuery,
    useCreateFoodGroupMutation,
    useCreateFoodMutation,
    useDeleteFoodGroupMutation,
    useUpdateFoodGroupMutation
} = foodGroupsApi;