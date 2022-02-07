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
import { CHAT_TYPE } from 'core/typings';

export const Chat: React.FC = () => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const {
    state: { chatList },
  } = useContext(WebsocketContext);
  // 标记哪个是当前活跃的
  const [active, setActive] = useState<{ id: number, type: CHAT_TYPE}>({ id: -1, type: CHAT_TYPE.CHAT });

  const handleClickContactCard = (id: number, type: CHAT_TYPE) => {
    history.replace(`${url}/${type}/${id}`);
    setActive({ id, type });
  }

  return (
    <div className={styles.chat}>
      <div className={classNames(styles.contacts, { [styles.emptyContacts]: !chatList.length })}>
        {chatList.length
          ? chatList.map(chat => {
              const { id, members = [], conversations, lastReadedMessageIndex, type, chatGroupInfo } = chat;
              const unReadMessageCount = conversations
                .slice(lastReadedMessageIndex + 1)
                .filter(i => i.receiverId === userInfo.id).length;
              const receiver = type === CHAT_TYPE.CHAT ? members[members?.findIndex(i => i.id === Number(id))] : chatGroupInfo;
              const UserCardContent = (
                <UserCard
                  key={id}
                  userInfo={receiver as UserInfo}
                  className={classNames({
                    [styles.userCard]: true,
                    [styles.active]: active.id === receiver?.id && type === active.type
                  })}
                  onClick={() => handleClickContactCard(receiver?.id as number, type)}
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
            <Route path={`${url}/:chatType/:chatId`}>
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
