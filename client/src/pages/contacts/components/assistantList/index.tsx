import React, { useState } from 'react';
import styles from './index.module.scss';
import { Avatar, Badge } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { SystemAssistant } from 'pages/contacts';
interface Props {
  assistantList: Array<SystemAssistant>
  onChange?: (key: string) => void;
}
export const AssistantList: React.FC<Props> = (props: Props) => {
  const { assistantList = [], onChange } = props;
  const [activeKey, setActiveKey] = useState('');

  const handleClick = (item: SystemAssistant) => {
    setActiveKey(item.key);
    onChange && onChange(item.key);
  };
  return (
    <>
      {assistantList.map(item => (
        <div
          key={item.key}
          className={classNames({
            [styles.assistant]: true,
            [styles.active]: activeKey === item.key,
          })}
          onClick={() => handleClick(item)}>
          <div className={styles.left}>
            {item.count ? (
              <Badge count={item.count} overflowCount={99} type="danger">
                <Avatar color={item.color} size="small">
                  {item.icon}
                </Avatar>
              </Badge>
            ) : (
              <Avatar color={item.color} size="small">
                {item.icon}
              </Avatar>
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.main}>
              <div className={styles.name}>{item.name}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
