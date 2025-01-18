import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorSnackbar, Header } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { selectThemeMode } from "./appSelectors"
import { initializeAppTC } from "../features/auth/model/auth-reducer"
import React, { useEffect } from "react"
import { selectIsInitialized } from "../features/auth/model/authSelectors"
import s from "./App.module.css"
import { CircularProgress } from "@mui/material"
import { Outlet } from "react-router"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector(selectIsInitialized)

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

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
