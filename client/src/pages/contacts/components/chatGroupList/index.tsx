import { Collapse } from '@douyinfe/semi-ui';
import { CollapseProps } from '@douyinfe/semi-ui/tree/collapse';
import { UserCard } from 'components/userCard';
import React from 'react';

interface Props {
  title: string;
  chatGroupList: Array<ChatGroup>;
  collapseProps?: CollapseProps;
}

export const ChatGroupList: React.FC<Props> = (props: Props) => {
  const { title = '', chatGroupList = [], collapseProps = {} } = props;
  return (
    <Collapse>
      <Collapse.Panel {...collapseProps} header={title} itemKey="1">
        {chatGroupList.map(chatGroup => (
          <UserCard key={chatGroup.id} userInfo={chatGroup as unknown as UserInfo} />
        ))}
      </Collapse.Panel>
    </Collapse>
  );
};
