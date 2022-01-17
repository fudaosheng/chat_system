import classNames from 'classnames';
import { EmptyContent, NoContacts } from 'components/empty';
import { UserCard } from 'components/userCard';
import { WebsocketContext } from 'core/store';
import { Conversations } from 'pages/conversations';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import styles from './index.module.scss';

export const Chat: React.FC = () => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const {
    state: { chatList },
  } = useContext(WebsocketContext);

  useEffect(() => {
    console.log(window.ws);
  }, [window.ws]);

  return (
    <div className={styles.chat}>
      <div className={classNames(styles.contacts, { [styles.emptyContacts]: !chatList.length })}>
        {chatList.length
          ? chatList.map(({ receiver }) => {
              return (
                <UserCard
                  key={receiver.id}
                  userInfo={receiver}
                  className={styles.userCard}
                  onClick={() => history.replace(`${url}/${receiver.id}`)}
                />
              );
            })
          : NoContacts}
      </div>
      <div className={styles.conversations}>
        {chatList.length ? (
          <Switch>
            <Route path={`${url}/:userId`}>
              <Conversations />
            </Route>
          </Switch>
        ) : (
          EmptyContent
        )}
      </div>
    </div>
  );
};
