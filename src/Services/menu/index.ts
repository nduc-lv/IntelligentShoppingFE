import { API } from "../base";

export interface Menu {
    group_id: string;
    date: any;
    meal: string;
    menu_recipe: any;
}

const menuApi = API
.enhanceEndpoints({addTagTypes:["Menu"]})
.injectEndpoints({
    endpoints: (build) => ({
      getMenu: build.query<Menu[], { group_id: string; date: any }>({
        query: ({ group_id, date }) => ({
          url: `menu?group_id=${group_id}&date=${date}`,
          method: "GET",
        }),
        transformResponse: (response: { rows: Menu[] }, meta, arg) => response.rows,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ group_id:id }) => ({ type: "Menu" as const, id })),
                { type: "Menu", id: "LIST" },
              ]
            : [{ type: "Menu", id: "LIST" }],
      }),
      createMenu: build.mutation<any, Menu>({
        query: (payload) => ({
          url: "menu",
          method: "POST",
          body: payload,
        }),
        transformResponse: (response: { menu: any }, meta, arg) => response.menu,
        invalidatesTags: [{ type: "Menu", id: "LIST" }],
      }),
      deleteMenu: build.mutation<any, string>({
        query: (id) => ({
          url: `menu/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [{ type: "Menu", id }],
      }),
    }),
    overrideExisting: true,
  });
  

export const {
    useLazyGetMenuQuery,
    useCreateMenuMutation,
    useDeleteMenuMutation
} = menuApi;