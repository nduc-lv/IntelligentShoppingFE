import { Config } from "@/General/Config";
import { RootState } from "@/Store";
import { selectAccessToken } from "@/Store/reducers";
import { Action } from "@reduxjs/toolkit";
import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string
  payload: RootState
  err: unknown
} {
  return action.type === REHYDRATE
}
const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = selectAccessToken(state);
    if (token) {
      headers.set('Authorization', token);
    }
    return headers;
  },
});

const baseQueryWithInterceptor = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // here you can deal with 401 error
  }
  return result;
};

export const API = createApi({
  baseQuery: baseQueryWithInterceptor,
  // to prevent circular type issues, the return type needs to be annotated as any
  extractRehydrationInfo(action, { reducerPath }): any {
    console.log(action)
    if (isHydrateAction(action)) {
      // if(action.payload){
      //   action.payload=Object.keys(action.payload).reduce((pre, key)=>{

      //   })
      // }
      if(action.key=='root'){
        console.log(action.payload[API.reducerPath]??undefined)
        return action.payload[API.reducerPath]??undefined
      }
        console.log(action.payload??undefined)
        return action.payload??undefined
    }
    console.log("returns empty")
  },
  endpoints: () => ({}),
});
