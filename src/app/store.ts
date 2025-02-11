import { combineReducers } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/model/auth-reducer"
import appReducer from "./app-reducer"
import todolistsReducer from "../features/todolists/model/todolists-reducer"
import tasksReducer from "../features/todolists/model/tasks-reducer"

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

// Создаем тип диспатча который принимает как AC так и TC

// @ts-ignore
window.store = store
