import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import React from "react"
import { AddItemForm } from "common/components"
import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { useCreateTodolistMutation } from "../features/todolists/api/todolistsApi"

export const Main = () => {
  const [addTodolist] = useCreateTodolistMutation()

  const addTodolistHandler = (title: string) => {
    addTodolist(title)
  }

  return (
    <Container fixed>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
