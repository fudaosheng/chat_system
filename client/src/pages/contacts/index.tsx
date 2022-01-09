import React from 'react';
import { AddGroup } from './components/addGroup';
import styles from './index.module.scss';

export const Contacts: React.FC = () => {
  return (
    <div className={styles.contacts}>
      <div className={styles.group}>
        <AddGroup />
        <div className={styles.title}>好友列表</div>
      </div>
      <div className={styles.detailInfo}></div>
    </div>
  );
};
