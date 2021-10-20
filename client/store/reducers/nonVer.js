import { ADD_NONVER_SESSION, GET_NONVER_SESSION } from '../types';

const initialState = {
  hours: [],
  nonver: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_NONVER_SESSION:
      return {
        ...state,
        nonver: action.sessions,
      };
    case ADD_NONVER_SESSION:
      return {
        ...state,
        nonver: action.sessions,
      };
    default:
      return state;
  }
};
