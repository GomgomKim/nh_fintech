import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import { OrderMain, FranchiseMain, RiderMain, SettingMain } from "../pages";
import MallMain from "../pages/mall/MallMain";
import { Redirect } from "react-router-dom";

export default class Content extends Component {
  componentDidMount() {
    // console.log("Content fr idx :"+this.props.selectedFrIdx)
  }

  render() {
    return (
      <Layout.Content style={{ margin: "8px 8px 0" }}>
        <div style={{ padding: 8, background: "#fff" }}>
          <Switch>
            {/* 게시글 */}
            <Route exact path="/order/OrderMain" component={OrderMain} />
            <Route exact path="/franchise/FranchiseMain" component={FranchiseMain} />
            <Route exact path="/rider/RiderMain" component={RiderMain} />
            <Route exact path="/mall/MallMain" component={MallMain} />
            <Route exact path="/setting/SettingMain" component={SettingMain} />
            <Redirect to="/" />

          </Switch>
        </div>
      </Layout.Content>
    );
  }
}
