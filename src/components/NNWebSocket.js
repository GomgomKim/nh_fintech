import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { login, logout } from "../actions/loginAction";
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
    };
  }

  componentDidMount() {
    alert(global.ws)
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
    };
    global.ws.onmessage = (e) => {
      // a message was received
      console.log(`ws onmessage, data: ${e.data}, type: ${typeof e.data}`);
      if (e.data == 'logged in from another location') {
        // alert('중복로그인')
        // this.props.logout();
        // httpPost(httpUrl.logout, [], {})
        //   .then((result) => {
        //     console.log('logout result=' + result);
        //   })
        //   .catch((e) => console.log('## logout error: ' + e));
        // alert('다른 핸드폰에서 접속하여 로그아웃됩니다.');
        // console.log('다른 핸드폰에서 접속하여 로그아웃됩니다.');

        // Navigation.setRoot({
        //   root: {
        //     component: {
        //       name: 'navigation.Login',
        //       passProps: {
        //         manualLogout: true,
        //       },
        //     },
        //   },
        // });
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
        // alert('챗')
        // if (!global.chatAprear && !global.chatDetailAprear) {
        //   //채팅중이 아닐때만 띄우기
        //   let oppName = data.member1 == this.props.loginReducer.loginInfo.idx ? data.member2Name : data.member1Name
        //   if (oppName == '') oppName = '관제'
        //   Navigation.showModal({
        //     component: {
        //       name: 'navigation.BasicDialog',
        //       passProps: {
        //         title: data.title,
        //         content:
        //         '#[채팅] ' + oppName + '# ' + data.lastMessage,
        //         okText: '확인',
        //         onOk: () => {
        //         },
        //       },
        //       options: {
        //         topBar: {drawBehind: true, visible: false},
        //         screenBackgroundColor: 'transparent',
        //         modalPresentationStyle: 'overCurrentContext',
        //       },
        //     },
        //   });
        // }
        // else {
        //   //채팅창 활성화 시 해당 컴포넌트로 전송
        //   if (global.chatListener) global.chatListener(data);
        //   if (global.chatDetailListener) global.chatDetailListener(data);
        // }
      }
    };
    global.ws.onerror = (e) => {
      // an error occurred
      console.log(`ws onerror. message: ${e.message}`);
    };
    global.ws.onclose = (e) => {
      // connection closed
      console.log(`ws onclose. code: ${e.code}, reason: ${e.reason}`);
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
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginReducer: state.login,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ login, logout }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(NNWebSocket);