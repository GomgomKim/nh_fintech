import { Checkbox, Modal } from "antd";
import React, { Component } from "react";
import "../../../css/modal.css";

class FilteringDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: [
        {
          key: "orderStatus-1",
          value: 1,
          text: "접수",
        },
        {
          key: "orderStatus-2",
          value: 2,
          text: "배차",
        },
        {
          key: "orderStatus-3",
          value: 3,
          text: "픽업",
        },
        {
          key: "orderStatus-4",
          value: 5,
          text: "취소",
        },
      ],
      paymentMethod: [
        {
          key: "paymentMethod-1",
          value: 1,
          text: "카드",
        },
        {
          key: "paymentMethod-2",
          value: 2,
          text: "현금",
        },
        {
          key: "paymentMethod-3",
          value: 3,
          text: "선결",
        },
      ],
      selectedOrderStatus: this.props.selectedOrderStatus,
      selectedPaymentMethods: this.props.selectedPaymentMethods,
    };
    this.formRef = React.createRef();
  }

  render() {
    const { isOpen, close } = this.props;
    return (
      <React.Fragment>
        {isOpen ? (
          <React.Fragment>
            <div
              className="Dialog-overlay"
              onClick={() =>
                close(
                  this.state.selectedOrderStatus,
                  this.state.selectedPaymentMethods
                )
              }
            />
            <div className="filtering-Dialog">
              <div className="filtering-content">
                <div className="timeDelay-title">상태 필터링</div>
                <img
                  onClick={() => {
                    if (
                      this.state.selectedOrderStatus.length === 0 ||
                      this.state.selectedPaymentMethods.length === 0
                    ) {
                      Modal.info({
                        title: "필터링 설정 오류",
                        content:
                          "주문상태와 결제방식 각각 적어도 1개 항목을 선택해야 합니다.",
                      });
                      return;
                    }
                    close(
                      this.state.selectedOrderStatus,
                      this.state.selectedPaymentMethods
                    );
                  }}
                  src={require("../../../img/login/close.png").default}
                  className="filtering-close"
                  alt="closeModal"
                />
                <div className="filtering-inner">
                  <div className="filtering-box-wrapper">
                    <div
                      className="filtering-box"
                      style={{ borderRight: "1px solid #ccc" }}
                    >
                      <div className="timeDelay-sub-title">주문상태</div>

                      {this.state.orderStatus.map((o) => {
                        return (
                          <div className="filtering-btn">
                            <Checkbox
                              key={o.key}
                              value={o.value}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const result =
                                    this.state.selectedOrderStatus.concat(
                                      e.target.value
                                    );
                                  this.setState({
                                    selectedOrderStatus: result,
                                  });
                                } else {
                                  const result =
                                    this.state.selectedOrderStatus.filter(
                                      (el) => el !== e.target.value
                                    );
                                  this.setState({
                                    selectedOrderStatus: result,
                                  });
                                }
                              }}
                              defaultChecked={
                                this.state.selectedOrderStatus.includes(o.value)
                                  ? "checked"
                                  : ""
                              }
                            >
                              {o.text}
                            </Checkbox>
                          </div>
                        );
                      })}
                    </div>
                    <div className="filtering-box">
                      <div className="timeDelay-sub-title">결제방식</div>

                      {this.state.paymentMethod.map((o) => {
                        return (
                          <div className="filtering-btn">
                            <Checkbox
                              key={o.key}
                              value={o.value}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const result =
                                    this.state.selectedPaymentMethods.concat(
                                      e.target.value
                                    );
                                  this.setState({
                                    selectedPaymentMethods: result,
                                  });
                                } else {
                                  const result =
                                    this.state.selectedPaymentMethods.filter(
                                      (el) => el !== e.target.value
                                    );
                                  this.setState({
                                    selectedPaymentMethods: result,
                                  });
                                }
                              }}
                              defaultChecked={
                                this.state.selectedPaymentMethods.includes(
                                  o.value
                                )
                                  ? "checked"
                                  : ""
                              }
                            >
                              {o.text}
                            </Checkbox>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default FilteringDialog;
