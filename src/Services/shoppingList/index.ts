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
  foods: Food[];
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

const shoppingListAPI = API.injectEndpoints({
  endpoints: (build) => ({
    getShoppingList: build.query<Shopping[], { per: number; page: number; groupId: string }>({
      query: ({ per, page, groupId }) => ({
        url: "shopping-list",
        method: "GET",
        params: { per, page, groupId },
      }),
      transformResponse: (response: { data: Shopping[] }, meta, arg) => response.data,
    }),

    createShoppingList: build.mutation<Shopping, CreateShoppingPayload>({
      query: (payload) => ({
        url: "shopping-list",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: { data: any }, meta, arg) => response.data,
    }),

    updateShoppingList: build.mutation<any, UpdateShoppingPayload>({
      query: ({ id, ...payload }) => ({
        url: `shopping-list/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: { data: Shopping }, meta, arg) => response.data,
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
} = shoppingListAPI;
