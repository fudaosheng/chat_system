import { Avatar } from '@douyinfe/semi-ui';
import { dateTimeFormat, formatDate } from 'common/utils';
import React from 'react';
import styles from './index.module.scss';

interface Props {
  moment: MomentExtra;
}
export const MomentCard: React.FC<Props> = (props: Props) => {
  const { moment } = props;
  return (
    <div className={styles.momentCard}>
      <div className={styles.left}>
        <Avatar shape="square" src={moment.user_info.avatar} />
      </div>
      <div className={styles.main}>
        <div className={styles.name}>{moment?.user_info?.note || moment?.user_info?.name}</div>
        <div className={styles.content}>{moment.content}</div>
        <div className={styles.imgList}>
          {moment?.imgs_list?.map(img => (
            <div className={styles.imgItem} key={img}><Avatar shape="square" src={img} /></div>
          ))}
        </div>
        <div className={styles.createAt}>
            发布时间：{formatDate(new Date(moment.create_time), dateTimeFormat)}
        </div>
      </div>
    </div>
  );
};
