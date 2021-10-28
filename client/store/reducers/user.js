import { GET_USER } from '../types';

const initialState = {
  user: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};
