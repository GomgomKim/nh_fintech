import React from "react";
import { Layout, Modal } from "antd";
import { connect } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";

import { httpPost, httpUrl } from "../api/httpClient";
import { logout, login } from "../actions/loginAction";
import con from "../const";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  initializeUserInfo = () => {
    const userInfo = reactLocalStorage.getObject(con.appName + "#adminUser");
    if (!userInfo || !userInfo.id) return;
    this.props.onLogin(userInfo);
  };

  logout = () => {
    httpPost(httpUrl.logout, [], {})
      .then(() => {
        this.props.onLogout();
        global.location.href = "/";
      })
      .catch((e) => {
        global.location.href = "/";
      });
  };

  componentDidMount() {
    this.initializeUserInfo();
  }

  render() {
    return (
      <Layout.Header style={{ background: "#fff", padding: 0 }}>
        <div
          style={{
            backgroundColor: "#000",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
            textAlign: "right",
            paddingRight: "20px"
          }}>
          <div style={{ display: "inline-block" }}>
            관리자&nbsp;&nbsp;&nbsp;|
            {/* {this.props.loginInfo.userId}&nbsp;&nbsp;&nbsp;| */}
          </div>
          <div
            style={{ display: "inline-block", cursor: "pointer" }}
            onClick={() => {
              this.setState({ visible: true });
            }}>
            &nbsp;&nbsp;&nbsp;로그아웃
          </div>
        </div>
        <Modal
          visible={this.state.visible}
          title="로그아웃"
          okText="확인"
          cancelText="취소"
          onOk={this.logout}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          destroyOnClose={true}>
          <div>로그아웃 하시겠습니까?</div>
        </Modal>
      </Layout.Header>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    isLogin: state.login.isLogin,
    loginInfo: state.login.loginInfo
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (userinfo) => dispatch(login(userinfo)),
    onLogout: () => dispatch(logout())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
