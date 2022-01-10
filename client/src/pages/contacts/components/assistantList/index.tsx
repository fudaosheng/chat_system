import React, { ReactElement, useState } from 'react';
import { IconUserAdd } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import { Avatar } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { AvatarColor } from '@douyinfe/semi-ui/avatar';

export interface SystemAssistant {
  icon: ReactElement;
  name: string;
  key: string;
  color: AvatarColor;
}

const assistantList: Array<SystemAssistant> = [
  {
    icon: <IconUserAdd />,
    name: '好友验证助手',
    key: 'apply_tickets',
    color: 'orange',
  },
];

interface Props {
  onChange?: (key: string) => void;
}
export const AssistantList: React.FC<Props> = (props: Props) => {
  const { onChange } = props;
  const [activeKey, setActiveKey] = useState('');

  const handleClick = (item: SystemAssistant) => {
    setActiveKey(item.key);
    onChange && onChange(item.key);
  };
  return (
    <>
      {assistantList.map(item => (
        <div key={item.key} className={classNames({
            [styles.assistant]: true,
            [styles.active]: activeKey === item.key
        })} onClick={() => handleClick(item)}>
          <div className={styles.left}>
            <Avatar color={item.color} size="small">{item.icon}</Avatar>
          </div>
          <div className={styles.right}>
            <div className={styles.name}>{item.name}</div>
          </div>
        </div>
      ))}
    </>
  );
};