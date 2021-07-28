import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { Layout, Modal, Button } from "antd";
import { login, logout } from "../actions/loginAction";
import { websockConnected, websockDisconnected, websockDuplicated } from "../actions/websocketAction";
import { httpGet, httpPost, httpUrl } from "../api/httpClient";
import Const from "../const";

const wsReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};
const getWSReadyStateStr = (state) => {
  return state === 0
    ? 'CONNECTING'
    : state === 1
    ? 'OPEN'
    : state === 2
    ? 'CLOSING'
    : state === 3
    ? 'CLOSED'
    : '';
};
class NNWebSocket extends Component {
  constructor(props) {
    super(props);
    this.url =
      Const.wsProtocol +
      '://' +
      Const.serverIp +
      ':' +
      Const.serverPort +
      '/ws/nnbox';
    this.state = {
      appState: '',
      visible: false,
      message: ''
    };
  }

  componentDidMount() {
    this.initWS();
    this.wsTimeInterval = setInterval(() => {
      this.checkWS();
    }, 20000);
  }
  componentWillUnmount() {
    clearInterval(this.wsTimeInterval);
  }

  initWS = () => {
    console.log('=================initWS==================');
    if (global.ws != null) {
      console.log('ws is not null');
      global.ws.close();
      global.ws = null;
    }
    global.ws = new WebSocket(this.url);
    global.ws.onopen = () => {
      // connection opened
      console.log('ws open!!');
      global.ws.send('something'); // send a message
      this.props.websockConnected();
    };
    global.ws.onmessage = (e) => {
      // a message was received
      console.log(`ws onmessage, data: ${e.data}, type: ${typeof e.data}`);
      if (e.data == 'logged in from another location') {
        this.props.websockDuplicated();
        this.props.websockDisconnected();
        alert('다른곳에서 접속하여 채팅서버 연결이 종료됩니다. 다시 로그인하기 전까지 채팅메시지를 실시간으로 받을 수 없습니다.')
        return;
      }
      let message = {};
      try {
        // if (typeof e.data !== 'object') {
        //   return;
        // }
        console.log('parse message');
        message = JSON.parse(e.data);
        console.log(message);
      } catch (error) {
        console.log(
          `ws onmessage, raised exception. e: ${error}, data: ${e.data}`,
        );
        return;
      }
      let data = {};
      if (message.data instanceof Object) data = message.data;
      else data = JSON.parse(message.data);
      console.log(data);
      if (message.messageType == 'CHAT') {
        console.log('## chat message ##')
        console.log(message)

        let oppName = '';
        if (this.props.loginReducer.loginInfo.idx == message.data.member1) {
          oppName = message.data.member2Name;
        }
        else oppName = message.data.member1Name;

        if (!global.chatAprear && !global.chatDetailAprear) {
          //채팅중이 아닐때만 띄우기
          this.setState({
            visible: true, 
            message: '['+oppName+'] ' + message.data.lastMessage
          })
        }
        else {
          //채팅창 활성화 시 해당 컴포넌트로 전송
          if (global.chatListener) global.chatListener(message.data);
          if (global.chatDetailListener) global.chatDetailListener(message.data);
        }
      }
    };
    global.ws.onerror = (e) => {
      // an error occurred
      console.log(`ws onerror. message: ${e.message}`);
    };
    global.ws.onclose = (e) => {
      // connection closed
      console.log(`ws onclose. code: ${e.code}, reason: ${e.reason}`);
      this.props.websockDisconnected();
    };
  };
  checkWS = () => {
    // console.log('checkWS');
    if (!this.props.loginReducer.isLogin) {
      console.log('checkWs isloggedin');
      return;
    }
    if (global.ws === null || typeof global.ws === 'undefined') {
      console.log(`wsTimeInterval. ws invalid type. type: ${typeof global.ws}`);
      return;
    }
    if (this.props.websockInfo.isDuplicated) {
      console.log('connected from another PC')
    }
    if (global.ws.readyState !== wsReadyState.OPEN) {
      console.log(
        `wsTimeInterval. url: ${this.url}, readyState: ${getWSReadyStateStr(
          global.ws.readyState,
        )}`,
      );
      // this.getOrderInfo();
    }
    if (global.ws.readyState === wsReadyState.CLOSED) {
      console.log(`wsTimeInterval, ws reconnect. url: ${this.url}`);
      global.ws = null;
      this.initWS();
    }
  };
  render() {
    return (
        <div>
          <Modal
            visible={this.state.visible}
            title="채팅알람"
            okText="확인"
            onOk={() => {
              this.setState({ visible: false });
            }}
            footer={[
              <Button key="ok" onClick={() => {
                this.setState({ visible: false });
              }}>
                확인
              </Button>]}
            destroyOnClose={true}
          >
            <div>{this.state.message}</div>
          </Modal>
        </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    loginReducer: state.login,
    websockInfo: state.websock
  };
};

let mapDispatchToProps = (dispatch) => 
    bindActionCreators({ login, logout, websockConnected, websockDisconnected, websockDuplicated }, dispatch);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NNWebSocket));
