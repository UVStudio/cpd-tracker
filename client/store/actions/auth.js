import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTHENTICATE,
  SET_DID_TRY_AL,
  LOGOUT,
  SET_USER,
  GET_VERIFICATION_CODE,
  CODE_VERIFIED,
  SET_NEW_PASSWORD,
} from '../types';
import { CURRENT_IP } from '../../serverConfig';

let timer;
const oneMonth = 30 * 24 * 60 * 60 * 1000;

export const authenticate = (token, userId, expiryTime, user) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, token, userId, user });
    dispatch({ type: SET_USER, user: user });
  };
};

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const register = (
  name,
  email,
  province,
  cpdMonth,
  cpdYear,
  password
) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      name,
      email,
      province,
      cpdMonth,
      cpdYear,
      password,
    });

    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/`,
        body,
        config
      );

      const resData = response.data;

      await dispatch(
        authenticate(resData.token, resData.user._id, oneMonth, resData.user)
      );
      const expirationDate = resData.options.expires;
      await saveDataToStorage(
        resData.token,
        resData.user._id,
        expirationDate,
        resData.user
      );
      await dispatch(setUser(resData.user));
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });
    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/login`,
        body,
        config
      );

      const resData = response.data;

      await dispatch(
        authenticate(resData.token, resData.user._id, oneMonth, resData.user)
      );
      const expirationDate = resData.options.expires;
      await saveDataToStorage(
        resData.token,
        resData.user._id,
        expirationDate,
        resData.user
      );
      await dispatch(setUser(resData.user));
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const setUser = (resData) => {
  return (dispatch) => {
    dispatch({
      type: SET_USER,
      user: resData,
    });
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

export const forgotPassword = (email) => {
  return async (dispatch) => {
    const body = JSON.stringify({ email });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/forgotpassword`,
        body,
        config
      );

      const veriCode = response.data.data;

      dispatch({
        type: GET_VERIFICATION_CODE,
        veriCode: veriCode,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const verifyCode = (code) => {
  return async (dispatch) => {
    const body = JSON.stringify({ code });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/forgotpassword/${code}`,
        body,
        config
      );

      const verified = response.data.success;

      dispatch({
        type: CODE_VERIFIED,
        verified: verified,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const setNewPassword = (password, passwordConfirm, veriCode) => {
  return async (dispatch) => {
    if (password != passwordConfirm) {
      return new Error(
        'Please check your new password fields to make sure they are the same.'
      );
    }

    const body = JSON.stringify({ password });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/auth/forgotpassword/${veriCode}`,
        body,
        config
      );

      const success = response.data.success;

      dispatch({
        type: SET_NEW_PASSWORD,
        newPassword: success,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const deleteCurrentUser = () => {
  return async (dispatch) => {
    dispatch(logout());
    try {
      await axios.delete(`${CURRENT_IP}/api/auth/`);
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

/** UTILS */
const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate, resData) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate,
      user: resData,
    })
  );
};
