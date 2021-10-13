import axios from 'axios';
import { CURRENT_IP } from '../../serverConfig';

export const addCert = (file, year) => {
  return async () => {
    try {
      const fileName = file.name;
      const uri = file.uri;

      let formData = new FormData();

      formData.append('year', JSON.stringify(year));
      formData.append('cert', {
        uri: `${uri}`,
        type: '*/*',
        name: `${fileName}`,
      });

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      console.log('formData: ', formData);

      await axios.post(`${CURRENT_IP}/api/upload`, formData, config);
    } catch (err) {
      console.log(err.message);
    }
  };
};
