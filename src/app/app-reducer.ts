import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

const initialState = {
  themeMode: "light" as ThemeMode,
  status: "idle" as RequestStatus,
  error: null as string | null,
}

const appSLice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload
    },
    setAppStatus(state, action: PayloadAction<RequestStatus>) {
      state.status = action.payload
    },
    setAppError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { changeTheme, setAppError, setAppStatus } = appSLice.actions

export default appSLice.reducer
