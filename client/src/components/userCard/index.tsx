import React, { ReactElement } from 'react';
import { Avatar } from '@douyinfe/semi-ui';
import { AvatarSize } from '@douyinfe/semi-ui/avatar';
import styles from './index.module.scss';

interface Props {
  userInfo: UserInfo;
  name?: ReactElement;
  size?: AvatarSize;
  onClick?: () => void;
}

export const UserCard: React.FC<Props> = (props: Props) => {
  const { userInfo, name, size, onClick } = props;
  return (
    <div className={styles.userCard} onClick={onClick}>
      <div className={styles.avatar}>
        <Avatar size={size} src={userInfo.avatar}>{userInfo.name.substring(0, 2)}</Avatar>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.name}>{name || userInfo?.name}</div>
        <div className={styles.bio}>{userInfo?.bio}</div>
      </div>
    </div>
  );
};
