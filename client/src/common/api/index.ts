import axios, {AxiosRequestConfig} from 'axios';

export function request(config: AxiosRequestConfig) {
    const baseURL = 'localhost:8000';

    const install = axios.create({
        baseURL,
        timeout: 2000
    });
    install.interceptors.request.use(data => {
        return data;
    }, err => {
        return err
    });
    install.interceptors.response.use(data => {
        return data;
    }, err => {
        throw err;
    });
    return install(config);
}

export default request;