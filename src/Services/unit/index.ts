import { API } from "../base";

export interface Unit {
    id: string;
    name: string;
}

const unitApi = API.injectEndpoints({
    endpoints: (build) => ({
        getUnits: build.query<Unit[], void>({
            query: () => ({
                url: `unit`,
                method: "GET",
            }),
            transformResponse: (response: { rows: Unit[] }, meta, arg) => response.rows,
        }),

    }),
    overrideExisting: true,
});

export const {
    useLazyGetUnitsQuery,
} = unitApi;