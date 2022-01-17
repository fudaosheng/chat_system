export const handleReceiveMessage = (e: MessageEvent<any>) => {
  console.log('Message from server ', e.data);
};
