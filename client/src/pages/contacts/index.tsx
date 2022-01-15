import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { Spin } from '@douyinfe/semi-ui';
import { AddContactGroup } from './components/addContactGroup';
import styles from './index.module.scss';
import { ContactGroupList } from './components/contactGroupList';
import { AssistantList } from './components/assistantList';
import { ApplyContactTicketList } from './subPages/applyContactTicketList';
import { GlobalContext } from 'common/store';
import { getApplyTicketList } from 'common/api/applyContactTicket';
import { getContactList } from 'common/api/contacts';
import { depthFirstSearch } from 'common/utils';
const interval = 1000 * 60; //轮询间隔

export const Contacts: React.FC = () => {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const {
    state: { userInfo },
  } = useContext(GlobalContext);

  // 联系人分组列表
  const [contactGroupList, setContactGroupList] = useState<Array<DetailContactGroupInfoExtra>>([]);
  const [loading, setLoading] = useState(false);
  // 申请列表
  const [applyTicketList, setApplyTicketList] = useState<Array<ApplyTicket>>([]);

  // 查询待自己处理的好友申请工单的数量
  const requestApplyContactTicketCount = async () => {
    const { data = [] } = await getApplyTicketList();
    setApplyTicketList(data);
  };

  useEffect(() => {
    if (!userInfo.id) {
      return;
    }
    // 轮询获取好友申请信息
    requestApplyContactTicketCount();
    const timer = setInterval(() => {
      requestApplyContactTicketCount();
    }, interval);
    return () => clearInterval(timer);
  }, [userInfo.id]);

  // 获取联系人分组列表
  // todo：要先查询分组，再根据分组查询联系人，否则查询的分组不全
  const getContactGroupListRequest = async (needLoading = true) => {
    needLoading && setLoading(true);
    try {
      const { data } = await getContactList();
      // 对联系人数据进行处理
      const newContactGroupList = depthFirstSearch(
        data,
        item => ({ ...item, label: item.name, value: item.id, key: String(item.id) }),
        { traversalKey: 'contact_list', key: 'children' }
      ) as Array<DetailContactGroupInfoExtra>;
      console.log(newContactGroupList);

      setContactGroupList(newContactGroupList);
    } finally {
      needLoading && setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo?.id) {
      return;
    }
    // 获取联系人 + 分组信息
    getContactGroupListRequest();
  }, [userInfo.id]);
  return (
    <div className={styles.contacts}>
      <Spin wrapperClassName={styles.spin} spinning={loading}>
        <div className={styles.sider}>
          <AddContactGroup onChange={() => getContactGroupListRequest(false)} />
          {/* 申请记录、群助手 */}
          <div className={styles.title}>系统助手</div>
          <AssistantList applyTicketList={applyTicketList} onChange={key => history.push(`${url}/${key}`)} />
          <div className={styles.title}>好友列表</div>
          <ContactGroupList data={contactGroupList} />
        </div>
        <div className={styles.main}>
          <Switch>
            <Route exact path={path}>
              path:{path},url：{url}
            </Route>
            <Route path={`${url}/apply_tickets`}>
              <ApplyContactTicketList
                contactGroupList={contactGroupList as any}
                onChange={requestApplyContactTicketCount}
              />
            </Route>
          </Switch>
        </div>
      </Spin>
    </div>
  );
};
