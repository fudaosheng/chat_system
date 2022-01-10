import { getApplyContactTicketList } from 'common/api/applyContactTicket';
import React, { useEffect, useState } from 'react';
import { Spin, Pagination } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { ApplyContactTicket } from 'pages/contacts/components/applyContactTick';
import { ContactGroupStruct } from 'pages/contacts';

interface Props {
  contactGroupList: Array<ContactGroupStruct>; //分组信息
}
export const ApplyContactTicketList: React.FC<Props> = (props: Props) => {
  const { contactGroupList } = props;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  // 好友申请工单
  const [applyTicketList, setApplyTicketList] = useState<Array<ApplyContactTicket>>([]);

  // 获取和自己有关的好友申请数据
  const getApplyContactTicketListRequest = async (curPage = currentPage, pagSize = pageSize) => {
    setLoading(true);
    try {
      const {
        data: { applyTicketList = [], total = 0 },
      } = await getApplyContactTicketList({
        currentPage: curPage,
        pageSize: pagSize,
      });
      setApplyTicketList(applyTicketList);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplyContactTicketListRequest();
  }, []);

  // 处理翻页
  const handlePaginationChange = (newCurPage: number, newPageSize: number) => {
    // 设置新的翻页参数,页面容量变化时页码会自动变成第一页
    if (newCurPage !== currentPage) {
      setCurrentPage(newCurPage);
    }
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
    // 从新请求数据
    getApplyContactTicketListRequest(newCurPage, newPageSize);
  };
  return (
    <div className={styles.applyContactTicketList}>
      <Spin wrapperClassName={styles.spin} spinning={loading}>
        <div className={styles.title}>好友验证消息</div>
        <div className={styles.tictetList}>
          {applyTicketList?.map(item => (
            <ApplyContactTicket key={item.id} applyTicket={item} contactGroupList={contactGroupList} />
          ))}
        </div>
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            pageSizeOpts={[5, 10, 20, 50]}
            onChange={handlePaginationChange}
          />
        </div>
      </Spin>
    </div>
  );
};
