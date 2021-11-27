import axios from 'axios';
import {
  GET_USER_CERTS,
  GET_USER_CERTS_YEAR,
  EDIT_CERT_COURSE,
} from '../types';
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
      throw new Error(err.response.data.error);
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
      throw new Error(err.response.data.error);
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
      throw new Error(err.response.data.error);
    }
  };
};

export const editCertCourseById = (courseName, id) => {
  return async (dispatch) => {
    try {
      const body = { courseName };

      const response = await axios.put(`${CURRENT_IP}/api/cert/${id}`, body);
      const data = response.data.data;

      console.log('data: ', data);

      dispatch({
        type: EDIT_CERT_COURSE,
        certs: data,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const deleteCertObjById = (id) => {
  return async () => {
    try {
      await axios.delete(`${CURRENT_IP}/api/cert/${id}`);
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const deleteUploadByCertImgId = (id) => {
  return async () => {
    try {
      await axios.delete(`${CURRENT_IP}/api/upload/${id}`);
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};
