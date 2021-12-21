import axios from 'axios';
import {
  GET_USER_CERTS,
  ADD_USER_CERT,
  GET_USER_CERTS_YEAR,
  EDIT_CERT_COURSE,
  DELETE_CERT_COURSE,
} from '../types';
import { CURRENT_IP } from '../../serverConfig';

export const saveVerCourse = (year, hours, ethicsHours, courseName, cert) => {
  return async (dispatch) => {
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

      const response = await axios.post(
        `${CURRENT_IP}/api/upload`,
        formData,
        config
      );
      const data = response.data.data;

      dispatch({
        type: ADD_USER_CERT,
        certs: data,
      });
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

export const editCertCourseById = (courseName, hours, id) => {
  return async (dispatch) => {
    try {
      const body = { courseName, hours };

      const response = await axios.put(`${CURRENT_IP}/api/cert/${id}`, body);
      const data = response.data.data.certsYear;

      dispatch({
        type: EDIT_CERT_COURSE,
        certs: data,
      });
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const certUpdateById = (courseName, cert, id) => {
  return async (dispatch) => {
    try {
      const certName = cert.name;
      const uri = cert.uri;

      let formData = new FormData();

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

      const response = await axios.put(
        `${CURRENT_IP}/api/upload/${id}`,
        formData,
        config
      );
      const data = response.data.data;

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
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${CURRENT_IP}/api/cert/${id}`);
      const data = response.data.data;

      dispatch({
        type: DELETE_CERT_COURSE,
        certs: data,
      });
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
