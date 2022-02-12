import React, { forwardRef, useState, MutableRefObject, createRef } from 'react';
import { Picker } from 'emoji-mart';
import { Popover, Upload, Toast, Button } from '@douyinfe/semi-ui';
import { IconEmoji, IconImage } from '@douyinfe/semi-icons';
import { UploadProps } from '@douyinfe/semi-ui/upload';
import 'emoji-mart/css/emoji-mart.css';
import { PopoverProps } from '@douyinfe/semi-ui/popover';
import styles from './index.module.scss';
import classNames from 'classnames';
import { ButtonProps } from '@douyinfe/semi-ui/button';

/**
 * 富文本编辑组件
 * @author fudaosheng
 */
interface Props {
  trigger?: 'hover' | 'click';
  position?: PopoverProps['position'];
  isFunctionTabAtBottom?: boolean; //为true功能tab在底部
  showSendButton?: boolean; //是否显示发送按钮
  sendButtomProps?: ButtonProps;
  className?: string;
  placeholder?: string;
  uploadProps?: UploadProps;
  onEnterPress?: (e: HTMLDivElement) => void;
  onChange?: (value: string) => void;
  onSend?: () => void; //点击发送按钮的回调
}
export const Editor = forwardRef<HTMLDivElement, Props>((props, ref) => {
  //必须要传ref
  const {
    className = '',
    trigger = 'click',
    position = 'topLeft',
    isFunctionTabAtBottom = false,
    placeholder = '请输入内容',
    uploadProps,
    showSendButton,
    sendButtomProps = {},
    onSend,
    onEnterPress,
    onChange,
  } = props;
  // range选区
  const [range, setRange] = useState<Range>();
  const uploadRef = createRef<Upload>();
  const uploadTriggerRef = createRef<HTMLDivElement>();

  const handleSelectEmoji = (e: any) => {
    const emoji = e.native;
    const emojoEle = document.createTextNode(emoji);
    // 获取鼠标选区
    const realRange = trigger === 'hover' ? window.getSelection()?.getRangeAt(0) : range;
    // 判断选区是否在编辑器范围内
    if (realRange && (ref as MutableRefObject<HTMLDivElement>)?.current?.contains(realRange.commonAncestorContainer)) {
      realRange.insertNode(emojoEle);
      realRange.collapse();
      onChange && onChange((ref as MutableRefObject<HTMLDivElement>)?.current?.innerText);
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
  return (
    <div
      className={classNames({
        [styles.editorWrap]: true,
        [className]: true,
      })}>
      <div
        className={classNames({
          [styles.main]: true,
          [styles.mainReverse]: isFunctionTabAtBottom,
        })}>
        <div className={classNames({[styles.functionTab]: true, [styles.functionTabAtBottom]: isFunctionTabAtBottom })}>
          <Popover
            trigger={trigger}
            position={position}
            // autoAdjustOverflow={false}
            content={<Picker title="Pick your emoji…" set="apple" onSelect={handleSelectEmoji} />}>
            <Button icon={<IconEmoji size="large" />} theme="borderless" type="tertiary" />
          </Popover>
          {uploadProps && (
            <Button
              icon={<IconImage size="large" />}
              theme="borderless"
              type="tertiary"
              onClick={() => uploadTriggerRef.current?.click()}
            />
          )}
        </div>
        <div
          ref={ref}
          tabIndex={10}
          className={classNames({
            [styles.richEditor]: true,
            [styles.richEditorReverse]: isFunctionTabAtBottom,
          })}
          contentEditable
          data-placeholder={placeholder}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
      </div>
      <div className={styles.fileList}>
        <Upload className={styles.upload} ref={uploadRef} onError={() => Toast.error('上传失败')} {...uploadProps}>
          <div ref={uploadTriggerRef}></div>
        </Upload>
      </div>
      <div className={styles.btnWrapper}>
        {showSendButton && (
          <Button theme="solid" { ...sendButtomProps } onClick={onSend}>
            发送
          </Button>
        )}
      </div>
    </div>
  );
});
