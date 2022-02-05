import { Button, Toast } from '@douyinfe/semi-ui';
import { agreeChatGroupApply, disagreeChatGroupApply } from 'common/api/chatGroupApplyTickets';
import { APPLY_CHAT_GROUP_TICKET_STATUS } from 'common/constance';
import { GlobalContext } from 'common/store';
import { dateTimeFormat, formatDate } from 'common/utils';
import { UserCard } from 'components/userCard';
import React, { useCallback, useContext, useState } from 'react';
import styles from './index.module.scss';
/**
 * 群聊申请工单组件
 * @auther fudaosheng
 */

interface Props {
  applyTicket: ChatGroupApplyTicketExtra;
  onChange?: () => void; // 工单状态变化，需要重新拉取数据
}
export const ApplyChatGroupTicket: React.FC<Props> = (props: Props) => {
  const { applyTicket, onChange } = props;
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const {
    update_time = '',
    target_user,
    target_user_id,
    applicant_user,
    applicant_user_id,
    operator_id,
    status,
    chat_group,
  } = applyTicket;
  const ticketStatus = Number(status);
  // 按钮loading,防抖
  const [btnLoading, setBtnLoading] = useState(false);

  // 处理同意申请
  const handleAgreeApply = async () => {
    setBtnLoading(true);
    try {
      await agreeChatGroupApply(applyTicket.id);
      onChange && onChange();
      Toast.success(`操作成功`);
    } finally {
      setBtnLoading(false);
    }
  };

  // 拒绝添加联系人申请
  const handleDisagreeAddContact = async () => {
    //拒绝添加联系人
    setBtnLoading(true);
    try {
      await disagreeChatGroupApply(applyTicket.id);
      onChange && onChange();
      Toast.success(`已拒绝${applicant_user.name}的邀请`);
    } finally {
      setBtnLoading(false);
    }
  };

  const renderName = useCallback(
    (name: string) => {
      return (
        <div className={styles.customName}>
          <span className={styles.name}>{name}</span>
          <span className={styles.tip}>申请加入</span>
          <span className={styles.chatGroupName}>{applyTicket?.chat_group?.name || ''}</span>
        </div>
      );
    },
    [applyTicket]
  );
  const renderStatus = () => {
    // 别人给自己发送好友申请，需要自己处理
    if (operator_id === userInfo.id && ticketStatus === APPLY_CHAT_GROUP_TICKET_STATUS.PENDING) {
      return (
        <>
          <Button loading={btnLoading} type="tertiary" theme="borderless" onClick={handleDisagreeAddContact}>
            拒绝
          </Button>
          <Button loading={btnLoading} theme="solid" style={{ marginLeft: 8 }} onClick={handleAgreeApply}>
            同意
          </Button>
        </>
      );
    }
    return ticketStatus === APPLY_CHAT_GROUP_TICKET_STATUS.PENDING
      ? '等待验证'
      : ticketStatus === APPLY_CHAT_GROUP_TICKET_STATUS.AGREE
      ? '已同意'
      : '已拒绝';
  };
  return (
    <div className={styles.ticket}>
      <div className={styles.time}>{formatDate(new Date(update_time), dateTimeFormat)}</div>
      <div className={styles.ticketInfo}>
        <div className={styles.top}>
          <div className={styles.userInfo}>
            {/* 自己申请入群 */}
            {userInfo.id === applicant_user.id && target_user.id === userInfo.id && operator_id !== userInfo.id && (
              <UserCard
                userInfo={chat_group as unknown as UserInfo}
                name={
                  <>
                    <span className={styles.tip} style={{ marginRight: 6 }}>
                      申请加入
                    </span>
                    <span className={styles.chatGroupName}>{chat_group?.name || ''}</span>
                  </>
                }
              />
            )}
            {/* 自己邀请别人入群 */}
            {userInfo.id === applicant_user.id && target_user.id !== userInfo.id && operator_id !== userInfo.id && (
              <UserCard
                userInfo={target_user}
                name={
                  <>
                    <span className={`${styles.tip} ${styles.invite}`}>邀请</span>
                    <span className={styles.name} style={{ margin: '0 6px' }}>{target_user.name}</span>
                    <span className={styles.tip} style={{ marginRight: 6 }}>
                      加入
                    </span>
                    <span className={styles.chatGroupName}>{applyTicket?.chat_group?.name || ''}</span>
                  </>
                }
              />
            )}
            {/* 待自己处理的入群申请-别人邀请自己入群 */}
            {operator_id === userInfo.id && applicant_user_id !== target_user_id && (
              <UserCard
                userInfo={applicant_user}
                name={
                  <>
                    <span className={styles.name}>{applicant_user.name}</span>
                    <span className={styles.tip} style={{ margin: '0 6px' }}>
                      邀请你加入
                    </span>
                    <span className={styles.chatGroupName}>{applyTicket?.chat_group?.name || ''}</span>
                  </>
                }
              />
            )}
            {/* 待自己处理的入群申请-别人申请入群，需要自己处理 */}
            {operator_id === userInfo.id && applicant_user_id === target_user_id && (
              <UserCard
                userInfo={applicant_user}
                name={
                  <>
                    <span className={styles.name}>{applicant_user.name}</span>
                    <span className={styles.tip} style={{ margin: '0 6px' }}>
                      申请加入
                    </span>
                    <span className={styles.chatGroupName}>{applyTicket?.chat_group?.name || ''}</span>
                  </>
                }
              />
            )}
          </div>
          <div className={styles.status}>{renderStatus()}</div>
        </div>
        <div className={styles.footer}>
          {/* <div className={styles.message}>
            验证信息：<span>{message}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};
