import {
  AUTHENTICATE,
  LOGOUT,
  SET_USER,
  GET_USER,
  GET_VERIFICATION_CODE,
  CODE_VERIFIED,
  SET_NEW_PASSWORD,
  SET_DID_TRY_AL,
  CLEAR_USER_STATE,
} from '../types';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  user: null,
  veriCode: null,
  verified: false,
  newPassword: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        //...state,
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
        //user: action.user,
      };
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
        //user: action.user,
      };
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case GET_USER:
      return {
        ...state,
        user: action.user,
      };
    case GET_VERIFICATION_CODE:
      return {
        ...state,
        veriCode: action.veriCode,
      };
    case CODE_VERIFIED:
      return {
        ...state,
        verified: action.verified,
      };
    case SET_NEW_PASSWORD:
      return {
        ...state,
        newPassword: action.newPassword,
      };
    case CLEAR_USER_STATE:
      return {
        ...initialState,
        //didTryAutoLogin: false,
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: true,
        //set to false to prevent logout Auth screen artifacts
      };
    default:
      return state;
  }
};
