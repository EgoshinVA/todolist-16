import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { Dispatch } from "redux"
import { setAppStatus } from "../../../app/app-reducer"
import { RootState } from "../../../app/store"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../api/tasksApi.types"
import { addTodolist, clearData, removeTodolist } from "./todolists-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Todolist } from "../api/todolistsApi.types"

export type TasksStateType = {
  [key: string]: DomainTask[]
}

const initialState: TasksStateType = {}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<{ todolistId: string; tasks: DomainTask[] }>) {
      state[action.payload.todolistId] = action.payload.tasks
    },
    removeTask(state, action: PayloadAction<{ taskId: string; todolistId: string }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId].filter((t) => t.id !== action.payload.taskId)
    },
    addTask(state, action: PayloadAction<{ task: DomainTask }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTask(
      state,
      action: PayloadAction<{
        taskId: string
        todolistId: string
        domainModel: UpdateTaskDomainModel
      }>,
    ) {
      state[action.payload.todolistId] = state[action.payload.todolistId].map((t) =>
        t.id === action.payload.taskId
          ? {
              ...t,
              ...action.payload.domainModel,
            }
          : t,
      )
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeTodolist, (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    })
    builder.addCase(clearData, () => {
      return {}
    })
    builder.addCase(addTodolist, (state, action: PayloadAction<Todolist>) => {
      return {...state, [action.payload.id]: []}
    })
  },
})

export const { setTasks, updateTask, removeTask, addTask } = tasksSlice.actions

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  tasksApi
    .getTasks(todolistId)
    .then((res) => {
      dispatch(setAppStatus("succeeded"))
      dispatch(setTasks({ todolistId, tasks: res.data.items }))
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const removeTaskTC = (arg: { taskId: string; todolistId: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  tasksApi
    .deleteTask(arg)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus("succeeded"))
        dispatch(removeTask(arg))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const addTaskTC = (arg: { title: string; todolistId: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  tasksApi
    .createTask(arg)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus("succeeded"))
        dispatch(addTask({ task: res.data.data.item }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const updateTaskTC =
  (arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const { taskId, todolistId, domainModel } = arg

    const allTasksFromState = getState().tasks
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find((t: DomainTask) => t.id === taskId)

    if (task) {
      const model: UpdateTaskModel = {
        status: task.status,
        title: task.title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        ...domainModel,
      }

      dispatch(setAppStatus("loading"))
      tasksApi
        .updateTask({ taskId, todolistId, model })
        .then((res) => {
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatus("succeeded"))
            dispatch(updateTask(arg))
          } else {
            handleServerAppError(res.data, dispatch)
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch)
        })
    }
  }

export default tasksSlice.reducer
