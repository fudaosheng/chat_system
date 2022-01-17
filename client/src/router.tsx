import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Chat } from 'pages/chat';
import { Contacts } from 'pages/contacts';
import { AppLayout } from './common/layout';
import { Explore } from 'pages/explore';
import { WebsocketProvider } from 'core/store';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <WebsocketProvider>
        <AppLayout>
          <Switch>
            <Route path="/chat">
              <Chat />
            </Route>
            <Route path="/contacts">
              <Contacts />
            </Route>
            <Route path="/explore">
              <Explore />
            </Route>
            <Redirect to="/chat" />
          </Switch>
        </AppLayout>
      </WebsocketProvider>
    </BrowserRouter>
  );
};
