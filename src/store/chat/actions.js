import {
  GET_CHATS,
  GET_CHATS_FAIL,
  GET_CHATS_SUCCESS,
  GET_GROUPS,
  GET_GROUPS_FAIL,
  GET_GROUPS_SUCCESS,
  GET_CONTACTS,
  GET_CONTACTS_FAIL,
  GET_CONTACTS_SUCCESS,
  GET_MESSAGES,
  GET_MESSAGES_FAIL,
  GET_MESSAGES_SUCCESS,
  POST_ADD_MESSAGE,
  POST_ADD_MESSAGE_FAIL,
  POST_ADD_MESSAGE_SUCCESS,
  DELETE_MESSAGE,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAIL,
  ADD_MESSAGE,
  ADD_MESSAGE_SUCCESS
} from "./actionTypes";

// Chats
export const getChats = () => ({
  type: GET_CHATS,
});

export const getChatsSuccess = (chats) => ({
  type: GET_CHATS_SUCCESS,
  payload: chats,
});

export const getChatsFail = (error) => ({
  type: GET_CHATS_FAIL,
  payload: error,
});

// Groups
export const getGroups = () => ({
  type: GET_GROUPS,
});

export const getGroupsSuccess = (groups) => ({
  type: GET_GROUPS_SUCCESS,
  payload: groups,
});

export const getGroupsFail = (error) => ({
  type: GET_GROUPS_FAIL,
  payload: error,
});

// Contacts
export const getContacts = () => ({
  type: GET_CONTACTS,
});

export const getContactsSuccess = (contacts) => ({
  type: GET_CONTACTS_SUCCESS,
  payload: contacts,
});

export const getContactsFail = (error) => ({
  type: GET_CONTACTS_FAIL,
  payload: error,
});

// Messages
export const getMessages = (roomId) => ({
  type: GET_MESSAGES,
  payload: roomId,
});

export const getMessagesSuccess = (messages) => ({
  type: GET_MESSAGES_SUCCESS,
  payload: messages,
});

export const getMessagesFail = (error) => ({
  type: GET_MESSAGES_FAIL,
  payload: error,
});

// Post message (API)
export const addMessage = (message) => ({
  type: POST_ADD_MESSAGE,
  message,
});

export const addMessageSuccess = (message) => ({
  type: POST_ADD_MESSAGE_SUCCESS,
  payload: message,
});

export const addMessageFail = (error) => ({
  type: POST_ADD_MESSAGE_FAIL,
  payload: error,
});

// Add message (Socket or direct)
export const sendMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const sendMessageSuccess = (message) => ({
  type: ADD_MESSAGE_SUCCESS,
  payload: message,
});

// DELETE
export const deleteMessage = (data) => ({
  type: DELETE_MESSAGE,
  payload: data,
});

export const deleteMessageSuccess = (data) => ({
  type: DELETE_MESSAGE_SUCCESS,
  payload: data,
});

export const deleteMessageFail = (error) => ({
  type: DELETE_MESSAGE_FAIL,
  payload: error,
});
