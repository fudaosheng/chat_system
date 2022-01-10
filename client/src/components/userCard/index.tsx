import React, { ReactElement } from 'react';
import { Avatar } from '@douyinfe/semi-ui';
import styles from './index.module.scss';

interface Props {
  userInfo: UserInfo;
  name?: ReactElement;
}

export const UserCard: React.FC<Props> = (props: Props) => {
  const { userInfo, name } = props;
  return (
    <div className={styles.userCard}>
      <div className={styles.avatar}>
        <Avatar src={userInfo.avatar}>{userInfo.name.substring(0, 2)}</Avatar>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.name}>{name || userInfo?.name}</div>
        <div className={styles.bio}>{userInfo?.bio}</div>
      </div>
    </div>
  );
};
