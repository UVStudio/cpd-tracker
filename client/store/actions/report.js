import axios from 'axios';
import { CURRENT_IP } from '../../serverConfig';
import { REPORT_AVAILABLE, REPORT_NOT_AVAILABLE } from '../types';

export const buildReport = (year) => {
  return async (dispatch) => {
    const body = { year: year };

    try {
      const response = await axios.post(`${CURRENT_IP}/api/pdf/`, body);

      dispatch({
        type: REPORT_AVAILABLE,
        action: true,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const deleteReport = (pdf) => {
  return async (dispatch) => {
    const body = { pdf: pdf };

    try {
      const response = await axios.put(`${CURRENT_IP}/api/pdf/`, body);

      dispatch({
        type: REPORT_NOT_AVAILABLE,
        action: false,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};
