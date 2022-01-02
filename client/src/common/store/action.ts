import { LOCAL_STORAGE_USER_INFO, LOCAL_STORAGE_USER_TOKEN } from 'common/constance/localStorage';
export enum GLOBAL_OPERATION_TYPE {
  SET_USER_INFO,
}

export interface GlobalActionType {
  type: GLOBAL_OPERATION_TYPE;
  payload: any;
}

export const GlobalAction = {
  setUserInfo(userInfo: UserInfo): GlobalActionType {
    // 设置缓存
    localStorage.setItem(LOCAL_STORAGE_USER_INFO, JSON.stringify(userInfo));
    localStorage.setItem(LOCAL_STORAGE_USER_TOKEN, userInfo?.token || '');
    
    return {
      type: GLOBAL_OPERATION_TYPE.SET_USER_INFO,
      payload: userInfo,
    };
  },
};
