import React from 'react';
import { Searcher } from 'components/searcher';
import { UserInfoCard } from 'components/userInfoCard';
import styles from './index.module.scss';
import { Nav } from './nav';
import { AddButton } from 'components/addButton';

export const AppLayout: React.FC = props => {
  return (
    <div className={styles.layout}>
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
      <div className={styles.layout_main}>
        <Nav className={styles.layout_main_nav}></Nav>
        <div className={styles.layout_main_content}>{props.children}</div>
      </div>
      <footer className={styles.layout_footer}></footer>
    </div>
  );
};
