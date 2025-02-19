import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import React from "react"
import { changeTheme, selectIsAuth, setLoggedIn } from "../../../app/appSlice"
import { selectAppStatus, selectThemeMode } from "../../../app/appSelectors"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { MenuButton } from "common/components"
import { Link } from "react-router"
import { Path } from "common/routing/router"
import { useLogoutMutation } from "../../../features/auth/api/authApi"
import { ResultCode } from "common/enums"
import { baseApi } from "../../../app/baseApi"

export const Header = () => {
  const dispatch = useAppDispatch()

  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectAppStatus)
  const isLoggedIn = useAppSelector(selectIsAuth)

  const theme = getTheme(themeMode)

  const changeModeHandler = () => {
    dispatch(changeTheme(themeMode === "light" ? "dark" : "light"))
  }

  const [logout] = useLogoutMutation()

  const logoutHandler = () => {
    logout().then((res) => {
      if(res.data?.resultCode === ResultCode.Success){
        dispatch(setLoggedIn(false))
        localStorage.removeItem("sn-token")
        dispatch(baseApi.util.invalidateTags(['Task', 'Todolist']))
      }
    })
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
        <div>
          {isLoggedIn && <MenuButton onClick={logoutHandler}>Logout</MenuButton>}
          <MenuButton background={theme.palette.primary.dark}>
            <Link to={Path.Faq}>Faq</Link>
          </MenuButton>
          <Switch color={"default"} onChange={changeModeHandler} />
        </div>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}
