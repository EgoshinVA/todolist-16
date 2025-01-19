import { Dispatch } from "redux"
import { setAppStatus } from "../../../app/app-reducer"
import { LoginArgs } from "../api/authApi.types"
import { authApi } from "../api/authApi"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { clearData } from "../../todolists/model/todolists-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload
    },
    setIsInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload
    }
  }
})

export const {setLoggedIn, setIsInitialized} = authSlice.actions

export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setLoggedIn(true))
        dispatch(setAppStatus("succeeded"))
        localStorage.setItem("sn-token", res.data.data.token)
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setLoggedIn(false))
        dispatch(setAppStatus("succeeded"))
        localStorage.removeItem("sn-token")
        dispatch(clearData())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  authApi
    .me()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setLoggedIn(true))
        dispatch(setAppStatus("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitialized(true))
    })
}

export default authSlice.reducer