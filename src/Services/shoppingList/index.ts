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
const shoppingListAPI = API.injectEndpoints({
  endpoints: (build) => ({
    getShoppingList: build.query<Shopping[], { per: number; page: number; groupId: string }>({
      query: ({ per, page, groupId }) => ({
        url: "shopping-list",
        method: "GET",
        params: { per, page, groupId },
      }),
      transformResponse: (response: { rows: Shopping[] }, meta, arg) => response.rows,
    }),
    getAllFood: build.query<Food[], { userId: string }>({
      query: ({ userId }) => ({
        url: `shopping-list/all-food/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: { foods: Food[] }, meta, arg) => response.foods
    }),
    getAllUnit: build.query<Unit[], { userId: string }>({
      query: ({ userId }) => ({
        url: `shopping-list/all-unit/${userId}`,
        method: "GET"
      }),
      transformResponse: (response: { units: Unit[] }, meta, arg) => response.units
    }),
    getAllUser: build.query<User[], { groupId: string }>({
      query: ({ groupId }) => ({
        url: `shopping-list/all-user/${groupId}`,
        method: "GET",
      }),
      transformResponse: (response: { users: User[] }, meta, arg) => response.users
    }),

    createShoppingList: build.mutation<Shopping, CreateShoppingPayload>({
      query: (payload) => ({
        url: "shopping-list",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: { list: any }, meta, arg) => response.list,
    }),

    updateShoppingList: build.mutation<any, UpdateShoppingPayload>({
      query: ({ id, ...payload }) => ({
        url: `shopping-list/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: { list: Shopping[] }, meta, arg) => response.list,
    }),

    deleteShoppingList: build.mutation<void, string>({
      query: (id) => ({
        url: `shopping-list/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: void }, meta, arg) => response.data,
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetShoppingListQuery,
  useLazyGetShoppingListQuery,
  useCreateShoppingListMutation,
  useUpdateShoppingListMutation,
  useDeleteShoppingListMutation,
  useLazyGetAllFoodQuery,
  useLazyGetAllUnitQuery,
  useLazyGetAllUserQuery
} = shoppingListAPI;
