import React, { useContext, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import classNames from 'classnames';
import { Badge } from '@douyinfe/semi-ui';
import { EmptyContent, NoContacts } from 'components/empty';
import { UserCard } from 'components/userCard';
import { WebsocketContext } from 'core/store';
import { Conversations } from 'pages/conversations';
import { GlobalContext } from 'common/store';
import styles from './index.module.scss';

export const Chat: React.FC = () => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const {
    state: { chatList },
  } = useContext(WebsocketContext);
  const [activeContactId, setActiveContactId] = useState(-1);

  const handleClickContactCard = (contactInfo: UserInfo) => {
    history.replace(`${url}/${contactInfo.id}`);
    setActiveContactId(contactInfo.id);
  }

  return (
    <div className={styles.chat}>
      <div className={classNames(styles.contacts, { [styles.emptyContacts]: !chatList.length })}>
        {chatList.length
          ? chatList.map(chat => {
              const { id, receiver, conversations, lastReadedMessageIndex } = chat;
              const unReadMessageCount = conversations
                .slice(lastReadedMessageIndex + 1)
                .filter(i => i.receiverId === userInfo.id).length;
              const UserCardContent = (
                <UserCard
                  key={id}
                  userInfo={receiver}
                  className={classNames({
                    [styles.userCard]: true,
                    [styles.active]: activeContactId === receiver.id
                  })}
                  onClick={() => handleClickContactCard(receiver)}
                />
              );
              return unReadMessageCount ? (
                <Badge type="danger" count={unReadMessageCount} overflowCount={99}>
                  {UserCardContent}
                </Badge>
              ) : (
                UserCardContent
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
