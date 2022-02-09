import React, { forwardRef, useState, MutableRefObject } from 'react';
import { Picker } from 'emoji-mart';
import { Popover, Upload, Toast, Button } from '@douyinfe/semi-ui';
import { IconEmoji, IconImage } from '@douyinfe/semi-icons';
import { customRequestArgs } from '@douyinfe/semi-ui/upload';
import 'emoji-mart/css/emoji-mart.css';
import { PopoverProps } from '@douyinfe/semi-ui/popover';
import styles from './index.module.scss';
import classNames from 'classnames';
import { userUploadImg } from 'common/api/file';

/**
 * 富文本编辑组件
 * @author fudaosheng
 */
interface Props {
  trigger?: 'hover' | 'click';
  position?: PopoverProps['position'];
  couldUploadImage?: boolean;
  className?: string;
  placeholder?: string;
  onEnterPress?: (e: HTMLDivElement) => void;
  onChange?: (value: string) => void;
  onUploadImageSuccess?: (url: string) => void;
}
export const Editor = forwardRef<HTMLDivElement, Props>((props, ref) => {
  //必须要传ref
  const {
    className = '',
    trigger = 'click',
    position = 'topLeft',
    placeholder = '请输入内容',
    couldUploadImage = true,
    onEnterPress,
    onChange,
    onUploadImageSuccess,
  } = props;
  const [range, setRange] = useState<Range>();

  const handleSelectEmoji = (e: any) => {
    const emoji = e.native;
    const emojoEle = document.createTextNode(emoji);
    // 获取鼠标选区
    const realRange = trigger === 'hover' ? window.getSelection()?.getRangeAt(0) : range;
    // 判断选区是否在编辑器范围内
    if (realRange && (ref as MutableRefObject<HTMLDivElement>)?.current?.contains(realRange.commonAncestorContainer)) {
      realRange.insertNode(emojoEle);
      realRange.collapse();
      onChange && onChange((ref as MutableRefObject<HTMLDivElement>)?.current?.innerHTML);
    }
    // focus
    (ref as MutableRefObject<HTMLDivElement>)?.current?.focus();
  };

  // todo：ctrl + enter有时需要两次enter健换行
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 && !(e.ctrlKey || e.shiftKey)) {
      onEnterPress && onEnterPress(e);
    }
    // shift | ctrl + enter重写换行
    if (e.keyCode === 13 && (e.shiftKey || e.ctrlKey)) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const brEle = document.createElement('br');
        // shift和ctrl需要collapse的时机不一样
        e.shiftKey && range.collapse();
        range.insertNode(brEle);
        e.ctrlKey && range.collapse();
      }
    }
  };

  const handleKeyUp = (e: any) => {
    onChange && onChange(e?.target?.innerText);
  };

  const handleBlur = (e: any) => {
    if (trigger === 'hover') {
      return;
    }
    const range = window.getSelection()?.getRangeAt(0);
    setRange(range);
  };

  // 自定义上传
  const handleUploadImg = async (params: customRequestArgs) => {
    try {
      const { data } = await userUploadImg(params.fileInstance);
      if (data.url) {
        // 发送图片
        onUploadImageSuccess && onUploadImageSuccess(data.url);
      }
    } finally {
    }
  };
  return (
    <div
      className={classNames({
        [styles.editorWrap]: true,
        [className]: true,
      })}>
      <div className={styles.functionTab}>
        <Popover
          trigger={trigger}
          position={position}
          // autoAdjustOverflow={false}
          content={<Picker title="Pick your emoji…" set="apple" onSelect={handleSelectEmoji} />}>
          <Button icon={<IconEmoji size="large" />} theme="borderless" type="tertiary" />
        </Popover>
        {couldUploadImage && (
          <Upload
            action={''}
            name="img"
            accept={'image/*'}
            showUploadList={false}
            customRequest={handleUploadImg}
            onError={() => Toast.error('上传失败')}>
            <Button icon={<IconImage size="large" />} theme="borderless" type="tertiary" />
          </Upload>
        )}
      </div>
      <div
        ref={ref}
        tabIndex={10}
        className={styles.richEditor}
        contentEditable
        data-placeholder={placeholder}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
});
