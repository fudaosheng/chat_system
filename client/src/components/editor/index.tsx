import React, { createRef } from 'react';
import { Picker } from 'emoji-mart';
import { Popover } from '@douyinfe/semi-ui';
import { IconEmoji } from '@douyinfe/semi-icons';
import 'emoji-mart/css/emoji-mart.css'
import { PopoverProps } from '@douyinfe/semi-ui/popover';
import styles from './index.module.scss';
import classNames from 'classnames';
import { removeAllPlaceholderEle } from './util';
const eleName = 'custom-editor-placeholder';

interface Props {
  trigger?: 'hover' | 'click';
  position?: PopoverProps['position'];
  className?: string;
  sendMessage?: (value: string) => void;
}
export const Editor: React.FC<Props> = (props: Props) => {
  const { className = '', trigger = 'click', position = 'topLeft', sendMessage } = props;
  const editorRef = createRef<HTMLDivElement>();

  const handleSelectEmoji = (e: any) => {
    // 获取鼠标选区
    const range = window.getSelection()?.getRangeAt(0);
    if (!editorRef?.current || !range) {
      return;
    }
    const emoji = e.native;
    const emojoEle = document.createTextNode(emoji);
    if (trigger === 'click') {
      // 占位符
      const placeholderEle = editorRef.current.getElementsByTagName(eleName)[0];
      if (!placeholderEle) {
        return;
      }
      // 插入emoji
      editorRef.current.insertBefore(emojoEle, placeholderEle);
      // 设置range位置
      range.setStartBefore(placeholderEle);
      range.collapse();
    }
    if (trigger === 'hover') {
      // 判断选区是否在编辑器范围内
      if (range && editorRef.current?.contains(range.commonAncestorContainer)) {
        range.insertNode(emojoEle);
        range.collapse();
      }
    }
    // focus
    editorRef.current.focus();
  };

  // todo：ctrl + enter有时需要两次enter健换行
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 && !(e.ctrlKey || e.shiftKey)) {
      // 阻止换行
      e.preventDefault();
      sendMessage && sendMessage(e.target.innerText);
      e.target.innerHTML = '';
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

  const handleBlur = (e: any) => {
    if (trigger === 'hover') {
      return;
    }
    // 删除之前插入的自定义标签
    editorRef?.current && removeAllPlaceholderEle(editorRef.current, eleName);
    // 插入自定义标签
    const range = window.getSelection()?.getRangeAt(0);
    range?.insertNode(document.createElement(eleName));
  };
  return (
    <div className={classNames({
      [styles.editorWrap]: true,
      [className]: true
    })}>
      <div className={styles.functionTab}>
        <Popover
          trigger={trigger}
          position={position}
          autoAdjustOverflow={false}
          content={<Picker title="Pick your emoji…" set="apple" onSelect={handleSelectEmoji} />}
        >
          <IconEmoji size="large" />
        </Popover>
      </div>
      <div
        ref={editorRef}
        tabIndex={10}
        className={styles.richEditor}
        contentEditable
        data-placeholder="请输入内容"
        onBlur={handleBlur}
        onFocus={() => editorRef?.current && removeAllPlaceholderEle(editorRef.current, eleName)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
