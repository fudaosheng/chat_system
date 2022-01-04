import React from 'react';
import { Header } from './header';
import styles from './index.module.scss';

export const AppLayout: React.FC = props => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.layout_main}>{props.children}</div>
    </div>
  );
};
