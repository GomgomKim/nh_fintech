import { combineReducers } from "redux";
import login from "./loginReducer";
import websock from "./websocketReducer";

export default combineReducers({
  login, websock
});
