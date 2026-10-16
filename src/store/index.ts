"use client";

import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { appReducer, setAppKey, setAllAppKeys } from "./slice/app";
import {
  usePostAuthMutation,
  useGetDataQuery,
  useGetDataConfigQuery,
  usePostDataMutation,
  usePatchDataMutation,
  usePutDataMutation,
  useDeleteDataMutation,
} from "./api";
import { globalApi, authApi } from "#/store/api";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["app"],
};

const appPersistConfig = {
  key: "app",
  storage,
  blacklist: ["request", "response"],
};

const rootReducer = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),

  // RTK Query reducers should NEVER be persisted
  [authApi.reducerPath]: authApi.reducer,
  [globalApi.reducerPath]: globalApi.reducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      globalApi.middleware,
      authApi.middleware,
    ),
});

export {
  setAppKey,
  setAllAppKeys,
  usePostAuthMutation,
  useGetDataQuery,
  useGetDataConfigQuery,
  usePostDataMutation,
  usePatchDataMutation,
  usePutDataMutation,
  useDeleteDataMutation,
};

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
