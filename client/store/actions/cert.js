import axios from 'axios';
import { GET_USER_CERTS, GET_USER_CERTS_YEAR } from '../types';
import { CURRENT_IP } from '../../serverConfig';

export const saveVerCourse = (year, hours, ethicsHours, courseName, cert) => {
  return async () => {
    try {
      const certName = cert.name;
      const uri = cert.uri;

      let formData = new FormData();

      formData.append('year', year);
      formData.append('hours', hours);
      formData.append('ethicsHours', ethicsHours);
      formData.append('courseName', courseName);
      formData.append('cert', {
        uri: `${uri}`,
        type: '*/*',
        name: `${certName}`,
      });

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      //console.log('formData: ', formData);

      await axios.post(`${CURRENT_IP}/api/upload`, formData, config);
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const getAllCertObjsByUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/cert/user`);
      const data = response.data.data;
      dispatch({
        type: GET_USER_CERTS,
        certs: data,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const getAllCertObjsByYear = (year) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/cert/${year}`);
      const data = response.data.data;

      dispatch({
        type: GET_USER_CERTS_YEAR,
        certs: data,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
};
