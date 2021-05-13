import React from "react";
import { Layout as AntLayout } from "antd";
import { withRouter,  } from "react-router-dom";

import {  Header, Footer, Content } from "./";
import { connect } from "react-redux";

class Layout extends React.Component {
  render() {
    // 개발시 주석 처리
    return (
      <AntLayout>
        {/* <Sider location={this.props.location} /> */}
        <AntLayout style={{ minWidth: "1280px" }}>
          <Header/>
          <Content/>
          <Footer />
        </AntLayout>
      </AntLayout>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    isLogin: state.login.isLogin,
    loginInfo: state.login.loginInfo
  };
};

export default connect(mapStateToProps)(withRouter(Layout));
