import { Todolist } from "../../api/todolistsApi.types"
import tasksReducer, { TasksStateType } from "../tasks-reducer"
import todolistsReducer, { addTodolist, DomainTodolist } from "../todolists-reducer"

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: DomainTodolist[] = []

  const todolist: Todolist = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  }

  const action = addTodolist(todolist)

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.id)
  expect(idFromTodolists).toBe(action.payload.id)
})
