import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";

import "./App.css";
import Layout from "./components/Layout";
import { NotFound, Login } from "./pages";
import con from "./const";

class App extends Component {
  componentDidMount() {
    const userInfo = reactLocalStorage.getObject(con.appName + "#adminUser");
    let pathname = this.props.location.pathname.split("/");

    // if (!userInfo.idx && this.props.location.pathname !== "/") {
    //   alert("로그인이 필요합니다.");
    //   this.props.history.push("/");
    // }
    // if (userInfo.idx && this.props.location.pathname === "/") {
    //   this.props.history.push("/main");
    // }
  }

  render() {
    const { location } = this.props;
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        {location.pathname === "/404" ? (
          <Route component={NotFound} />
        ) : (
          <Route path="/:page" component={Layout} />
        )}
      </Switch>
    );
  }
}

export default withRouter(App);
