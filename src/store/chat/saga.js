import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  GET_MESSAGES,
  ADD_MESSAGE,
} from "./actionTypes";
import {
  GET_MESSAGES_SUCCESS,
  ADD_MESSAGE_SUCCESS,
} from "./actionTypes";

function* fetchMessages({ payload: roomId }) {
  try {
    const response = yield call(() =>
      axios.get(`/api/messages/room/${roomId}`)
    );
    yield put({ type: GET_MESSAGES_SUCCESS, payload: response.data.messages });
  } catch (error) {
    console.error("Erreur getMessages:", error);
  }
}

function* postMessage({ payload: message }) {
  try {
    const response = yield call(() =>
      axios.post("/api/messages", message)
    );
    yield put({ type: ADD_MESSAGE_SUCCESS, payload: response.data.message });
  } catch (error) {
    console.error("Erreur addMessage:", error);
  }
}

function* chatSaga() {
  yield takeEvery(GET_MESSAGES, fetchMessages);
  yield takeEvery(ADD_MESSAGE, postMessage);
}

export default chatSaga;
