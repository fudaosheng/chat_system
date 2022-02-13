import { Button, Pagination, Spin, Tooltip } from '@douyinfe/semi-ui';
import { IconEyeOpened, IconAt, IconPlus } from '@douyinfe/semi-icons';
import { GlobalContext } from 'common/store';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { ReleaseMoment } from './releaseMoment';
import {
  getFriendsMomentList,
  GetFriendsMomentListResp,
  getUserMomentList,
  GetUserMomentListResp,
} from 'common/api/moment/moments';
import { MomentCard } from './momentCard';
import { NoResult } from 'components/empty';
import classNames from 'classnames';
import { getURLQuery } from 'common/utils';
enum MenuType {
  FRIENDS,
  ONESELF,
  SPECIAL_USER, //查看指定用户的空间
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
  const { uid } = getURLQuery();

  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  
  // 活跃的左侧menu
  const [activeMenu, setActiveMenu] = useState(uid ? MenuType.SPECIAL_USER : MenuType.FRIENDS);
  // 发表动态modal visible
  const [releaseMomentModalVisible, setReleaseMomentModalVisible] = useState(false);
  // 动态列表
  const [momentList, setMomentList] = useState<Array<MomentExtra>>([]);
  const [loading, setLoading] = useState(false);
  // 分页数据
  const [currentPage, setCurrentPage] = useState(defaultPagination.currentPage);
  const [pageSize, setPageSize] = useState(defaultPagination.pageSize);
  const [total, setTotal] = useState(0);

  // 获取动态列表
  const fetchMomentList = async (_currentPage = currentPage, _pageSize = pageSize, _activeMenu = activeMenu) => {
    let resp: GetFriendsMomentListResp | GetUserMomentListResp;
    try {
      setLoading(true);
      if (_activeMenu === MenuType.FRIENDS) {
        resp = await getFriendsMomentList(_currentPage, _pageSize);
      } else {
        resp = await getUserMomentList(
          _activeMenu === MenuType.SPECIAL_USER ? Number(uid) : userInfo.id,
          _currentPage,
          _pageSize
        );
      }
      const {
        data: { total, list = [] },
      } = resp || {};
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
    fetchMomentList(defaultPagination.currentPage, defaultPagination.pageSize, menuValue);
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

  // 发布动态成功
  const handleReleaseMomentSuccess = () => {
    setReleaseMomentModalVisible(false);
    fetchMomentList();
  };

  const renderMomentList = () => {
    return momentList.length ? (
      <>
        <div className={styles.momentList}>
          {momentList?.map(moment => (
            <MomentCard key={moment.id} moment={moment} />
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
      </>
    ) : (
      NoResult
    );
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
        <div
          className={classNames({
            [styles.momentListWrapper]: true,
            [styles.empty]: !momentList.length,
          })}>
          {renderMomentList()}
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
      <ReleaseMoment
        key={releaseMomentModalVisible ? 1 : 0}
        visible={releaseMomentModalVisible}
        onCancel={() => setReleaseMomentModalVisible(false)}
        onOk={handleReleaseMomentSuccess}
      />
    </div>
  );
};
