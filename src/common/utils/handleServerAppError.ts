import { BaseResponse } from "common/types"
import { Dispatch } from "redux"
import { setAppError, setAppStatus } from "../../app/app-reducer"

export const handleServerAppError = <T>(data: BaseResponse<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppError(data.messages[0]))
  } else {
    dispatch(setAppError("Some error occurred"))
  }
  dispatch(setAppStatus("failed"))
}
