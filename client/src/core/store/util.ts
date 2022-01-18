import { LOCAL_STORAGE_CHAT_LIST } from 'common/constance/localStorage';
import { Chat } from 'core/typings';

// 从缓存中获取消息列表
export const getChatListWithStorage = () => {
  let chatList;
  const storageJSON = localStorage.getItem(LOCAL_STORAGE_CHAT_LIST);
  try {
    chatList = storageJSON ? JSON.parse(storageJSON) : undefined;
  } catch(err) {
      console.error(err); 
  }
  return chatList;
};

export const findIndex = (chatId: number, chatList: Array<Chat>) => {
  return chatList.findIndex(item => item?.id === chatId);
}