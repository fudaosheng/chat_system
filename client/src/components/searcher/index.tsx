import React from 'react';
import { Input, Popover } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import styles from './index.module.scss';

export const Searcher: React.FC = () => {
    return (
        <Popover trigger="focus" position="bottom">
            <Input className={styles.searcher} prefix={<IconSearch />} />
        </Popover>
    )
}
