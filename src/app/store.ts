import { combineReducers } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./appSlice"
import { baseApi } from "./baseApi"
import { setupListeners } from "@reduxjs/toolkit/query"

const rootReducer = combineReducers({
  app: appReducer,
  [baseApi.reducerPath]: baseApi.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
