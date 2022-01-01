export enum GLOBAL_OPERATION_TYPE {
    SET_USER_INFO,
}

export interface GlobalActionType {
    type: GLOBAL_OPERATION_TYPE;
    payload: any;
}

export const GlobalAction = {
    setUserInfo(userInfo: UserInfo): GlobalActionType {
        return {
            type: GLOBAL_OPERATION_TYPE.SET_USER_INFO,
            payload: userInfo
        }
    }
}