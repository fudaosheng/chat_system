import React, { createContext, Dispatch, memo, useReducer } from 'react';
import { GlobalAction } from './action';
import { reducer as globalReducer } from './reducer';

export interface GlobalState {
    userInfo: Record<string, any>;
}

const initState: GlobalState = {
    userInfo: {}
}

interface ContextType {
    state: GlobalState;
    dispatch: Dispatch<GlobalAction>;
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