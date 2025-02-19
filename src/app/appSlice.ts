import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { todolistsApi } from "../features/todolists/api/todolistsApi"
import { tasksApi } from "../features/todolists/api/tasksApi"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

const initialState = {
  themeMode: "light" as ThemeMode,
  status: "idle" as RequestStatus,
  error: null as string | null,
  isLoggedIn: false,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload
    },
    setAppStatus(state, action: PayloadAction<RequestStatus>) {
      state.status = action.payload
    },
    setAppError(state, action: PayloadAction<{error: string | null }>) {
      state.error = action.payload.error
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload
    },
  },
  selectors: {
    selectIsAuth: (state) => state.isLoggedIn,
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(isPending, (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return
        }
        state.status = "loading"
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded"
      })
      .addMatcher(isRejected, (state) => {
        state.status = "failed"
      }),
})

export const { changeTheme, setAppError, setAppStatus, setLoggedIn } = appSlice.actions
export const { selectIsAuth } = appSlice.selectors

export default appSlice.reducer
