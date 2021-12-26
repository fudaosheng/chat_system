import request from '.';

export interface LoginParams {
  name: string;
  passowrd: string;
}
export const login = (data: LoginParams) => request({
  url: 'user/login',
  method: 'POST',
  data
});
