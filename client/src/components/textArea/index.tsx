import React, { useState } from 'react';
import styles from './index.module.scss';
import { TextArea as SemiTextArea } from '@douyinfe/semi-ui';
import { TextAreaProps } from '@douyinfe/semi-ui/input';

interface Props extends TextAreaProps {
  sendMessage: (value: string) => void;
}

export const TextArea: React.FC<Props> = (props: Props) => {
  const { onEnterPress, sendMessage, ...restProps } = props;
  // const [value, setValue] = useState('');

  // 监听键盘事件，取消回车换行
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
    if (e.keyCode === 13 && e.ctrlKey) {
      e.target.value = `${e.target.value}\n`;
    }
  };

  // 回车事件
  const handleEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onEnterPress && onEnterPress(e);
    const { value } = e.target as any;
    sendMessage(value);
    // 清空输入框内容
    // (e.target as any).value = '';
  };

  return (
    <SemiTextArea
      autoFocus
      // value={value}
      // onChange={v => setValue(v)}
      {...restProps}
      onKeyDown={handleKeyDown}
      onEnterPress={handleEnterPress}
    />
  );
};
