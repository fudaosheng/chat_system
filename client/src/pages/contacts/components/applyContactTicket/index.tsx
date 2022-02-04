import { Button, Input, Select, Toast } from '@douyinfe/semi-ui';
import { agreeAddContact, rejectAddContact } from 'common/api/applyContactTicket';
import { APPLY_CONTACT_TICKET_STATUS } from 'common/constance';
import { GlobalContext } from 'common/store';
import { dateTimeFormat, formatDate } from 'common/utils';
import { UserCard } from 'components/userCard';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from './index.module.scss';
/**
 * 好友申请工单组件
 * @auther fudaosheng
 */

interface Props {
  applyTicket: ApplyContactTicket;
  contactGroupList: Array<DetailContactGroupInfoExtra>; //分组信息
  onChange?: () => void; // 工单状态变化，需要重新拉取数据
}
export const ApplyContactTicket: React.FC<Props> = (props: Props) => {
  const { applyTicket, contactGroupList, onChange } = props;
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const { update_time = '', target_user, applicant_user, status, message } = applyTicket;
  const [visible, setVisible] = useState(false);
  // 要添加的分组
  const [contactGroup, setContactGroup] = useState(contactGroupList?.[0]?.id);
  // 好友备注
  const [note, setNote] = useState('');
  // 按钮loading,防抖
  const [btnLoading, setBtnLoading] = useState(false);

  // 处理同意申请
  const handleAgreeApply = async () => {
    // 需要填写信息
    if(!visible) {
      setVisible(true);
      return;
    }
    if(!contactGroup) {
      Toast.error('必须选择分组信息');
      return;
    }
    console.log(contactGroup, note);
    console.log('处理好友申请同意逻辑');
    setBtnLoading(true);
    try {
      await agreeAddContact({
        note,
        apply_contact_ticketId: applyTicket.id,
        group_id: contactGroup,
      });
      onChange && onChange();
      Toast.success(`已成功添加${applyTicket?.applicant_user?.name}为好友`);
      setVisible(false);
    } finally {
      setBtnLoading(false);
    }
  }

  // 拒绝添加联系人申请
  const handleDisagreeAddContact = async () => {
    // 取消填写信息
    if(visible) {
      setVisible(false);
      return;
    }
    //拒绝添加联系人
    setBtnLoading(true);
    try {
      await rejectAddContact(applyTicket.id);
      onChange && onChange();
      Toast.success(`已拒绝${applyTicket?.applicant_user?.name}的好友申请`);
    } finally {
      setBtnLoading(false);
    }
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
          <Button loading={btnLoading} type="tertiary" theme="borderless" onClick={handleDisagreeAddContact}>
            { visible ? '取消' : '拒绝'}
          </Button>
          <Button loading={btnLoading} theme="solid" style={{ marginLeft: 8 }} onClick={handleAgreeApply}>
            { visible ? '确定' : '同意'}
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
