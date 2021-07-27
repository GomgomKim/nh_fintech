import React from "react";
import { Layout as AntLayout } from "antd";
import { withRouter, } from "react-router-dom";
import { Header, Footer, Content, NNWebSocket } from "./";
import { connect } from "react-redux";

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageWidth: window.innerWidth
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize = ()=> {
    this.setState({pageWidth: window.innerWidth})
  }
  
  render() {
    // 개발시 주석 처리
    return (
      <>
          <AntLayout>
            {/* <Sider location={this.props.location} /> */}
            <AntLayout style={{ minWidth: this.state.pageWidth > 1199 ? "1280px" : "300px" }}>
              <Header />
              <Content />
              <Footer />
            </AntLayout>
          </AntLayout>
        <NNWebSocket />
      </>
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
