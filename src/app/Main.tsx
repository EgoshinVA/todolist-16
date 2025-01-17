import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import React, { useEffect } from "react"
import { AddItemForm } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { addTodolistTC } from "../features/todolists/model/todolists-reducer"
import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { selectIsLoggedIn } from "../features/auth/model/authSelectors"
import { useNavigate } from "react-router"
import { Path } from "common/routing/Routing"

export const Main = () => {
  const dispatch = useAppDispatch()

  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const navigate = useNavigate()

  const addTodolist = (title: string) => {
    dispatch(addTodolistTC(title))
  }

  useEffect(() => {
    if (!isLoggedIn) navigate(Path.Login)
  }, [isLoggedIn])

  return (
    <Container fixed>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
