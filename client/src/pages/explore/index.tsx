import { Button, Tooltip } from '@douyinfe/semi-ui';
import { IconEyeOpened, IconAt, IconPlus } from '@douyinfe/semi-icons';
import { GlobalContext } from 'common/store';
import React, { useContext, useState } from 'react';
import styles from './index.module.scss';
import { ReleaseMoment } from './releaseMoment';
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
export const Explore: React.FC = () => {
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  // 活跃的左侧menu
  const [activeMenu, setActiveMenu] = useState(-1);
  // 发表动态modal visible
  const [releaseMomentModalVisible, setReleaseMomentModalVisible] = useState(false);

  const handleMenuClick = (menuValue: MenuType) => {
    setActiveMenu(menuValue);
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
      <div className={styles.momentList}></div>
      <div>
        <Tooltip content="发表动态">
          <Button icon={<IconPlus />} type="tertiary" theme="borderless" onClick={() => setReleaseMomentModalVisible(true)} />
        </Tooltip>
      </div>
      <ReleaseMoment visible={releaseMomentModalVisible} onCancel={() => setReleaseMomentModalVisible(false)} />
    </div>
  );
};
