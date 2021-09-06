import React, { Component } from "react";
import { Form, Modal, Input, DatePicker, Button, Select } from "antd";
import "../../../css/modal.css";
import { httpUrl, httpPost } from "../../../api/httpClient";
import {
  deliveryStatusCode,
  modifyType,
  paymentMethod,
  paymentStatus,
} from "../../../lib/util/codeUtil";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { formatDate } from "../../../lib/util/dateUtil";

const Option = Select.Option;
const FormItem = Form.Item;

class ModifyOrderDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ data: this.props.data });
  }

  handleChange = (e, stateKey) => {
    const data = this.state.data;
    data[stateKey] = e.target.value;
    this.setState({ data: data }, () => console.log(this.state.data));
  };

  handleSubmit = () => {
    console.log(this.state.data);
    httpPost(httpUrl.orderUpdate, [], this.state.data)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {});
  };

  render() {
    const { isOpen, close, data } = this.props;

    return (
      <React.Fragment>
        {isOpen ? (
          <React.Fragment>
            <div className="Dialog-overlay" onClick={close} />
            <div className="modifyOrder-Dialog">
              <div className="modifyOrder-container">
                <div className="modifyFran-title">주문 수정</div>
                <img
                  onClick={close}
                  src={require("../../../img/login/close.png").default}
                  className="surcharge-close"
                  alt="닫기"
                />

                <Form ref={this.formRef} onFinish={this.handleSubmit}>
                  <div className="layout">
                    <div className="modifyOrderLayout">
                      <div className="modifyOrderWrapper">
                        {/* <div className="mainTitle">상태</div>
                          <FormItem name="orderStatus" className="selectItem">
                            <Input
                              placeholder="주문 상태를 입력해 주세요."
                              className="override-input"
                              defaultValue={data.orderStatus}
                              onChange={(e) =>
                                this.handleChange(e, "orderStatus")
                              }
                            ></Input>
                          </FormItem> */}
                        <div className="contentBlock">
                          <div className="mainTitle">주문상태</div>
                          <Select
                            className="override-input"
                            defaultValue={data.orderStatus}
                            onChange={(value) => {
                              var flag = true;

                              if (
                                !modifyType[data.orderStatus].includes(value)
                              ) {
                                Modal.info({
                                  content: <div>상태를 바꿀 수 없습니다.</div>,
                                });
                                flag = false;
                              }

                              // 대기중 -> 픽업중 변경 시 강제배차 알림
                              if (data.orderStatus === 1 && value === 2) {
                                Modal.info({
                                  content: <div>강제배차를 사용하세요.</div>,
                                });
                              }

                              // 제약조건 성립 시 상태 변경
                              if (flag) {
                                this.setState({
                                  data: {
                                    ...this.state.data,
                                    orderStatus: value,
                                  },
                                });
                              }
                            }}
                          >
                            {deliveryStatusCode.map((value, index) => {
                              if (index === 0) return <></>;
                              else
                                return <Option value={index}>{value}</Option>;
                            })}
                          </Select>
                        </div>
                        <div className="contentBlock">
                          <div className="mainTitle">결제방식</div>
                          <FormItem name="orderPayments" className="selectItem">
                            <div className="orderPayments-wrapper">
                              {data.orderPayments.map((orderPayment) => {
                                return (
                                  <div className="override-input orderPayment-wrapper">
                                    <Select
                                      defaultValue={orderPayment.paymentMethod}
                                    >
                                      {paymentMethod.map((value, index) => {
                                        if (index == 0) {
                                          return;
                                        }
                                        return (
                                          <Option value={index}>{value}</Option>
                                        );
                                      })}
                                    </Select>
                                    <Select
                                      defaultValue={orderPayment.paymentStatus}
                                    >
                                      {paymentStatus.map((value, index) => {
                                        if (index == 0) {
                                          return;
                                        }
                                        return (
                                          <Option value={index}>{value}</Option>
                                        );
                                      })}
                                    </Select>
                                    <Input
                                      placeholder="결제방식을 입력해 주세요."
                                      defaultValue={orderPayment.paymentAmount}
                                      onChange={(e) =>
                                        this.handleChange(e, "orderPayments")
                                      }
                                    ></Input>
                                  </div>
                                );
                              })}
                            </div>
                          </FormItem>
                        </div>
                        <div className="contentBlock">
                          <div className="mainTitle">고객 전화번호</div>
                          <FormItem name="custPhone" className="selectItem">
                            <Input
                              placeholder="고객 전화번호를 입력해 주세요."
                              className="override-input"
                              defaultValue={data.custPhone}
                              onChange={(e) =>
                                this.handleChange(e, "custPhone")
                              }
                            ></Input>
                          </FormItem>
                        </div>
                        <div className="contentBlock">
                          <div className="mainTitle">음식준비 완료</div>
                          <FormItem name="itemPrepared" className="selectItem">
                            <Checkbox
                              defaultChecked={data.itemPrepared}
                              onChange={(e) => {
                                this.setState({
                                  data: {
                                    ...this.state.data,
                                    itemPrepared: e.target.checked,
                                  },
                                });
                              }}
                            />
                          </FormItem>
                        </div>
                        <div className="contentBlock">
                          <div className="mainTitle">요청시간</div>
                          <FormItem name="arriveReqDate" className="selectItem">
                            <DatePicker
                              className="override-input"
                              showTime
                              onChange={(value) => {
                                const newDate = value.toDate();
                                const data = this.state.data;
                                data["arriveReqDate"] = formatDate(newDate);
                                this.setState({ data: data }, () =>
                                  console.log(this.state.data)
                                );
                              }}
                              onOk={(value) => {
                                const newDate = value.toDate();
                                const data = this.state.data;
                                data["arriveReqDate"] = formatDate(newDate);
                                this.setState({ data: data }, () =>
                                  console.log(this.state.data)
                                );
                              }}
                            />
                          </FormItem>
                        </div>
                        <div className="contentBlock">
                          <div className="mainTitle">주소</div>
                          <FormItem name="destAddr1" className="selectItem">
                            <Input
                              placeholder="주소를 입력해 주세요."
                              className="override-input"
                              defaultValue={data.destAddr1}
                              onChange={(e) =>
                                this.handleChange(e, "destAddr1")
                              }
                            ></Input>
                          </FormItem>
                        </div>
                        <div className="contentBlock">
                          <div className="mainTitle">상세주소</div>
                          <FormItem name="destAddr2" className="selectItem">
                            <Input
                              placeholder="상세주소를 입력해 주세요."
                              className="override-input"
                              defaultValue={data.destAddr2}
                              onChange={(e) =>
                                this.handleChange(e, "destAddr2")
                              }
                            ></Input>
                          </FormItem>
                        </div>
                        <div className="contentBlock">
                          <div className="mainTitle">지번주소</div>
                          <FormItem name="destAddr3" className="selectItem">
                            <Input
                              placeholder="지번주소를 입력해 주세요."
                              className="override-input"
                              defaultValue={data.destAddr3}
                              onChange={(e) =>
                                this.handleChange(e, "destAddr3")
                              }
                            ></Input>
                          </FormItem>
                        </div>
                        <div className="modifyOrderBtn">
                          <Button
                            style={{
                              width: "10rem",
                              height: "3rem",
                              fontSize: "1rem",
                            }}
                            type="primary"
                            htmlType="submit"
                            className="callTab"
                          >
                            수정하기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default ModifyOrderDialog;
