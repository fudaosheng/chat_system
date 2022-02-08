import React, { ReactElement } from 'react';
import { Avatar } from '@douyinfe/semi-ui';
import { AvatarSize } from '@douyinfe/semi-ui/avatar';
import styles from './index.module.scss';
import classNames from 'classnames';

interface Props {
  userInfo: UserInfo;
  name?: ReactElement | string;
  size?: AvatarSize;
  className?: string;
  onClick?: () => void;
}

export const UserCard: React.FC<Props> = (props: Props) => {
  const { userInfo, name, size, className = '', onClick } = props;
  return (
    <div className={`${styles.userCard} ${className}`} onClick={onClick}>
      <div className={styles.avatar}>
        <Avatar size={size} src={userInfo.avatar}>{userInfo?.name?.substring(0, 2)}</Avatar>
      </div>
      <div className={styles.userInfo}>
        <div className={classNames({
          [styles.name]: true,
          [styles.nameSmallStyle]: size === "small"
        })}>{name || userInfo?.name}</div>
        <div className={styles.bio}>{userInfo?.bio}</div>
      </div>
    </div>
  );
};
