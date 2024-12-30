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
export interface ResponseShopping {
  rows: Shopping[],
  isAdmin: boolean
}

export interface CreateShoppingPayload {
  name: string;
  date: string;
  groupId: string;
  foods: Array<any>;
}

export interface AddItemToFridgePayload {
  food_id: string,
  group_id: string,
  unit_id: string,
  unit_name: string,
  shopping_id: string,
  id: string | undefined,
  quantity: number,
  expired_at: string
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

// export interface ItemsByShoppingListId {
//   id: string,
//   date: string,
//   quantity: number,
//   task: any,
//   unit_id: string,
//   food_id: string,
//   shopping: any,
// }

export interface Response {
  rows: ItemByShoppingIdResponse[] | undefined,
  isAdmin: boolean
}

export interface ItemByShoppingIdResponse {
  id: string,
  unit_id: string,
  unit_name: string,
  food_id: string,
  quantity: number,
  shopping: {
    date: string,
    id: string,
    name: string
  },
  task: {
    user_id: string
  }
}

export interface Token {
  token: string
}
const shoppingListAPI = API
.enhanceEndpoints({addTagTypes:['ShoppingList','Unit','Food','User','ShoppingItem','UserGroup']})
.injectEndpoints({
  endpoints: (build) => ({
    getShoppingList: build.query<ResponseShopping, { per: number; page: number; groupId: string }>({
      query: ({ per, page, groupId }) => ({
        url: "shopping-list",
        method: "GET",
        params: { per, page, groupId },
      }),
      transformResponse: (response: { rows: Shopping[]; isAdmin: boolean }, meta, arg) => ({
        rows: response.rows,
        isAdmin: response.isAdmin,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.rows.map(({ id }) => ({ type: "ShoppingList" as const, id })),
              { type: "ShoppingList", id: "LIST" },
            ]
          : [{ type: "ShoppingList", id: "LIST" }],
    }),
    getItemByShoppingListId: build.query<Response, { page: number; per: number; shoppingId: string }>({
      query: ({ per, page, shoppingId }) => ({
        url: "shopping-list/shopping",
        method: "GET",
        params: { per, page, shoppingId },
      }),
      transformResponse: (response: { rows: any; isAdmin: boolean }, meta, arg) => ({
        rows: response.rows,
        isAdmin: response.isAdmin,
      }),
      providesTags: (result, error, { shoppingId }) =>
        result?.rows
          ? [
              ...result.rows.map(({ id }) => ({ type: "ShoppingItem" as const, id })),
              { type: "ShoppingItem", id: shoppingId },
            ]
          : [{ type: "ShoppingItem", id: shoppingId }],
    }),
    getAllFood: build.query<Food[], {}>({
      query: () => ({
        url: `shopping-list/all-food/`,
        method: "GET",
      }),
      transformResponse: (response: { foods: Food[] }, meta, arg) => response.foods,
      providesTags: [{ type: "Food", id: "LIST" }],
    }),
    getAllUnit: build.query<Unit[], any>({
      query: () => ({
        url: `shopping-list/all-unit/`,
        method: "GET",
      }),
      transformResponse: (response: { units: Unit[] }, meta, arg) => response.units,
      providesTags: [{ type: "Unit", id: "LIST" }],
    }),
    getAllUser: build.query<User[], { groupId: string }>({
      query: ({ groupId }) => ({
        url: `shopping-list/all-user/${groupId}`,
        method: "GET",
      }),
      transformResponse: (response: { users: User[] }, meta, arg) => response.users,
      providesTags: (result, error, { groupId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: groupId },
            ]
          : [{ type: "User", id: groupId }],
    }),
    createShoppingList: build.mutation<Shopping, CreateShoppingPayload>({
      query: (payload) => ({
        url: "shopping-list",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: { list: any }, meta, arg) => response.list,
      invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
    }),
    updateShoppingList: build.mutation<any, UpdateShoppingPayload>({
      query: ({ id, ...payload }) => ({
        url: `shopping-list/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: { list: Shopping[] }, meta, arg) => response.list,
      invalidatesTags: (result, error, { id }) => [{ type: "ShoppingList", id }],
    }),
    deleteShoppingList: build.mutation<void, string>({
      query: (id) => ({
        url: `shopping-list/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: void }, meta, arg) => response.data,
      invalidatesTags: (result, error, id) => [{ type: "ShoppingList", id }],
    }),
    deleteShoppingItemById: build.mutation<void, string>({
      query: (id) => ({
        url: `shopping-list/shopping-item/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: void }, meta, arg) => response.data,
      invalidatesTags: (result, error, id) => [{ type: "ShoppingItem", id }],
    }),
    addShoppingItemToFridge: build.mutation<any, AddItemToFridgePayload>({
      query: (payload) => ({
        url: "shopping-list/fridge/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "ShoppingItem", id: "LIST" }],
    }),
    bulkAddShoppingItemToFridge: build.mutation<any, Array<AddItemToFridgePayload>>({
      query: (payload) => ({
        url: "shopping-list/fridge/bulk-add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "ShoppingItem", id: "LIST" }],
    }),
    getUserGroup: build.query({
      query: () => `shopping-list/group/`,
      transformResponse: (response: { groups: any }) => response.groups,
      providesTags: [{ type: "UserGroup", id: "LIST" }],
    }),
    updateToken: build.mutation<any, Token>({
      query: (payload) => ({
        url: "token/add-token",
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: true,
});
export const {
  useUpdateTokenMutation,
  useGetShoppingListQuery,
  useLazyGetShoppingListQuery,
  useCreateShoppingListMutation,
  useUpdateShoppingListMutation,
  useDeleteShoppingListMutation,
  useAddShoppingItemToFridgeMutation,
  useBulkAddShoppingItemToFridgeMutation,
  useLazyGetAllFoodQuery,
  useLazyGetAllUnitQuery,
  useLazyGetAllUserQuery,
  useLazyGetItemByShoppingListIdQuery,
  useLazyGetUserGroupQuery,
  useDeleteShoppingItemByIdMutation
} = shoppingListAPI;
