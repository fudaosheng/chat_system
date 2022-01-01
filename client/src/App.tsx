import React, { useContext, useEffect } from 'react';
import './App.css';
import { AppRouter } from './router';
import { Login } from 'components/login';
import { LOCAL_STORAGE_USER_INFO } from 'common/constance/localStorage';
import { GlobalContext } from 'common/store';
import { GlobalAction } from 'common/store/action';

const App: React.FC = () => {
  const { dispatch } = useContext(GlobalContext);
  useEffect(() => {
    // 从缓存中读取用户信息
    const userInfoJSON = localStorage.getItem(LOCAL_STORAGE_USER_INFO);
    const userInfo = userInfoJSON ? JSON.parse(userInfoJSON) : undefined;
    if(userInfo) {
      dispatch(GlobalAction.setUserInfo(userInfo));
    }
  }, []);


  return (
    <div className="App">
      <AppRouter />
      <Login />
    </div>
  );
}

export default App;
