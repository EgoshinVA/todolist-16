import { BaseResponse } from "common/types"
import { DomainTodolist, Todolist } from "./todolistsApi.types"
import { baseApi } from "../../../app/baseApi"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      providesTags: ["Todolist"],
      transformResponse: (data: Todolist[]): DomainTodolist[] => {
        return data.map((tl) => ({ ...tl, entityStatus: "idle", filter: "all" }))
      },
    }),
    updateTodolist: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `todo-lists/${id}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
    createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({
        url: "todo-lists",
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
    deleteTodolist: build.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `todo-lists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const { useGetTodolistsQuery, useCreateTodolistMutation, useUpdateTodolistMutation, useDeleteTodolistMutation } =
  todolistsApi
