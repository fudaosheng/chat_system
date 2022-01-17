import React, { useContext, useEffect } from 'react';
import './App.css';
import { AppRouter } from './router';
import { Login } from 'components/login';
import { LOCAL_STORAGE_USER_INFO } from 'common/constance/localStorage';
import { GlobalContext } from 'common/store';
import { GlobalAction } from 'common/store/action';
import { destoryWebsocket, registryWebSocket } from 'core';

const App: React.FC = () => {
  const {
    state: { userInfo },
    dispatch,
  } = useContext(GlobalContext);
  useEffect(() => {
    // 从缓存中读取用户信息
    const userInfoJSON = localStorage.getItem(LOCAL_STORAGE_USER_INFO);
    const userInfo = userInfoJSON ? JSON.parse(userInfoJSON) : undefined;
    if (userInfo) {
      dispatch(GlobalAction.setUserInfo(userInfo));
    }
  }, []);

  useEffect(() => {
    if (!userInfo.id) {
      return;
    }
    //注册websocket
    registryWebSocket(String(userInfo.id));
    // 注销websocket;
    return () => destoryWebsocket();
  }, [userInfo.id]);

  return (
    <div className="App">
      <AppRouter />
      <Login />
    </div>
  );
};

export default App;
