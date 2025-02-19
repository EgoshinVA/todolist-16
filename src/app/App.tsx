import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorSnackbar, Header } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { selectThemeMode } from "./appSelectors"
import React, { useEffect, useState } from "react"
import s from "./App.module.css"
import { CircularProgress } from "@mui/material"
import { Outlet } from "react-router"
import { useAuthMeQuery } from "../features/auth/api/authApi"
import { ResultCode } from "common/enums"
import { setLoggedIn } from "./appSlice"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  const [isInitialized, setIsInitialized] = useState(false)

  const { data, isLoading } = useAuthMeQuery()

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true)
      if (data?.resultCode === ResultCode.Success) dispatch(setLoggedIn(true))
    }
  }, [data, isLoading])

  if (!isInitialized) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Header />
      <Outlet />
      <ErrorSnackbar />
    </ThemeProvider>
  )
}
