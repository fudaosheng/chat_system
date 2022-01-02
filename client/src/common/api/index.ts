import { Toast } from '@douyinfe/semi-ui';
import axios, { AxiosRequestConfig } from 'axios';
import { STATUS_CODES } from 'common/constance';
import { LOCAL_STORAGE_USER_TOKEN } from 'common/constance/localStorage';

export function request(config: AxiosRequestConfig) {
  const install = axios.create({
    timeout: 2000,
  });
  install.interceptors.request.use(
    data => {
      if (data?.headers) {
        const token = localStorage.getItem(LOCAL_STORAGE_USER_TOKEN);
        console.log('token', token);
        
        if (token) {
          data.headers['Authorization'] = 'Bearer ' + token;
        }
      }

      return data;
    },
    err => {
      return err;
    }
  );
  install.interceptors.response.use(
    data => {
      if (data?.data?.code !== STATUS_CODES.SUCCESS) {
        Toast.error(data?.data?.message || 'System error');
        throw data;
      }
      return data?.data;
    },
    err => {
      throw err;
    }
  );
  return install(config);
}

export default request;
