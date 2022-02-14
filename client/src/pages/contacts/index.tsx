import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { AvatarColor } from '@douyinfe/semi-ui/avatar';
import { Spin } from '@douyinfe/semi-ui';
import { IconUserAdd, IconUserGroup } from '@douyinfe/semi-icons';
import { AddContactGroup } from './components/addContactGroup';
import styles from './index.module.scss';
import { ContactGroupList } from './components/contactGroupList';
import { AssistantList } from './components/assistantList';
import { ApplyContactTicketList, APPLY_TICKET_TYPE } from './subPages/applyContactTicketList';
import { UserInfo } from './subPages/userInfo';
import { GlobalContext } from 'common/store';
import { getApplyTicketList } from 'common/api/applyContactTicket';
import { makeTreeWithContactList } from 'common/api/contacts';
import { getAllChatGroupApplyTickets } from 'common/api/chatGroupApplyTickets';
import { getChatGroupList } from 'common/api/chatGroup';
import { ChatGroupList } from './components/chatGroupList';
import { ChatGroupInfo } from './subPages/chatGroupInfo';
import { GlobalAction } from 'common/store/action';
const interval = 1000 * 60; //轮询间隔

export interface SystemAssistant {
  icon: ReactElement;
  name: string;
  key: string;
  color: AvatarColor;
  count: number;
}

export const Contacts: React.FC = () => {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const {
    state: { userInfo, contactGroupList, chatGroupList },
    dispatch
  } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  // 联系人申请列表
  const [applyTicketList, setApplyTicketList] = useState<Array<ApplyTicket>>([]);
  // 群聊申请列表
  const [chatGroupApplyTicketList, setChatGroupApplyTicketList] = useState<Array<ChatGroupApplyTicket>>([]);

  // 查询待自己处理的好友申请工单的数量
  const requestApplyContactTicketCount = async () => {
    const [resp1, resp2] = await Promise.all([getApplyTicketList(), getAllChatGroupApplyTickets()]);
    setApplyTicketList(resp1?.data || []);
    setChatGroupApplyTicketList(resp2?.data || []);
  };

  // 轮询获取好友申请工单，和群聊申请工单
  useEffect(() => {
    if (!userInfo.id) {
      return;
    }
    requestApplyContactTicketCount();
    const timer = setInterval(() => {
      requestApplyContactTicketCount();
    }, interval);
    return () => clearInterval(timer);
  }, [userInfo.id]);

  // 获取联系人列表
  const getContactGroupListRequest = async (needLoading = false) => {
    needLoading && setLoading(true);
    try {
      // 将分组和联系人信息进行处理
      const newContactGroupList = await makeTreeWithContactList();
      dispatch(GlobalAction.setContactGroupList(newContactGroupList));
    } finally {
      needLoading && setLoading(false);
    }
  };

  // 获取群聊列表
  const getChatGroupListRequest = async () => {
    try {
      setLoading(true);
      const { data = [] } = await getChatGroupList();
      dispatch(GlobalAction.setChatGroupList(data));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userInfo?.id) {
      return;
    }
    // 获取联系人 + 分组信息
    !contactGroupList.length && getContactGroupListRequest(true);
    // 获取群聊列表
    !chatGroupList.length && getChatGroupListRequest();
  }, [userInfo.id, contactGroupList, chatGroupList]);

  // 系统助手
  const assistantList: Array<SystemAssistant> = useMemo(() => {
    return [
      {
        icon: <IconUserAdd />,
        name: '好友验证助手',
        key: 'apply_tickets',
        color: 'orange',
        count: applyTicketList.length,
      },
      {
        icon: <IconUserGroup />,
        name: '群聊验证助手',
        key: 'chat_group_apply_tickets',
        color: 'blue',
        count: chatGroupApplyTicketList.length,
      },
    ];
  }, [applyTicketList, chatGroupApplyTicketList]);

  return (
    <div className={styles.contacts}>
      <Spin wrapperClassName={styles.spin} spinning={loading}>
        <div className={styles.sider}>
          <AddContactGroup onChange={getContactGroupListRequest} />
          {/* 申请记录、群助手 */}
          <div className={styles.title}>系统助手</div>
          <AssistantList assistantList={assistantList} onChange={key => history.push(`${url}/${key}`)} />
          <div className={styles.title}>好友列表</div>
          <ContactGroupList data={contactGroupList} onChange={userId => history.push(`${url}/user_info/${userId}`)} />
          <ChatGroupList title='群聊列表' chatGroupList={chatGroupList} onClick={chatGroup => history.push(`${url}/chat_group_info/${chatGroup.id}`)} />
        </div>
        <div className={styles.main}>
          <Switch>
            {/* 好友申请工单 */}
            <Route path={`${url}/apply_tickets`}>
              <ApplyContactTicketList
                type={APPLY_TICKET_TYPE.CONTACT}
                contactGroupList={contactGroupList as any}
                onChange={requestApplyContactTicketCount}
              />
            </Route>
            {/* 群聊工单 */}
            <Route path={`${url}/chat_group_apply_tickets`}>
              <ApplyContactTicketList type={APPLY_TICKET_TYPE.CHAT_GROUP} onChange={requestApplyContactTicketCount} />
            </Route>
            {/* 用户详细信息 */}
            <Route path={`${url}/user_info/:userId`}>
              <UserInfo onChange={getContactGroupListRequest} />
            </Route>
            {/* 群聊详细信息 */}
            <Route path={`${url}/chat_group_info/:chatGroupId`}>
              <ChatGroupInfo />
            </Route>
          </Switch>
        </div>
      </Spin>
    </div>
  );
};
