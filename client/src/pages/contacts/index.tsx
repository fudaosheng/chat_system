import React, { useEffect, useState } from 'react';
import { Spin } from '@douyinfe/semi-ui';
import { AddGroup } from './components/addGroup';
import styles from './index.module.scss';
import { spinStyle } from 'common/constance';

export const Contacts: React.FC = () => {
  // 联系人分组
  const [contactGroupList, setContactGroupList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取联系人分组
  }, []);
  return (
    <div className={styles.contacts}>
      <Spin spinning={loading} style={spinStyle} childStyle={spinStyle}>
        <div className={styles.group}>
          <AddGroup />
          <div className={styles.title}>好友列表</div>
        </div>
        <div className={styles.detailInfo}></div>
      </Spin>
    </div>
  );
};
