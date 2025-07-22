import { GET_MESSAGES_SUCCESS, ADD_MESSAGE_SUCCESS } from "../actions/types";

const initialState = {
  messages: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES_SUCCESS:
      return { ...state, messages: action.payload };
    case ADD_MESSAGE_SUCCESS:
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

export default chatReducer;
