import {
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
} from "../actions"

const initialState = {
  users: [],
  loading: true,
  error: null,
}

const users = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return { ...state, loading: true }

    case GET_USERS_SUCCESS:
      return { ...state, users: action.payload, loading: false }

    case GET_USERS_FAIL:
      return { ...state, error: action.payload, loading: false }

    default:
      return state
  }
}

export default users
