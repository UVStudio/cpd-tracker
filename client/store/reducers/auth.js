import {
  AUTHENTICATE,
  LOGOUT,
  SET_USER,
  GET_USER,
  GET_VERIFICATION_CODE,
  CODE_VERIFIED,
  ACTIVATE,
  SET_NEW_PASSWORD,
  SET_DID_TRY_AL,
  DATA_REFRESH,
  CLEAR_DATA_REFRESH,
  CLEAR_USER_STATE,
} from '../types';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  user: null,
  veriCode: null,
  verified: false,
  activate: false,
  newPassword: false,
  dataRefresh: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
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
    case ACTIVATE:
      return {
        ...state,
        activate: action.activate,
      };
    case SET_NEW_PASSWORD:
      return {
        ...state,
        newPassword: action.newPassword,
      };
    case DATA_REFRESH:
      return {
        ...state,
        dataRefresh: true,
      };
    case CLEAR_DATA_REFRESH:
      return {
        ...state,
        dataRefresh: false,
      };
    case CLEAR_USER_STATE:
      return {
        ...initialState,
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: false,
        //set to false to prevent logout Auth screen artifacts
      };
    default:
      return state;
  }
};
