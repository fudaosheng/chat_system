// 删除之前插入的自定义标签
export const removeAllPlaceholderEle = (parentEle: HTMLElement, tagName: string) => {
  if (!parentEle || !tagName) {
    return;
  }
  const placeholderEles = parentEle.getElementsByTagName(tagName);
  if (placeholderEles?.length) {
    for (let i = 0; i < placeholderEles.length; i++) {
      parentEle.removeChild(placeholderEles[i]);
    }
  }
};
