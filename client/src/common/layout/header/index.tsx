import React, { ReactElement } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { IconComment, IconUserSetting, IconGlobe } from '@douyinfe/semi-icons';
import { Searcher } from 'components/searcher';
import { UserInfoCard } from 'components/userInfoCard';
import { AddButton } from 'components/addButton';
import styles from './index.module.scss';

interface Router extends NavLinkProps {
  icon: ReactElement;
}

const routers: Array<Router> = [
  {
    to: '/chat',
    icon: <IconComment size="extra-large" />,
  },
  {
    to: '/contacts',
    icon: <IconUserSetting size="extra-large" />,
  },
  {
    to: '/explore',
    icon: <IconGlobe size="extra-large" />
  }
];

const renderLinks = () => {
  return routers.map((item, index) => {
    return (
      <NavLink className={styles.link} activeClassName={styles.activeLink} key={index} to={item.to}>
        {item.icon}
      </NavLink>
    );
  });
};

export const Header: React.FC = () => {
  return (
    <header className={styles.layout_header}>
      <div className={styles.headerLeft}>
        <Searcher />
        <AddButton className={styles.addBtn} />
      </div>
      <div className={styles.headerRight}>
        <div className={styles.headerRightNav}>{renderLinks()}</div>
        <div className={styles.userInfo}>
          <UserInfoCard />
        </div>
      </div>
    </header>
  );
};
