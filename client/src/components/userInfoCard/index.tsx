import React, { useCallback, useContext, useRef, useState } from 'react';
import { Avatar, Button, Popover, Upload, Toast, Input, Form } from '@douyinfe/semi-ui';
import { customRequestArgs } from '@douyinfe/semi-ui/upload';
import { FormApi } from '@douyinfe/semi-ui/form';
import { IconEdit, IconCamera } from '@douyinfe/semi-icons';
import { GlobalContext } from 'common/store';
import styles from './index.module.scss';
import { uploadImg } from 'common/api/file';
import { setUserAvatar, setUserBio, updateUserInfo } from 'common/api/user';
import { GlobalAction } from 'common/store/action';
import { formatDate } from 'common/utils';
import { SEX } from 'common/constance';

const imageOnly = 'image/*';

const hoverMask = (
  <div className={styles.iconCamera}>
    <IconCamera />
  </div>
);

export const UserInfoCard: React.FC = () => {
  const {
    state: { userInfo },
    dispatch,
  } = useContext(GlobalContext);

  // 个性签名
  const [editBio, setEditBio] = useState(false);
  // 编辑其他账号信息
  const [editOtherInfo, setEditOtherInfo] = useState(false);
  const formApi = useRef<FormApi>({} as FormApi);

  const handleUploadImg = useCallback(
    async (params: customRequestArgs) => {
      try {
        const { data } = await uploadImg(params.fileInstance);
        if (data.url) {
          dispatch(GlobalAction.setUserInfo({ ...userInfo, avatar: data.url }));
          // 发起请求异步更新数据库里图片链接
          setUserAvatar(data.url);
        }
      } finally {
      }
    },
    [userInfo]
  );

  const handleSaveBio = (e: any) => {
    const { value = '' } = e.target;
    if (value && value !== userInfo.bio) {
      setUserBio(value);
      dispatch(GlobalAction.setUserInfo({ ...userInfo, bio: value }));
      setEditBio(false);
    } else {
      Toast.info('请修改后再保存');
    }
  };

  // 渲染个性签名
  const renderBioContent = () => {
    const { bio = '' } = userInfo;

    return editBio ? (
      <div style={{ width: 200 }}>
        <Input
          key={bio}
          defaultValue={bio}
          placeholder="请输入个性签名，回车保存"
          maxLength={50}
          onBlur={() => setEditBio(false)}
          onEnterPress={handleSaveBio}
        />
      </div>
    ) : (
      <div>
        <span style={{ marginRight: 4 }}>{bio || '请输入个性签名'}</span>
        <Button
          icon={<IconEdit size="small" />}
          type="tertiary"
          theme="borderless"
          onClick={e => {
            // 关闭事件冒泡，否则popover会被关闭
            setEditBio(true);
            e.stopPropagation();
          }}
        />
      </div>
    );
  };

  // 渲染其他用户信息
  const renderOtherInfo = () => {
    const { birthday, sex, phone_num } = userInfo;
    const sexInfo = sex ? (sex === SEX.MAN ? '男' : '女') : undefined;
    return (
      <>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>手机</span>
          <span className={styles.info}>{phone_num || '请完善信息'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>性别</span>
          <span className={styles.info}>{sexInfo || '请完善信息'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>生日</span>
          <span className={styles.info}>{birthday || '请完善信息'}</span>
        </div>
      </>
    );
  };

  // 效验用户信息
  const handleValidateFields = (defaultValue: Record<string, any>) => {
    const _value: Record<string, any> = { phone_num: '', sex: undefined, birthday: '', ...defaultValue };
    const errors: Record<string, string> = {};
    for (let key in _value) {
      const value = _value[key];
      if (!value) {
        errors[key] = '值不能为空';
        continue;
      }
      // 对手机号码值进行效验，必须全部为数字
      if (key === 'phone_num' && !value.split('').every((l: string) => /\d/.test(l))) {
        errors[key] = '手机号码值必须全为数字';
        continue;
      }
      if (key === 'phone_num' && value.length !== 11) {
        errors[key] = '手机号码长度必须为11位';
      }
    }

    return Object.keys(errors).length ? errors : '';
  };

  // 渲染编辑其他信息表单
  const renderEditOtherInfoForm = () => {
    const { phone_num, sex, birthday } = userInfo;
    const initValue = { phone_num, sex, birthday };
    return (
      <Form
        validateFields={handleValidateFields}
        labelPosition="left"
        getFormApi={_ => (formApi.current = _)}
        initValues={initValue}>
        <Form.Input field="phone_num" label="手机号码" maxLength={11} style={{ width: 200 }} />
        <Form.RadioGroup field="sex" label="性别">
          <Form.Radio value="1">男</Form.Radio>
          <Form.Radio value="2">女</Form.Radio>
        </Form.RadioGroup>
        <Form.DatePicker format="yyyy-MM-dd" type="date" field="birthday" label="生日" />
      </Form>
    );
  };

  // 保存或编辑用户信息
  const handleEditOrSaveUserInfo = async () => {
    // 切换到编辑模式
    if (!editOtherInfo) {
      setEditOtherInfo(true);
    } else {
      // 保存编辑
      try {
        // 效验失败会抛出error,能走到下面说明效验成功
        const result = await formApi.current.validate();
        const birthday = formatDate(new Date(result.birthday), 'yyyy-MM-dd');
        const userOtherInfo: Record<string, any> = { ...result, birthday };
        await updateUserInfo(userOtherInfo);
        // 更新全局的用户信息
        dispatch(GlobalAction.setUserInfo({ ...userInfo, ...userOtherInfo, sex: Number(userOtherInfo.sex) }));
        setEditOtherInfo(false);
      } finally {
      }
    }
  };
  const renderUserInfoCard = () => {
    return (
      <div className={styles.userInfoCard}>
        <div className={styles.editBtn} onClick={handleEditOrSaveUserInfo}>
          {editOtherInfo ? '保存' : '编辑'}
        </div>
        <div className={styles.top}>
          <div className={styles.avatar}>
            <Upload
              className="avatar-upload"
              action={''}
              name="img"
              accept={imageOnly}
              showUploadList={false}
              customRequest={handleUploadImg}
              onError={() => Toast.error('上传失败')}>
              <Avatar src={userInfo.avatar} size="large" hoverMask={hoverMask} />
            </Upload>
          </div>
          <div className={styles.main}>
            <div className={styles.name}>{userInfo.name || ''}</div>
            <div className={styles.bio}>{renderBioContent()}</div>
          </div>
        </div>
        <div className={styles.otherInfo}>{editOtherInfo ? renderEditOtherInfoForm() : renderOtherInfo()}</div>
      </div>
    );
  };
  return (
    <div>
      <Popover trigger="click" content={renderUserInfoCard()} position="bottomRight">
        <Avatar src={userInfo.avatar}>{userInfo.name.substring(0, 2)}</Avatar>
      </Popover>
    </div>
  );
};
