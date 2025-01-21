import authReducer, { initialState, setIsInitialized, setLoggedIn } from "../auth-reducer"

let initState: typeof initialState

beforeEach(() => {
  initState = {
    isLoggedIn: false,
    isInitialized: false,
  }
})

test('value isLoggedIn should change', () => {
  let endState = authReducer(initialState, setLoggedIn(true))

  expect(endState.isLoggedIn).toBe(true)
})

test('value isInitialized should change', () => {
  let endState = authReducer(initialState, setIsInitialized(true))

  expect(endState.isInitialized).toBe(true)
})