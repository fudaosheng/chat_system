import { Collapse } from '@douyinfe/semi-ui';
import { CollapseProps } from '@douyinfe/semi-ui/tree/collapse';
import { UserCard } from 'components/userCard';
import React from 'react';
import styles from './index.module.scss';

interface Props {
  title: string;
  chatGroupList: Array<ChatGroup>;
  collapseProps?: CollapseProps;
  onClick?: (data: ChatGroup) => void;
}

export const ChatGroupList: React.FC<Props> = (props: Props) => {
  const { title = '', chatGroupList = [], collapseProps = {}, onClick } = props;
  return (
    <Collapse>
      <Collapse.Panel {...collapseProps} header={title} itemKey="1">
        {chatGroupList.map(chatGroup => (
          <UserCard className={styles.userCard} key={chatGroup.id} userInfo={chatGroup as unknown as UserInfo} onClick={() => onClick && onClick(chatGroup)} />
        ))}
      </Collapse.Panel>
    </Collapse>
  );
};
