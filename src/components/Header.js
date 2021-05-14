import React from "react";
import { withRouter} from "react-router-dom";
import { Layout, Modal, Select } from "antd";
import { connect } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
import { httpPost, httpUrl } from "../api/httpClient";
import { logout, login, changeBranch } from "../actions/loginAction";
import con from "../const";
import { CopyOutlined, PhoneOutlined, TeamOutlined, IdcardOutlined, SettingOutlined } from '@ant-design/icons';
const Option = Select.Option;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      frIdx : 0,
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
    console.log(this.props.history.location.pathname)
    // console.log("frIdx : "+this.state.frIdx)

    const menus = [
      { idx: 1, name: '접수현황', icon: (<CopyOutlined />), url: '/order/OrderMain' },
      { idx: 2, name: '가맹점관리', icon: (<PhoneOutlined />), url: '/franchise/FranchiseMain' },
      { idx: 3, name: '기사관리', icon: (<TeamOutlined />), url: '/rider/RiderMain' },
      { idx: 4, name: '직원관리', icon: (<IdcardOutlined />), url: '/staff/StaffMain' },
      { idx: 5, name: '환경설정', icon: (<SettingOutlined />), url: '/setting/SettingMain' },
    ];

    const currentPage = menus.find(x => x.url == this.props.history.location.pathname);
    return (
      <Layout.Header style={{ background: "#fff", padding: 0 }}>
        <div
          style={{
            backgroundColor: "#000",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
            textAlign: "left",
            paddingRight: "20px"
          }}>
          <div className="menu-wrapper">
            {menus.map(row => {
              return (
                <div frIdx={this.state.frIdx} onClick={()=>this.props.history.push(row.url)} className={"top-menu " + (row.idx == currentPage.idx ? 'active' : '')}>
                  {row.icon}&nbsp;
                  {row.name}
                </div>
              );
            })}
            <Select 
            style={{ paddingLeft: "20px" }}
            placeholder="소속지사를 선택해 주세요." 
            className="override-select branch"
            onChange={(value) => {
              this.props.onChangeBranch(value);
            }}
            >
                <Option value={0}>플러스김포 / 플러스김포</Option>
                <Option value={1}>김포1지점 / 플러스김포</Option>
                <Option value={2}>김포2지점 / 플러스김포</Option>
            </Select>
          </div>

          <div className="menu-right">
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
    loginInfo: state.login.loginInfo,
    branch: state.login.loginInfo.branch,
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (userinfo) => dispatch(login(userinfo)),
    onLogout: () => dispatch(logout()),
    onChangeBranch: (value) => dispatch(changeBranch(value)),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
