import { API } from "../base";

export interface Menu {
    group_id: string;
    date: any;
    meal: string;
    menu_recipe: any;
}

const menuApi = API.injectEndpoints({
    endpoints: (build) => ({
        getMenu: build.query<Menu[], { group_id: string, date: any }>({
            query: ({group_id, date}) => ({
                url: `menu?group_id=${group_id}&date=${date}`,
                method: "GET",
            }),
            transformResponse: (response: { rows: Menu[] }, meta, arg) => response.rows,
        }),
        createMenu: build.mutation<any, Menu>({
            query: (payload) => ({
                url: "menu",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response: { menu: any }, meta, arg) => response.menu,
        }),
        deleteMenu: build.mutation<any, string>({
            query: (id) => ({
                url: `menu/${id}`,
                method: "DELETE",
            }),
        }),
    })
})

export const {
    useLazyGetMenuQuery,
    useCreateMenuMutation,
    useDeleteMenuMutation
} = menuApi;