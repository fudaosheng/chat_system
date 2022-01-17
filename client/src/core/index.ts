import { handleReceiveMessage } from './receiveMessage';
import { MessageType } from './typings';

// 初始化websocket
const initWebsocket = () => {
  const { ws } = window;
  // 给服务端发消息，设置唯一标识
  ws?.send(JSON.stringify({ type: MessageType.INIT, message: ws._key }));
}

// 处理websocket连接建立成功
const handleWebsocketConnectionSuccess = (e: Event) => {
  console.log('websocket connection success', e);
  
  // 初始化websocket
  initWebsocket();
};

// 处理连接关闭
const handleWebsocketConnectionClose = (e: Event) => {
  console.log('websocket connection closed');
}

/**
 *
 * @param key websocket的唯一标识
 */
export const registryWebSocket = (key: string) => {
  const ws = new WebSocket('ws://127.0.0.1:8080');

  ws.addEventListener('open', handleWebsocketConnectionSuccess);
  ws.addEventListener('message', handleReceiveMessage);
  ws.addEventListener('close', handleWebsocketConnectionClose);
  
  window.ws = ws;
  // 设置唯一标识
  window.ws._key = key;
};

// 注销websocket
export const destoryWebsocket = () => {
  const { ws } = window;
  ws?.removeEventListener('open', handleWebsocketConnectionSuccess);
  ws?.removeEventListener('message', handleReceiveMessage);
  ws?.removeEventListener('close', handleWebsocketConnectionClose);

  // 关闭连接
  ws?.close();
  window.ws = undefined;
};
