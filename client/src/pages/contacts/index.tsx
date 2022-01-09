import React, { useEffect, useState } from 'react';
import { Spin } from '@douyinfe/semi-ui';
import { AddContactGroup } from './components/addContactGroup';
import styles from './index.module.scss';
import { spinStyle } from 'common/constance';
import { getContactList } from 'common/api/contactGroup';
import { ContactGroupList } from './components/contactGroupList';

export interface ContactGroupStruct extends ContactGroup {
  label: string;
  key: string;
  value: number;
}

export const Contacts: React.FC = () => {
  // 联系人分组
  const [contactGroupList, setContactGroupList] = useState<Array<ContactGroupStruct>>([]);
  const [loading, setLoading] = useState(false);

  // 获取联系人列表
  const getContactListRequest = async (needLoading = true) => {
    needLoading && setLoading(true);
    try {
      const { data } = await getContactList();
      // 对联系人数据进行处理
      const newContactGroupList = data?.map(item => ({ ...item, label: item.name, value: item.id, key: String(item.id) }));
      setContactGroupList(newContactGroupList);
    } finally {
      needLoading && setLoading(false);
    }
  }

  useEffect(() => {
    // 获取联系人分组
    getContactListRequest();
  }, []);
  return (
    <div className={styles.contacts}>
      <Spin spinning={loading} style={spinStyle} childStyle={spinStyle}>
        <div className={styles.group}>
          <AddContactGroup onChange={() => getContactListRequest(false)} />
          <div className={styles.title}>好友列表</div>
          <ContactGroupList data={contactGroupList} />
        </div>
        <div className={styles.detailInfo}></div>
      </Spin>
    </div>
  );
};
