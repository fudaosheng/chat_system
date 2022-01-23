import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Chat } from 'pages/chat';
import { Contacts } from 'pages/contacts';
import { AppLayout } from './common/layout';
import { Explore } from 'pages/explore';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};
