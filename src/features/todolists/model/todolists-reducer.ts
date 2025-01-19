import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { Dispatch } from "redux"
import { RequestStatus, setAppStatus } from "../../../app/app-reducer"
import { todolistsApi } from "../api/todolistsApi"
import { Todolist } from "../api/todolistsApi.types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValuesType
  entityStatus: RequestStatus
}

const initialState: DomainTodolist[] = []

const todolistsSlice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    removeTodolist(state, action: PayloadAction<string>) {
      return state.filter((tl) => tl.id !== action.payload)
    },
    addTodolist(state, action: PayloadAction<Todolist>) {
      state.unshift({ ...action.payload, filter: "all", entityStatus: "idle" })
    },
    changeTodolistTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
    },
    changeTodolistFilter(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl))
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string; entityStatus: RequestStatus }>) {
      return state.map((tl) =>
        tl.id === action.payload.id ? { ...tl, entityStatus: action.payload.entityStatus } : tl,
      )
    },
    setTodolists(state, action: PayloadAction<Todolist[]>) {
      return action.payload.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
    },
    clearData(state) {
      return []
    },
  },
})

export const {
  changeTodolistFilter,
  changeTodolistEntityStatus,
  changeTodolistTitle,
  removeTodolist,
  addTodolist,
  setTodolists,
  clearData,
} = todolistsSlice.actions

// Thunks

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  todolistsApi
    .getTodolists()
    .then((res) => {
      dispatch(setAppStatus("succeeded"))
      dispatch(setTodolists(res.data))
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  todolistsApi
    .createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus("succeeded"))
        dispatch(addTodolist(res.data.data.item))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  dispatch(changeTodolistEntityStatus({ id, entityStatus: "loading" }))
  todolistsApi
    .deleteTodolist(id)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus("succeeded"))
        dispatch(removeTodolist(id))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      dispatch(changeTodolistEntityStatus({ id, entityStatus: "failed" }))
      handleServerNetworkError(error, dispatch)
    })
}

export const updateTodolistTitleTC = (arg: { id: string; title: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  todolistsApi
    .updateTodolist(arg)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus("succeeded"))
        dispatch(changeTodolistTitle(arg))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export default todolistsSlice.reducer