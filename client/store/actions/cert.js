import axios from 'axios';
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

//NOT USED
// export const addCPDHours = (year, verifiable, nonVerifiable, ethics) => {
//   return async () => {
//     const body = { year, verifiable, nonVerifiable, ethics };

//     console.log('body: ', body);
//     try {
//       await axios.post(`${CURRENT_IP}/api/cert/hours`, body);
//     } catch (err) {
//       console.log(err.message);
//     }
//   };
// };
