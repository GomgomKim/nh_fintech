export const WEBSOCK_CONNECTED = 'WEBSOCK_CONNECTED';
export const WEBSOCK_DISCONNECTED = 'WEBSOCK_DISCONNECTED';
export const WEBSOCK_DUPLICATED = 'WEBSOCK_DUPLICATED'

export function websockConnected() {
  return {
    type: WEBSOCK_CONNECTED,
  };
}
export function websockDisconnected() {
  return {
    type: WEBSOCK_DISCONNECTED,
  };
}
export function websockDuplicated() {
  return {
    type: WEBSOCK_DUPLICATED,
  };
}