import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import siteContentReducer from "./features/siteContentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    siteContent: siteContentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export default store;
