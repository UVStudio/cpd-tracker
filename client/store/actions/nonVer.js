import axios from 'axios';
import { ADD_NONVER_SESSION, GET_NONVER_SESSION } from '../types';
import { CURRENT_IP } from '../../serverConfig';

export const getNonVerSessions = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/nonver/`);
      const sessions = response.data.data;

      console.log('response data: ', sessions);

      dispatch({
        type: GET_NONVER_SESSION,
        session: sessions,
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

      const sessions = response.data.data;

      dispatch({
        type: ADD_NONVER_SESSION,
        sessions: sessions,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};
