import { Message } from './Message';
import { MessageType } from './typings';
const pingGap = 1000 * 60 * 2; // 2分钟ping一次

// 心跳保活
export const ping = (ws: WebSocket, key: string, cb?: (timer: NodeJS.Timeout) => void): void => {
  const message = JSON.stringify({ type: MessageType.PING, message: key });
  let timer: NodeJS.Timeout | undefined;

  const registryPing = () => {
    ws.send(message);
    timer && clearInterval(timer);
    timer = setInterval(() => {
      ws.send(message);
    }, pingGap);
    cb && cb(timer);
  };

  if (ws.readyState === 1) {
    registryPing();
  } else {
    ws.onopen = () => {
      registryPing();
    };
  }
};


// 处理websocket连接建立成功
const handleWebsocketConnectionSuccess = (e: Event) => {
  console.log('websocket connection success');
};

// 处理连接关闭
const handleWebsocketConnectionClose = (e: Event) => {
  console.log('websocket connection closed');
}

// 利用websocket发送消息，JSON -> Blob
export const sendMessage = (ws: WebSocket, message: Message) => {
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
  return ws;
};

// 注销websocket
export const destoryWebsocket = (ws: WebSocket) => {
  ws?.removeEventListener('open', handleWebsocketConnectionSuccess);
  ws?.removeEventListener('close', handleWebsocketConnectionClose);

  // 关闭连接
  ws?.close();
};
