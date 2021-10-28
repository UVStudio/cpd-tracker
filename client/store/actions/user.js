import axios from 'axios';
import { GET_USER } from '../types';
import { CURRENT_IP } from '../../serverConfig';

export const overrideHours = (year, certHours, nonVerHours, ethicsHours) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ year, certHours, nonVerHours, ethicsHours });

    //console.log('body: ', body);

    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/user/override`,
        body,
        config
      );

      //console.log('response: ', response);
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const getUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/auth/current`);
      const user = response.data.data;

      //console.log('user: ', user);

      dispatch({
        type: GET_USER,
        user: user,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};
