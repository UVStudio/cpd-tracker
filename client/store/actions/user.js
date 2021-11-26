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

    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/user/override`,
        body,
        config
      );
      const user = response.data.data;

      dispatch({
        type: GET_USER,
        user: user,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const getUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/auth/`);
      const user = response.data.data;

      dispatch({
        type: GET_USER,
        user: user,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const updateUser = (formState) => {
  return async (dispatch) => {
    const { name, email, province, cpdYear, cpdMonth } = formState.inputValues;

    try {
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
      });

      const response = await axios.put(`${CURRENT_IP}/api/auth/`, body, config);
      const user = response.data.data;

      dispatch({
        type: GET_USER,
        user: user,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const updatePassword = (passwordFormState) => {
  return async () => {
    const { oldPassword, newPassword, confirmPassword } =
      passwordFormState.inputValues;

    if (newPassword !== confirmPassword) {
      return new Error(
        'Please check your new password fields to make sure they are the same.'
      );
    }

    const body = JSON.stringify({ oldPassword, newPassword });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.put(`${CURRENT_IP}/api/auth/password`, body, config);
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};
