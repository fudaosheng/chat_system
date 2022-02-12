import { Toast } from '@douyinfe/semi-ui';
import axios, { AxiosRequestConfig } from 'axios';
import { STATUS_CODES } from 'common/constance';
import { LOCAL_STORAGE_USER_TOKEN } from 'common/constance/localStorage';

const formatURLQuery = (obj: Record<string, string>): string => {
  return Object.entries(obj || {}).map(item => item.join('=')).join('&');
}

export interface BaseResponse {
  code: number;
  message: string;
  data: any;
}

export function request(config: AxiosRequestConfig): Promise<BaseResponse> {
  const install = axios.create({
    baseURL: '/api',
    timeout: 2000,
  });
  install.interceptors.request.use(
    data => {
      if (data?.headers) {
        const token = localStorage.getItem(LOCAL_STORAGE_USER_TOKEN);
        if (token) {
          data.headers['Authorization'] = 'Bearer ' + token;
        }
      }
      if(data?.method?.toLocaleUpperCase() === 'GET' && config.data) {;
        data.url = data.url + '?' + formatURLQuery(config.data);
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
      Toast.error(err?.message || 'System error');
      throw err;
    }
  );
  return install(config) as unknown as Promise<BaseResponse>;
}

export default request;
