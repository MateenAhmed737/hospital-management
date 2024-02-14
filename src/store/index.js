import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import appSlice from "./slices/appSlice";

const reducers = combineReducers({
  user: userSlice,
  app: appSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "app"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
const persistor = persistStore(store);

export { store, persistor };
