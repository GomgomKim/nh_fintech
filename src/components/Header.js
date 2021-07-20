import {
  CopyOutlined,
  SkinOutlined,
  PhoneOutlined,
  SettingOutlined,
  TeamOutlined,
  MobileFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Modal } from "antd";
import React from "react";
import { connect } from "react-redux";
import { comma } from "../lib/util/numberUtil";
import { withRouter, Link } from "react-router-dom";
import { login, logout } from "../actions/loginAction";
import { httpPost, httpUrl } from "../api/httpClient";
import "../css/modal_m.css";
import "../css/modal.css";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      frIdx: 0,
    };
  }

  // initializeUserInfo = () => {
  //   const userInfo = reactLocalStorage.getObject(con.appName + "#adminUser");
  //   if (!userInfo || !userInfo.id) return;
  //   this.props.onLogin(userInfo);
  // };

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
    // this.initializeUserInfo();
  }

  render() {
    // console.log(this.props.history.location.pathname);
    // console.log("frIdx : "+this.state.frIdx)
    const menus = [
      {
        idx: 1,
        name: "접수현황",
        icon: <CopyOutlined />,
        url: "/order/OrderMain",
      },

      {
        idx: 2,
        name: "가맹점관리",
        icon: <PhoneOutlined />,
        url: "/franchise/FranchiseMain",
      },
      {
        idx: 3,
        name: "기사관리",
        icon: <TeamOutlined />,
        url: "/rider/RiderMain",
      },
      {
        idx: 4,
        idx: "desk",
        name: "상품관리",
        icon: <SkinOutlined />,
        url: "/mall/MallMain",
        className: "desk",
      },
      {
        idx: 5,
        name: "환경설정",
        icon: <SettingOutlined />,
        url: "/setting/SettingMain",
        className: "desk",
      },
    ];

    const currentPage = menus.find(
      (x) => x.url === this.props.history.location.pathname
    );
    return (
      <Layout.Header style={{ background: "#fff", padding: 0 }}>
        <div
          style={{
            backgroundColor: "#000",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
            textAlign: "left",
          }}
        >
          <div className="menu-wrapper desk">
            {menus.map((row) => {
              return (
                <div
                  key={row.idx}
                  // frIdx={this.state.frIdx}
                  onClick={() => this.props.history.push(row.url)}
                  className={
                    "top-menu " + (row.idx === currentPage.idx ? "active" : "")
                  }
                >
                  {row.icon}&nbsp;
                  {row.name}
                </div>
              );
            })}
          </div>
          <div className="menu-wrapper mobile">
            {menus.map((row) => {
              return (
                <div
                  key={row.className}
                  // frIdx={this.state.frIdx}
                  onClick={() => this.props.history.push(row.url)}
                  className={
                    "top-menu " +
                    (row.idx === currentPage.idx ? "active" : "") +
                    (row.className && " " + row.className)
                  }
                >
                  {row.icon}&nbsp;
                  {row.name}
                </div>
              );
            })}
          </div>

          {/* <div className="header"> 모바일 햄버거
            <div className="header-top-menu mobile">
              <div className="ham-menu" onClick={() => { this.setState({ openSlideMenu: 1 }) }}>
                <div /><div /><div />
              </div>

              <div className="header-logo">
                <Link to='/receptionstatus'><img src={require('../img/header/header_logo-m-02.png').default} alt="logo" /></Link>
              </div>
            </div>

            {this.state.openSlideMenu === 1 &&
              <div className="slide-menu-overaly mobile" onClick={() => { this.setState({ openSlideMenu: 0 }) }}>
                <div className="slide-menu" >
                  <div>
                    <div> <img src={require('../img/header/reset.png').default} alt="close" /></div>
                    <div> <img src={require('../img/header/shop.png').default} alt="shop" />  </div>


                  </div>

                  <div>
                    <Link to='/receptionStatus'><div>  접수현황 </div></Link>
                    <Link to='/franchiseMain'><div> 가맹점관리 </div></Link>
                    <Link to='/riderMain'><div>  라이더관리 </div></Link>

                    <div onClick={() => { this.logout() }}> <img src={require('../img/header/logout.png').default} alt="logout" /> 로그아웃 </div>
                  </div>

                </div>
              </div>
            } </div> 모바일버전 끝 */}

          <div className="menu-right">
            <div className="desk"
              style={{ display: "inline-block" }}>
              관리자&nbsp;&nbsp;&nbsp;|
              {/* {this.props.loginInfo.userId}&nbsp;&nbsp;&nbsp;| */}
            </div>
            <div
              style={{ display: "inline-block", cursor: "pointer" }}
              className="desk"
              onClick={() => {
                this.setState({ visible: true });
              }}
            >
              &nbsp;&nbsp;&nbsp;로그아웃
            </div>
            <div
              style={{ display: "inline-block", cursor: "pointer" }}
              className="mobile"
              onClick={() => {
                this.setState({ visible: true });
              }}
            >
              &nbsp;&nbsp;&nbsp;
              <LogoutOutlined />
            </div>
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
          destroyOnClose={true}
        >
          <div>로그아웃 하시겠습니까?</div>
        </Modal>
      </Layout.Header>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    isLogin: state.login.isLogin,
    loginInfo: state.login.loginInfo,
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (userinfo) => dispatch(login(userinfo)),
    onLogout: () => dispatch(logout()),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
