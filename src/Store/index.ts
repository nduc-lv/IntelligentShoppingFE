import { API } from "@/Services/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER } from
"redux-persist";
import { homeReducers, themeReducers, authReducer } from "./reducers";
import { dataReducer } from "./reducers/data";
import { useSelector } from "react-redux";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
const reducers = combineReducers({
  api: API.reducer,
  theme: themeReducers,
  home: homeReducers,
  auth: authReducer,
  data: dataReducer
});


const persistedReducers = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
    // blacklist: [`user/me`]
    stateReconciler:autoMergeLevel1<any>
  },
  reducers);

const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(API.middleware);

    // if (__DEV__ && !process.env.JEST_WORKER_ID) {
    //   const createDebugger = require("redux-flipper").default;
    //   middlewares.push(createDebugger());
    // }

    return middlewares;
  }
});

const persistor = persistStore(store);

setupListeners(store.dispatch);
// NetInfo.addEventListener((state) => {
//   if (state.isConnected) {
//     persistor.persist();
//   } else{
//   }
// });
export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;