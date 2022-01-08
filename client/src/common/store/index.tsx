import React, { createContext, Dispatch, memo, useReducer } from 'react';
import { GlobalActionType } from './action';
import { reducer as globalReducer } from './reducer';

export const defaultUserInfo = {
    id: 0,
    token: '',
    name: '',
    avatar: '',
    bio: '',
};
export interface GlobalState {
    userInfo: UserInfo;
}

const initState: GlobalState = {
    userInfo: defaultUserInfo
}

interface ContextType {
    state: GlobalState;
    dispatch: Dispatch<GlobalActionType>;
}
export const GlobalContext = createContext<ContextType>({ state: initState, dispatch: () => {} });
GlobalContext.displayName = 'globalContext';

export const GlobalProvider: React.FC = memo(({ children }) => {
    const [state, dispatch] = useReducer(globalReducer, initState);
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
})