import { UserCard } from 'components/userCard';
import React from 'react';
import styles from './index.module.scss';

interface Props {
  members: Array<ChatGroupMember>;
}
export const MemberList: React.FC<Props> = (props: Props) => {
  const { members = [] } = props;
  return (
    <div>
      {members.map(member => (
        <UserCard size="small" userInfo={member} className={styles.userCard} />
      ))}
    </div>
  );
};
