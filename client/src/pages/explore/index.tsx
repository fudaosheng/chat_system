import { Button, Pagination, Spin, Tooltip } from '@douyinfe/semi-ui';
import { IconEyeOpened, IconAt, IconPlus } from '@douyinfe/semi-icons';
import { GlobalContext } from 'common/store';
import React, { useContext, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { ReleaseMoment } from './releaseMoment';
import { getUserMomentList } from 'common/api/moments';
import { MomentCard } from './momentCard';
enum MenuType {
  FRIENDS,
  ONESELF,
}
const MenuList = [
  {
    icon: <IconEyeOpened />,
    label: '好友动态',
    value: MenuType.FRIENDS,
  },
  {
    icon: <IconAt />,
    label: '我的动态',
    value: MenuType.ONESELF,
  },
];
const defaultPagination = {
  currentPage: 1,
  pageSize: 10,
};
export const Explore: React.FC = () => {
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  // 活跃的左侧menu
  const [activeMenu, setActiveMenu] = useState(MenuType.FRIENDS);
  // 发表动态modal visible
  const [releaseMomentModalVisible, setReleaseMomentModalVisible] = useState(false);
  // 动态列表
  const [momentList, setMomentList] = useState<Array<Moment>>([]);
  const [loading, setLoading] = useState(false);
  // 分页数据
  const [currentPage, setCurrentPage] = useState(defaultPagination.currentPage);
  const [pageSize, setPageSize] = useState(defaultPagination.pageSize);
  const [total, setTotal] = useState(0);

  const fetchMomentList = async (_currentPage = currentPage, _pageSize = pageSize) => {
    const request = activeMenu === MenuType.FRIENDS ? getUserMomentList : getUserMomentList;
    try {
      setLoading(true);
      const {
        data: { total, list = [] },
      } = await request(_currentPage, _pageSize);
      console.log(list);
      setMomentList(list);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo?.id) {
      return;
    }
    fetchMomentList();
  }, [userInfo.id]);

  const handleMenuClick = (menuValue: MenuType) => {
    setActiveMenu(menuValue);
    setCurrentPage(defaultPagination.currentPage);
    setPageSize(defaultPagination.pageSize);
    fetchMomentList(defaultPagination.currentPage, defaultPagination.pageSize);
  };

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
    fetchMomentList(newCurPage, newPageSize);
  };

  return (
    <div className={styles.explore}>
      <div className={styles.sider}>
        {MenuList.map(item => (
          <Button
            key={item.value}
            icon={item.icon}
            type={activeMenu === item.value ? 'primary' : 'tertiary'}
            theme="borderless"
            onClick={() => handleMenuClick(item.value)}>
            {item.label}
          </Button>
        ))}
      </div>
      <Spin spinning={loading} wrapperClassName={styles.spin}>
        <div className={styles.momentListWrapper}>
          <div className={styles.momentList}>
            {momentList?.map(moment => (
              <MomentCard key={moment.id} moment={{ ...moment, user_info: userInfo }} />
            ))}
          </div>
          <div className={styles.paginationWrapper}>
            <span>共{total}条动态</span>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              pageSizeOpts={[5, 10, 20, 50]}
              onChange={handlePaginationChange}
            />
          </div>
        </div>
      </Spin>
      <div>
        <Tooltip content="发表动态">
          <Button
            disabled={!userInfo.id}
            icon={<IconPlus />}
            type="tertiary"
            theme="borderless"
            onClick={() => setReleaseMomentModalVisible(true)}
          />
        </Tooltip>
      </div>
      <ReleaseMoment visible={releaseMomentModalVisible} onCancel={() => setReleaseMomentModalVisible(false)} />
    </div>
  );
};
