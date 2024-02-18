import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/user.slice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({ user: userReducer }); // i use combineReducers if want to add more reducers
// setting the key in localstorage
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer, // use persistReducer as the reducer function
  middleware: (buildGetDefaultMiddleware) =>
    buildGetDefaultMiddleware({
      // to prevent errors in browser
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
