import { Button, Input, Select, Toast } from '@douyinfe/semi-ui';
import { getContactGroupList } from 'common/api/contactGroup';
import { APPLY_CONTACT_TICKET_STATUS } from 'common/constance';
import { GlobalContext } from 'common/store';
import { dateTimeFormat, formatDate } from 'common/utils';
import { UserCard } from 'components/userCard';
import { ContactGroupStruct } from 'pages/contacts';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from './index.module.scss';
/**
 * 好友申请工单组件
 * @auther fudaosheng
 */

interface Props {
  applyTicket: ApplyContactTicket;
  contactGroupList: Array<ContactGroupStruct>; //分组信息
}
export const ApplyContactTicket: React.FC<Props> = (props: Props) => {
  const { applyTicket, contactGroupList } = props;
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const { update_time = '', target_user, applicant_user, status, message } = applyTicket;
  const [visible, setVisible] = useState(false);
  // 要添加的分组
  const [contactGroup, setContactGroup] = useState(contactGroupList?.[0]?.id);
  // 好友备注
  const [note, setNote] = useState('');

  // 处理同意申请
  const handleAgreeApply = () => {
    // 需要填写信息
    if(!visible) {
      setVisible(true);
      return;
    }
    console.log(note);
    if(!contactGroup) {
      Toast.error('必须选择分组信息');
      return;
    }
    console.log(contactGroup);
    console.log('处理好友申请同意逻辑');
    
  }

  const renderName = useCallback((name: string) => {
    return (
      <div className={styles.customName}>
        <span className={styles.name}>{name}</span>
        <span className={styles.tip}>请求加为好友</span>
      </div>
    );
  }, []);
  const renderStatus = () => {
    // 别人给自己发送好友申请，需要自己处理
    if (target_user.id === userInfo.id && status === APPLY_CONTACT_TICKET_STATUS.PENDING) {
      return (
        <>
          <Button type="tertiary" theme="borderless" onClick={() => setVisible(false)}>
            拒绝
          </Button>
          <Button theme="solid" style={{ marginLeft: 8 }} onClick={handleAgreeApply}>
            同意
          </Button>
        </>
      );
    }
    return status === APPLY_CONTACT_TICKET_STATUS.PENDING
      ? '等待验证'
      : status === APPLY_CONTACT_TICKET_STATUS.AGREE
      ? '已同意'
      : '已拒绝';
  };
  return (
    <div className={styles.ticket}>
      <div className={styles.time}>{formatDate(new Date(update_time), dateTimeFormat)}</div>
      <div className={styles.ticketInfo}>
        <div className={styles.top}>
          <div className={styles.userInfo}>
            {/* 自己给别人发送的好友申请 */}
            {userInfo.id === applicant_user.id && <UserCard userInfo={target_user} />}
            {/* 别人给自己发送的好友申请 */}
            {target_user.id === userInfo.id && (
              <UserCard userInfo={applicant_user} name={renderName(applicant_user.name)} />
            )}
          </div>
          <div className={styles.status}>{renderStatus()}</div>
        </div>
        <div className={styles.footer}>
          <div className={styles.message}>
            验证信息：<span>{message}</span>
          </div>
          {visible && (
            <>
              <div className={styles.item}>
                <label>添加到分组</label>
                <Select
                  placeholder="请选择分组"
                  optionList={contactGroupList}
                  value={contactGroup}
                  onChange={v => setContactGroup(v as number)}
                  style={{ width: 200 }}
                />
              </div>
              <div className={styles.item}>
                <label>备注</label>
                <Input placeholder="请输入备注" value={note} onChange={v => setNote(v)} style={{ width: 200 }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
