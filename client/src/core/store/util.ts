import { LOCAL_STORAGE_CHAT_LIST } from 'common/constance/localStorage';
import { Chat, CHAT_TYPE } from 'core/typings';

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

export const findIndex = (chatId: number, chatType: CHAT_TYPE, chatList: Array<Chat>) => {
  return chatList.findIndex(item => item?.id === chatId && item.type === chatType);
}

// 将会话置顶
export const toTopChat = (index: number, chatList: Array<Chat>) => {
  const oldChat = chatList[index];
  chatList.splice(index, 1);
  chatList.unshift(oldChat);
  return chatList;
}