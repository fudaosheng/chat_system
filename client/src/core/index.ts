import { Message } from './Message';
import { MessageType } from './typings';

// 初始化websocket
export const initWebsocket = (key: string) => {
  const { ws } = window;
  if(!ws) {
    return;
  }
  ws._key = key;
  // 给服务端发消息，设置唯一标识
  ws.onopen = () => {
    ws?.send(JSON.stringify({ type: MessageType.INIT, message: ws._key }));
  };
}

// 处理websocket连接建立成功
const handleWebsocketConnectionSuccess = (e: Event) => {
  console.log('websocket connection success');
};

// 处理连接关闭
const handleWebsocketConnectionClose = (e: Event) => {
  console.log('websocket connection closed');
}

// 利用websocket发送消息，JSON -> Blob
export const sendMessage = (message: Message) => {
  const { ws } = window;
  // 给服务端发消息，设置唯一标识
  return ws?.send(JSON.stringify(message));
}

/**
 *
 * @param key websocket的唯一标识
 */
export const registryWebSocket = () => {
  const ws = new WebSocket('ws://127.0.0.1:8080');

  ws.addEventListener('open', handleWebsocketConnectionSuccess);
  ws.addEventListener('close', handleWebsocketConnectionClose);
  
  window.ws = ws;
};

// 注销websocket
export const destoryWebsocket = () => {
  const { ws } = window;
  ws?.removeEventListener('open', handleWebsocketConnectionSuccess);
  ws?.removeEventListener('close', handleWebsocketConnectionClose);

  // 关闭连接
  ws?.close();
  window.ws = undefined;
};
