import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import { EditableSpan } from "common/components"
import s from "./TodolistTitle.module.css"
import { DomainTodolist } from "../../../../api/todolistsApi.types"
import { todolistsApi, useDeleteTodolistMutation, useUpdateTodolistMutation } from "../../../../api/todolistsApi"
import { RequestStatus } from "../../../../../../app/appSlice"
import { useAppDispatch } from "common/hooks"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { title, id, entityStatus } = todolist

  const [deleteTodolist] = useDeleteTodolistMutation()
  const [updateTodolist] = useUpdateTodolistMutation()
  const dispatch = useAppDispatch()

  const updateStatus = (status: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((tl) => tl.id === id)
        if (todolist) todolist.entityStatus = status
      }),
    )
  }

  const removeTodolistHandler = () => {
    updateStatus("loading")
    deleteTodolist(id)
      .unwrap()
      .catch(() => {
        updateStatus("idle")
      })
  }
  const updateTodolistHandler = (title: string) => {
    updateTodolist({ id, title })
  }

  return (
    <div className={s.container}>
      <h3>
        <EditableSpan value={title} onChange={updateTodolistHandler} disabled={entityStatus === "loading"} />
      </h3>
      <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
