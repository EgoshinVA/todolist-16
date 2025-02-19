import React, { useEffect } from "react"
import { createBrowserRouter, Outlet, RouteObject, useNavigate } from "react-router"
import { Main } from "../../app/Main"
import { Login } from "../../features/auth/ui/Login/Login"
import { Page404 } from "common/components/Page404/Page404"
import { Faq } from "../../app/Faq"
import { App } from "../../app/App"
import { useAppSelector } from "common/hooks"
import { selectIsAuth } from "../../app/appSlice"

export const Path = {
  Main: "/",
  Login: "login",
  NotFound: "*",
  Faq: "faq",
  Protected: "protected",
} as const

const publicRoutes: RouteObject[] = [
  {
    path: Path.Login,
    element: <Login />,
  },
  {
    path: Path.NotFound,
    element: <Page404 />,
  },
]

const privateRoutes: RouteObject[] = [
  {
    path: Path.Main,
    element: <Main />,
  },
  {
    path: Path.Faq,
    element: <Faq />,
  },
]

export const PrivateRoutes = () => {
  const isLoggedIn = useAppSelector(selectIsAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) navigate(Path.Login)
  }, [isLoggedIn])

  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PrivateRoutes />,
        children: privateRoutes,
      },
      ...publicRoutes,
    ],
  },
])
