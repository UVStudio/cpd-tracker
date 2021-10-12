import { AUTHENTICATE, LOGOUT, SET_USER, SET_DID_TRY_AL } from '../types';

const initialState = {
  token: null,
  //userId: null,
  user: {},
  didTryAutoLogin: false,
  //veriCode: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        // userId: action.userId,
        user: action.user,
        didTryAutoLogin: true,
      };
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
      };
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: true,
      };
    default:
      return state;
  }
};
