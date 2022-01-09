import { getApplyContactTicketList } from 'common/api/contact';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

export const ApplyContactTicketList: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // 获取和自己有关的好友申请数据
    const getApplyContactTicketListRequest = async () => {
        setLoading(true);
        try {
            console.log('---');
            
            const { data } = await getApplyContactTicketList({
                currentPage,
                pageSize,
            });
            console.log(data);
            
        } finally {

        }
    }

    useEffect(() => {
        getApplyContactTicketListRequest();
    }, []);
    return (
        <div className={styles.applyContactTicketList}>
            <div className={styles.title}>好友验证消息</div>
        </div>
    )
}