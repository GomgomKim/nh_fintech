import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import { logout, login, changeBranch } from "./actions/loginAction";
import { connect } from "react-redux";

import './App.css';
import Layout from './components/Layout';
import { NotFound, Login } from './pages';
import con from './const';

class App extends Component {
  componentWillMount() {
    this.initializeUserInfo();
  }
  componentDidMount() {
    // const userInfo = reactLocalStorage.getObject(`${con.appName}#adminUser`);
    // const pathname = this.props.location.pathname.split('/');

    // if (!userInfo.idx && this.props.location.pathname !== "/") {
    //   alert("로그인이 필요합니다.");
    //   this.props.history.push("/");
    // }
    // if (userInfo.idx && this.props.location.pathname === "/") {
    //   this.props.history.push("/main");
    // }
  }

  initializeUserInfo = () => {
    const userInfo = reactLocalStorage.getObject(con.appName + "#adminUser");
    if (!userInfo || !userInfo.id) return;
    this.props.onLogin(userInfo);
  };
  render() {
    const { location } = this.props;
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        {location.pathname === '/404' ? (
          <Route component={NotFound} />
        ) : (
          <Route path="/:page" component={Layout} />
        )}
      </Switch>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
