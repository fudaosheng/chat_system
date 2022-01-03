import React from 'react';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationIdle } from '@douyinfe/semi-illustrations';
import { Header } from './header';
import styles from './index.module.scss';
import { Nav } from './nav';

const emptyContent = (
  <Empty image={<IllustrationIdle style={{ width: 200, height: 200 }} />} />
);

export const AppLayout: React.FC = props => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.layout_main}>
        <Nav></Nav>
        <div className={styles.layout_main_content}>{props.children || emptyContent}</div>
      </div>
    </div>
  );
};
