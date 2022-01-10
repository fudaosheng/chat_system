import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { IconUserAdd } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import { Avatar, Badge } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { AvatarColor } from '@douyinfe/semi-ui/avatar';
import { GlobalContext } from 'common/store';
import { getApplyTicketCount } from 'common/api/applyContactTicket';
const interval = 1000 * 60; //轮询间隔

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
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const [activeKey, setActiveKey] = useState('');
  // 申请列表
  const [applyTicketList, setApplyTicketList] = useState<Array<ApplyTicket>>([]);

  // 查询待自己处理的申请工单的数量
  const requestApplyContactTicketCount = async () => {
    const { data } = await getApplyTicketCount();
    setApplyTicketList(data);
  };

  useEffect(() => {
    if (!userInfo.id) {
      return;
    }
    // 轮询获取好友申请信息
    requestApplyContactTicketCount();
    const timer = setInterval(() => {
      requestApplyContactTicketCount();
    }, interval);
    return () => clearInterval(timer);
  }, [userInfo.id]);

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
            {applyTicketList.length ? (
              <Badge count={applyTicketList.length} overflowCount={99} type="danger">
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
