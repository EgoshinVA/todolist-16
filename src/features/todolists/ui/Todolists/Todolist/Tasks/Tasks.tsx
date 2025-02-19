import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { Task } from "./Task/Task"
import { DomainTodolist } from "../../../../api/todolistsApi.types"
import { useGetTasksQuery } from "../../../../api/tasksApi"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const {data} = useGetTasksQuery(todolist.id)

  const allTodolistTasks = data?.items

  let tasksForTodolist = allTodolistTasks

  if (todolist.filter === "active") {
    tasksForTodolist = allTodolistTasks?.filter((task) => task.status === TaskStatus.New)
  }

  if (todolist.filter === "completed") {
    tasksForTodolist = allTodolistTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {tasksForTodolist?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {tasksForTodolist?.map((task) => {
            return <Task key={task.id} task={task} todolist={todolist} />
          })}
        </List>
      )}
    </>
  )
}
