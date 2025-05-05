import { configureStore } from "@reduxjs/toolkit";
import { setupListener } from "@reduxjs/toolkit/query/react";
import authReducer from "./features/auth/authSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListener(store.dispatch);
export default store;
