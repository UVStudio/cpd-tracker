import axios from 'axios';
import {
  GET_USER_NONVER_YEAR,
  GET_USER_NONVER,
  ADD_NONVER_SESSION,
  EDIT_NONVER_SESSION,
} from '../types';
import { CURRENT_IP } from '../../serverConfig';

export const getAllNonVerObjsByYear = (year) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/nonver/${year}`);
      const data = response.data.data;

      dispatch({
        type: GET_USER_NONVER_YEAR,
        nonver: data,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const getAllNonVerObjsByUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/nonver/`);
      const data = response.data.data;

      dispatch({
        type: GET_USER_NONVER,
        nonver: data,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const addNonVerSession = (year, date, hours, sessionName) => {
  return async (dispatch) => {
    try {
      const body = { year, date, hours, sessionName };
      const response = await axios.post(`${CURRENT_IP}/api/nonver`, body);

      const data = response.data.data;

      dispatch({
        type: ADD_NONVER_SESSION,
        nonver: data,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const editNonVerSession = (sessionName, id) => {
  return async (dispatch) => {
    try {
      const body = { sessionName };
      const response = await axios.put(`${CURRENT_IP}/api/nonver/${id}`, body);

      const data = response.data.data;

      dispatch({
        type: EDIT_NONVER_SESSION,
        nonver: data,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};
