import React, { useContext, useMemo, useState } from 'react';
import { Input, Popover } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import { GlobalContext } from 'common/store';
import { searchContactByName } from 'common/utils';
import { UserCard } from 'components/userCard';
import { debounce } from 'lodash';
import { WebsocketContext } from 'core/store';
import { WebsocketAction } from 'core/store/action';
import { CHAT_TYPE } from 'core/typings';
import { useHistory } from 'react-router-dom';

export const Searcher: React.FC = () => {
  const {
    state: { contactGroupList, chatGroupList },
  } = useContext(GlobalContext);
  const { dispatch } = useContext(WebsocketContext); 
  const history = useHistory();

  // 匹配到的联系人列表
  const [matchContactList, setMatchContactList] = useState<Array<UserInfo>>([]);
  // 匹配到的群聊列表
  const [matchChatList, setMatchChatList] = useState<Array<ChatGroup>>([]);

  const contactList = useMemo(() => {
    return contactGroupList.reduce((preList, current) => {
      return preList.concat(current?.children || []);
    }, [] as Array<UserInfoExtra>);
  }, [contactGroupList]);
  //搜索
  const handleSearch = debounce((value: string) => {
    if (!value || value === ' ') {
      return;
    }
    setMatchContactList([...(searchContactByName(contactList, value) || [])]);
    setMatchChatList([...(chatGroupList?.filter(i => i.name.includes(value)) || [])]);
  }, 1000);

  // 创建会话
  const handleCreateChat = (item: UserInfo | ChatGroup, type: CHAT_TYPE) => {
    if(type === CHAT_TYPE.CHAT) {
      dispatch(WebsocketAction.createChat(item.id, CHAT_TYPE.CHAT, [item as UserInfo]));
    } 
    if(type === CHAT_TYPE.CHAT_GROUP) {
      dispatch(WebsocketAction.createChat(item.id, CHAT_TYPE.CHAT_GROUP, [], item as ChatGroup));
    }
    const { pathname } = window.location;
    if(pathname !== '/chat') {
      history.push(`/chat/${type}/${item.id}`);
    }
  };

  const renderList = (list: Array<UserInfo>, type: CHAT_TYPE) => {
    return list.length ? (
      list.map(i => (
        <UserCard
          className={styles.userCard}
          key={`${type}-${i.id}`}
          userInfo={i}
          onClick={() => handleCreateChat(i, type)}
        />
      ))
    ) : (
      <span className={styles.empty}>暂无内容</span>
    );
  };

  const renderContent = () => {
    return (
      <div className={styles.searchResult}>
        <div className={styles.title}>联系人</div>
        <div className={styles.wrapper}>{renderList(matchContactList, CHAT_TYPE.CHAT)}</div>
        <div className={styles.title} style={{ marginTop: 12 }}>
          群聊
        </div>
        <div className={styles.wrapper}>{renderList(matchChatList as unknown as Array<UserInfo>, CHAT_TYPE.CHAT_GROUP)}</div>
      </div>
    );
  };
  return (
    <Popover trigger="focus" position="bottomLeft" content={renderContent()}>
      <Input
        placeholder="搜索联系人/群组"
        className={styles.searcher}
        prefix={<IconSearch />}
        onChange={handleSearch}
      />
    </Popover>
  );
};
