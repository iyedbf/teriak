import {
  GET_MESSAGES_SUCCESS,
  ADD_MESSAGE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  messages: [],
};

const Chat = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MESSAGES_SUCCESS:
      return { ...state, messages: action.payload };

    case ADD_MESSAGE_SUCCESS:
      return { ...state, messages: [...state.messages, action.payload] };

    default:
      return state;
  }
};

export default Chat;
