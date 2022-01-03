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

export const setUserBio = (bio: string) => request({
  url: '/user/update/bio',
  method: 'POST',
  data: { bio }
});

interface UpdateUserInfoRequest {
  name?: string;
  password?: string;
  birthday?: string;
  sex?: number;
  phone_num?: string;
  avatar?: string;
  bio?: string;
}
export const updateUserInfo = (userInfo: UpdateUserInfoRequest) => request({
  url: '/user/update/info',
  method: 'POST',
  data: userInfo
});