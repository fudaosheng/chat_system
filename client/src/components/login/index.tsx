import React, { useCallback, useState } from 'react';
import { Modal, Avatar, Form, Button } from '@douyinfe/semi-ui';
import { useContext } from 'react';
import { GlobalContext } from 'common/store';
import styles from './index.module.css';
import { login, LoginParams } from 'common/api/user';

export const Login: React.FC = () => {
    const { state: { userInfo = {} } } = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);

    const handleLoginValidate = useCallback((values: Record<string, string>) => {
        const errors: Record<string, string> = {};
        Object.keys(values).forEach(key => {
            if(!values[key]) {
                errors[key] = '值不能为空'; 
            } else if(values[key].length < 6) {
                errors[key] = '值的长度必须不小于6个字符'; 
            }
        });
        return Object.keys(errors).length ? errors : '';
    }, []);

    const handleLogin = useCallback(async (values: Record<string, string>) => {
        console.log(values);
        setLoading(true);
        try {
           await login(values as unknown as LoginParams);
        } finally{
            setLoading(false);
        }
        
    }, []);
    return (
        <Modal height={500} visible={!userInfo?.token} footer={null} title="Login" closable={false}>
            <div className={styles.main}>
                <div className={styles.avatar}>
                    <Avatar style={{ width: 100, height: 100 }} />
                </div>
                <div className={styles.loginForm}>
                    <Form labelPosition='left' validateFields={handleLoginValidate} onSubmit={handleLogin}>
                        <Form.Input field='name' style={{ width: 250 }} label='名称' placeholder='请输入用户名' required />
                        <Form.Input field="password" style={{ width: 250 }} label='密码' placeholder='请输入密码' required />
                        <Form.Slot style={{ width: '100%' }} noLabel></Form.Slot>
                        <div className={styles.submit}>
                            <Button style={{ width: 290 }} htmlType="submit" loading={loading}>Login</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}