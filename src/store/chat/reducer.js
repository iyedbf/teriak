import {
  GET_GROUPS_SUCCESS,
  GET_CHATS_SUCCESS,
  GET_GROUPS_FAIL,
  GET_CHATS_FAIL,
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_FAIL,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  POST_ADD_MESSAGE_SUCCESS,
  POST_ADD_MESSAGE_FAIL,
  DELETE_MESSAGE_FAIL,
  DELETE_MESSAGE_SUCCESS,
  ADD_MESSAGE_SUCCESS, // ← de l'ancienne version
} from "./actionTypes";

const INIT_STATE = {
  chats: [],
  groups: [],
  contacts: [],
  messages: [],
  error: {},
  loading: true,
};

const ChatReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.payload,
        loading: false,
      };

    case GET_CHATS_FAIL:
    case GET_GROUPS_FAIL:
    case GET_CONTACTS_FAIL:
    case GET_MESSAGES_FAIL:
    case POST_ADD_MESSAGE_FAIL:
    case DELETE_MESSAGE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GROUPS_SUCCESS:
      return {
        ...state,
        groups: action.payload,
      };

    case GET_CONTACTS_SUCCESS:
      return {
        ...state,
        contacts: action.payload,
      };

    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.payload,
        loading: false,
      };

    case POST_ADD_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: state.messages.map((item) => ({
          ...item,
          userMessages: [...item.userMessages, action.payload],
        })),
      };

    case ADD_MESSAGE_SUCCESS: // ← ajout simple (ancienne logique)
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: state.messages.map((item) => ({
          ...item,
          userMessages: item.userMessages.filter(
            (data) => data.id !== action.payload
          ),
        })),
      };

    default:
      return state;
  }
};

export default ChatReducer;
