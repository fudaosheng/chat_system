import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { Spin } from '@douyinfe/semi-ui';
import { AddContactGroup } from './components/addContactGroup';
import styles from './index.module.scss';
import { spinStyle } from 'common/constance';
import { getContactGroupList } from 'common/api/contactGroup';
import { ContactGroupList } from './components/contactGroupList';
import { AssistantList } from './components/assistantList';

export interface ContactGroupStruct extends ContactGroup {
  label: string;
  key: string;
  value: number;
}

export const Contacts: React.FC = () => {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  
  // 联系人分组
  const [contactGroupList, setContactGroupList] = useState<Array<ContactGroupStruct>>([]);
  const [loading, setLoading] = useState(false);

  // 获取联系人列表
  const getContactGroupListRequest = async (needLoading = true) => {
    needLoading && setLoading(true);
    try {
      const { data } = await getContactGroupList();
      // 对联系人数据进行处理
      const newContactGroupList = data?.map(item => ({ ...item, label: item.name, value: item.id, key: String(item.id) }));
      setContactGroupList(newContactGroupList);
    } finally {
      needLoading && setLoading(false);
    }
  }

  useEffect(() => {
    // 获取联系人分组
    getContactGroupListRequest();
  }, []);
  return (
    <div className={styles.contacts}>
      <Spin wrapperClassName={styles.spin} spinning={loading}>
        <div className={styles.sider}>
          <AddContactGroup onChange={() => getContactGroupListRequest(false)} />
          {/* 申请记录、群助手 */}
          <div className={styles.title}>系统助手</div>
          <AssistantList onChange={key => history.push(`${url}/${key}`)} />
          <div className={styles.title}>好友列表</div>
          <ContactGroupList data={contactGroupList} />
        </div>
        <div className={styles.main}>
          <Switch>
            <Route exact path={path}>
              path:{path},url：{url}
            </Route>
            <Route path={`${url}/apply_tickets`}>
              好友申请工单
            </Route>
          </Switch>
        </div>
      </Spin>
    </div>
  );
};
