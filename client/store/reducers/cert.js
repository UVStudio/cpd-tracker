import { GET_USER_CERTS, GET_USER_CERTS_YEAR } from '../types';

const initialState = {
  certs: [],
  certsYear: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_CERTS:
      return {
        ...state,
        certs: action.certs,
      };
    case GET_USER_CERTS_YEAR:
      return {
        ...state,
        certsYear: action.certs,
      };
    default:
      return state;
  }
};
