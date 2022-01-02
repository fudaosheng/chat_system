import request from '.';

export interface LoginRequest {
  name: string;
  passowrd: string;
}
export const login = (data: LoginRequest) => request({
  url: 'user/login',
  method: 'POST',
  data
});

export interface RegistryRequest {
  name: string;
  passowrd: string;
}
export const registryUser = (data: RegistryRequest) => request({
  url: '/user/registry',
  method: 'POST',
  data
});


export const setUserAvatar = (avatar: string) => request({
  url: '/user/update/avatar',
  method: 'POST',
  data: { avatar }
});