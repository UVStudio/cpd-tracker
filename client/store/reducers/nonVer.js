import { GET_USER_NONVER_YEAR, ADD_NONVER_SESSION } from '../types';

const initialState = {
  nonver: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_NONVER_YEAR:
      return {
        ...state,
        nonver: action.nonver,
      };
    case ADD_NONVER_SESSION:
      return {
        ...state,
        nonver: action.nonver,
      };
    default:
      return state;
  }
};
