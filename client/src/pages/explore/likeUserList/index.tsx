import React, { useCallback } from 'react';
import { Button, OverflowList, Popover } from '@douyinfe/semi-ui';
import { OverflowItem } from '@douyinfe/semi-ui/lib/es/overflowList';
import styles from './index.module.scss';

interface Props {
  userList: Array<UserInfo>;
}
export const LikeUserList: React.FC<Props> = (props: Props) => {
  const { userList = [] } = props;

  const renderItem = useCallback((item: OverflowItem) => {
    return (
      <span key={item.key} className={styles.likeItem}>
        {item?.note || item.name}
      </span>
    );
  }, []);

  const renderOverflow = useCallback((items: Array<OverflowItem>) => {
    return items.length ? (
      <Popover trigger="click" showArrow content={(<div className={styles.overflowWrapper}>{userList?.map(i => renderItem(i))}</div>)}>
        <span className={styles.overflowBtn}>+{items.length}人</span>
      </Popover>
    ) : null;
  }, [userList]);

  return userList?.length ? (
    <div className={styles.likeList}>
      <OverflowList
        className={styles.overflowList}
        items={userList}
        visibleItemRenderer={renderItem}
        overflowRenderer={renderOverflow}
      />
      <span>👍了该动态</span>
    </div>
  ) : null;
};
