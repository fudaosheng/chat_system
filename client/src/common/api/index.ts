import { Toast } from '@douyinfe/semi-ui';
import axios, {AxiosRequestConfig} from 'axios';
import { STATUS_CODES } from 'common/constance';

export function request(config: AxiosRequestConfig) {
    const install = axios.create({
        timeout: 2000,
    });
    install.interceptors.request.use(data => {
        return data;
    }, err => {
        return err
    });
    install.interceptors.response.use(data => {
        if(data?.data?.code !== STATUS_CODES.SUCCESS) {
            Toast.error(data?.data?.message || 'System error');
            throw data;
        }
        return data?.data;
    }, err => {
        throw err;
    });
    return install(config);
}

export default request;