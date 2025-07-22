import {
  GET_MESSAGES,
  GET_MESSAGES_SUCCESS,
  ADD_MESSAGE,
  ADD_MESSAGE_SUCCESS,
} from "./actionTypes";

// Action pour récupérer les messages d'une room
export const getMessages = (roomId) => ({
  type: GET_MESSAGES,
  payload: roomId,
});

// Action pour ajouter un message
export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});
