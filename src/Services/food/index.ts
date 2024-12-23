import { API } from "../base";

export interface Category {
    id: string;
    name: string;
    description: string;
}

export interface CreateCategoryPayload {
    name: string;
    imageUrl?: string;
}

export interface UpdateCategoryPayload {
    id: string;
    name?: string;
    imageUrl?: string;
}

export interface Food {
    id: string;
    name: string;
    description: string;
}


const categoryApi = API.injectEndpoints({
    endpoints: (build) => ({
        getAllFood: build.query<Food[], void>({
            query: () => ({
                url: `food`,
                method: "GET",
            }),
            transformResponse: (response: { rows: Category[] }, meta, arg) => response.rows,
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetAllFoodQuery,
} = categoryApi;