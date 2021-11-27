import {
  GET_USER_CERTS,
  GET_USER_CERTS_YEAR,
  EDIT_CERT_COURSE,
} from '../types';

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
        certs: action.certs,
      };
    case EDIT_CERT_COURSE:
      return {
        ...state,
        certs: action.certs,
      };
    default:
      return state;
  }
};
