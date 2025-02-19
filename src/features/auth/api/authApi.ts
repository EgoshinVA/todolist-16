import { LoginArgs } from "./authApi.types"
import { BaseResponse } from "common/types"
import { baseApi } from "../../../app/baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginArgs>({
      query: (payload) => ({
        url: "auth/login",
        method: "POST",
        body: payload,
      }),
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => ({
        url: "auth/login",
        method: "DELETE",
      }),
    }),
    authMe: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me",
    }),
  }),
})

export const {useLoginMutation, useLogoutMutation, useAuthMeQuery} = authApi