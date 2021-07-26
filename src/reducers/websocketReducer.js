import { WEBSOCK_CONNECTED, WEBSOCK_DISCONNECTED, WEBSOCK_DUPLICATED } from "../actions/websocketAction";
import { reactLocalStorage } from "reactjs-localstorage";
import con from "../const";

const websocketInitialState = {
  isConnected: false,
  isDuplicated: false,
};

const websock = (state = websocketInitialState, action) => {
  switch (action.type) {
    case WEBSOCK_CONNECTED:
      return Object.assign({}, state, {
        isConnected: true,
      });
    case WEBSOCK_DISCONNECTED:
      return Object.assign({}, state, {
        isConnected: false,
      });
    case WEBSOCK_DUPLICATED:
      return Object.assign({}, state, {
        isDuplicated: true,
      });
    default:
      return state;
  }
};

export default websock;
