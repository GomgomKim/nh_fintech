import React, { Component } from "react";
import "../../css/order.css";
import "../../css/common.css";
import ReceptionStatus from "./ReceptionStatus";

class OrderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogData: true,
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="">
        <ReceptionStatus />
      </div>
    );
  }
}
export default OrderMain;
