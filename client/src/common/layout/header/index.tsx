import React from 'react';
import { Searcher } from 'components/searcher';
import { UserInfoCard } from 'components/userInfoCard';
import { AddButton } from 'components/addButton';
import styles from './index.module.scss';

export const Header: React.FC = () => {
  return (
    <header className={styles.layout_header}>
      <div className={styles.headerLeft}>
        <Searcher />
        <AddButton className={styles.addBtn} />
      </div>
      <div className={styles.headerRight}>
        <div className={styles.headerRightNav}></div>
        <div className={styles.userInfo}>
          <UserInfoCard />
        </div>
      </div>
    </header>
  );
};
