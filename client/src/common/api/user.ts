import request, { BaseResponse } from '.';

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

export interface GetUserListResp extends BaseResponse {
  data: Array<UserInfo>;
}
export const getUserListByName = (name: string): Promise<GetUserListResp> => request({
  url: '/user/get/user_list_by_name',
  data: { name }
});

export const getUserById = (id: number): Promise<GetUserListResp> => request({
  url: '/user/get/user_by_id',
  data: { id }
})