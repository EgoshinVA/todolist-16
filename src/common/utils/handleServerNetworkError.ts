import { Dispatch } from "redux"
import { setAppError, setAppStatus } from "../../app/app-reducer"

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setAppError(error.message))
  dispatch(setAppStatus("failed"))
}
