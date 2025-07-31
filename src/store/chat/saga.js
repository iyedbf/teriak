import { takeEvery, put, call } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";

import {
  DELETE_MESSAGE,
  GET_CHATS,
  GET_CONTACTS,
  GET_GROUPS,
  GET_MESSAGES,
  ADD_MESSAGE,
  ADD_MESSAGE_SUCCESS,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
} from "./actionTypes";

import {
  getChatsSuccess,
  getChatsFail,
  getGroupsSuccess,
  getGroupsFail,
  getContactsSuccess,
  getContactsFail,
  deleteMessageSuccess,
  deleteMessageFail,
} from "./actions";

// GET CHATS (depuis API backend)
function* onGetChats() {
  try {
    const res = yield call(() => axios.get("/api/users"));
    yield put(getChatsSuccess(res.data));
  } catch (error) {
    yield put(getChatsFail(error.message));
  }
}

// GET GROUPS (tu peux adapter selon ton besoin réel)
function* onGetGroups() {
  try {
    const res = yield call(() => axios.get("/api/groups")); // à adapter si tu n’as pas ça
    yield put(getGroupsSuccess(res.data));
  } catch (error) {
    yield put(getGroupsFail(error.message));
  }
}

// GET CONTACTS (ex : tous les utilisateurs sauf moi)
function* onGetContacts() {
  try {
    const res = yield call(() => axios.get("/api/users")); // à adapter
    yield put(getContactsSuccess(res.data));
  } catch (error) {
    yield put(getContactsFail(error.message));
  }
}

// GET MESSAGES d’une room
function* fetchMessages({ payload: roomId }) {
  try {
    const res = yield call(() => axios.get(`/api/messages/room/${roomId}`));
    yield put({ type: GET_MESSAGES_SUCCESS, payload: res.data.messages });
  } catch (error) {
    yield put({ type: GET_MESSAGES_FAIL, payload: error.message });
  }
}

// POST MESSAGE
function* postMessage({ payload: message }) {
  try {
    const res = yield call(() => axios.post("/api/messages", message));
    yield put({ type: ADD_MESSAGE_SUCCESS, payload: res.data.message });
  } catch (error) {
    console.error("Erreur ajout message :", error.message);
  }
}

// DELETE MESSAGE
function* onDeleteMessage({ payload: message }) {
  try {
    const res = yield call(() => axios.delete(`/api/messages/${message._id}`));
    yield put(deleteMessageSuccess(res.data));
    toast.success("Message supprimé");
  } catch (error) {
    yield put(deleteMessageFail(error.message));
    toast.error("Erreur suppression message");
  }
}

// Root saga
function* chatSaga() {
  yield takeEvery(GET_CHATS, onGetChats);
  yield takeEvery(GET_GROUPS, onGetGroups);
  yield takeEvery(GET_CONTACTS, onGetContacts);
  yield takeEvery(GET_MESSAGES, fetchMessages);
  yield takeEvery(ADD_MESSAGE, postMessage);
  yield takeEvery(DELETE_MESSAGE, onDeleteMessage);
}

export default chatSaga;
