import React, { ReactChild } from 'react';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import styles from './index.module.scss';

const NoContacts = (
  <Empty image={<IllustrationNoContent style={{ width: 150, height: 150 }} />} description={'暂无联系人，请添加'} />
);

interface NavProps {
  className?: string;
  children?: ReactChild;
}
export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const { className = '', children = null } = props;
  return (
    <div className={`${children === null ? styles.emptyWrap : ''} ${styles.layout_main_nav} ${className}`}>
      {children || NoContacts}
    </div>
  );
};
