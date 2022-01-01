import React, { useCallback, useState, useMemo } from 'react';
import { Modal, Avatar, Form, Button, Toast } from '@douyinfe/semi-ui';
import { useContext } from 'react';
import { GlobalContext } from 'common/store';
import styles from './index.module.css';
import { login, LoginRequest, RegistryRequest, registryUser } from 'common/api/user';

enum Type {
    LOGIN, // 登陆
    REGISTRY// 注册
}

export const Login: React.FC = () => {
  const {
    state: { userInfo = {} },
  } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<Type>(Type.LOGIN);

  //登陆参数效验
  const handleLoginValidate = useCallback((values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    Object.keys(values).forEach(key => {
      if (!values[key]) {
        errors[key] = '值不能为空';
      } else if (values[key].length < 6) {
        errors[key] = '值的长度必须不小于6个字符';
      }
    });
    return Object.keys(errors).length ? errors : '';
  }, []);

  // 登陆
  const handleLogin = useCallback(async (values: Record<string, string>) => {
    setLoading(true);
    try {
      // 登陆
      if(type === Type.LOGIN) {
        await login(values as unknown as LoginRequest);
        Toast.info('登陆成功');
      } else if(type === Type.REGISTRY) { // 注册
        await registryUser(values as unknown as RegistryRequest)
        Toast.info('注册成功，请登陆');
        setType(Type.LOGIN)
      }
    } finally {
      setLoading(false);
    }
  }, [type]);

  // 弹窗标题
  const title = useMemo((): string => type === Type.LOGIN ? '登陆' : '注册', [type]);
  return (
    <Modal height={500} visible={!userInfo?.token} footer={null} title={title} closable={false}>
      <div className={styles.main}>
        <div className={styles.avatar}>
          <Avatar style={{ width: 100, height: 100 }} />
        </div>
        <div className={styles.loginForm}>
          <Form labelPosition="left" validateFields={handleLoginValidate} onSubmit={handleLogin}>
            <Form.Input field="name" style={{ width: 250 }} label="名称" placeholder="请输入用户名" required />
            <Form.Input field="password" style={{ width: 250 }} label="密码" placeholder="请输入密码" required />
            <div className={styles.submit}>
              <Button style={{ width: 290 }} type="primary" theme="solid" htmlType="submit" loading={loading}>
                { type === Type.LOGIN ? '登陆' : '注册账号'}
              </Button>
            </div>
            <div className={styles.registry}>
                {
                    type === Type.LOGIN && (
                        <Button type="primary" theme="borderless" onClick={() => setType(Type.REGISTRY)}>注册账号</Button>
                    )
                }
                {
                    type === Type.REGISTRY && (
                        <Button type="primary" theme="borderless" onClick={() => setType(Type.LOGIN)}>已有账号？登陆</Button>
                    )
                }
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
