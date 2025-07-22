import { call, put, takeEvery } from "redux-saga/effects"
import { GET_USERS } from "../actions"
import { getUsersSuccess, getUsersFail } from "./actions"
import axios from "axios"

function* fetchUsers() {
  try {
    const response = yield call(() =>
      axios.get("http://localhost:5000/api/users") // ou l'URL de ton backend
    )
    yield put(getUsersSuccess(response.data))
  } catch (error) {
    yield put(getUsersFail(error.message))
  }
}

function* usersSaga() {
  yield takeEvery(GET_USERS, fetchUsers)
}

export default usersSaga
