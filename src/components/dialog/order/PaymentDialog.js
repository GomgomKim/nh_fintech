import { Button, Form, Input, Modal, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import "../../../css/modal.css";
import { paymentMethod, paymentStatus } from "../../../lib/util/codeUtil";
import { comma } from "../../../lib/util/numberUtil";

const PaymentDialog = ({
  close,
  orderPayments,
  handlePaymentChange,
  editable,
  orderPrice,
}) => {
  const Option = Select.Option;
  const FormItem = Form.Item;
  const [data, setData] = useState(orderPayments ? orderPayments : []);
  const [change, setChange] = useState(0);
  const [maxIdx, setMaxIdx] = useState(1);

  // 결제수단별 1개 항목씩만 존재 가능
  const checkPaymentMethods = (data) => {
    if (data.length > 3) {
      return false;
    }
    let methods = [];
    for (let i = 0; i < data.length; i++) {
      if (methods.includes(data[i].paymentMethod)) {
        return false;
      } else {
        methods.push(data[i].paymentMethod);
      }
    }
    return true;
  };

  const validatePaymentAmount = (data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].paymentAmount <= 0) {
        return false;
      }
    }
    return true;
  };

  const handlePlus = () => {
    if (data.length >= 3) {
      Modal.info({
        title: "설정오류",
        content: "결제방식은 최대 3가지입니다.",
      });
      return;
    }
    setData(
      data.concat({
        idx: maxIdx,
        paymentAmount: 0,
        paymentMethod: 1,
        paymentStatus: 1,
      })
    );
    setMaxIdx(maxIdx + 1);
  };

  const handleMinus = (index) => {
    setData(data.filter((v, idx) => v.idx !== index));
  };
  const handleMax = (index) => {
    let newData = [...data];
    newData.forEach((payment) => {
      if (payment.idx === index) {
        payment.paymentAmount = change + payment.paymentAmount;
      }
    });
    setData(newData);
  };
  const handleReset = (index) => {
    let newData = [...data];
    newData.forEach((payment) => {
      if (payment.idx === index) {
        payment.paymentAmount = 0;
      }
    });
    setData(newData);
  };
  const calcSum = useCallback(() => {
    let res = 0;
    for (let i = 0; i < data.length; i++) {
      res += data[i].paymentAmount;
    }
    return res;
  }, [data]);
  const calcChange = useCallback(() => {
    setChange(orderPrice - calcSum());
  }, [orderPrice, calcSum]);

  useEffect(() => {
    // console.log("orderpayments!!!!!!!!!!!!!");
    // console.log(orderPayments);
    calcChange();
    let initialIndex = 0;
    for (let i = 0; data.length > i; i++) {
      initialIndex = Math.max(initialIndex, data[i].idx);
    }
    setMaxIdx(initialIndex + 1);
  }, [calcChange, data]);

  return (
    <React.Fragment>
      <div className="Dialog-overlay" onClick={() => close()} />

      <div className="payment-container" style={{ textAlign: "left" }}>
        {/* 타이틀 */}

        <div className="detail-title">
          <div>결제내역</div>
          <div onClick={() => close()}>
            {" "}
            <img
              src={require("../../../img/login/close.png").default}
              alt="exit"
            />{" "}
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="detail-content">
          <div className="split-content-box">
            <div className="split-content-title">
              <div>{editable ? "내역수정" : "내역조회"}</div>

              <div className="plus-btn">
                {editable && (
                  <Button
                    type="primary"
                    style={{ backgroundColor: "black", borderColor: "black" }}
                    onClick={handlePlus}
                  >
                    <p>+</p>
                  </Button>
                )}
              </div>
            </div>

            <div className="split-payment-box">
              {data.length > 0 ? (
                <FormItem>
                  <div>
                    {data.map((orderPayment, i) => {
                      return (
                        <div key={orderPayment.idx}>
                          <div className="desk">
                            {editable ? (
                              <Select
                                style={{
                                  width: 80,
                                  fontSize: 16,
                                  marginRight: 5,
                                  marginBottom: 10,
                                }}
                                defaultValue={orderPayment.paymentMethod}
                                onChange={(value) => {
                                  const newData = data;
                                  newData[i].paymentMethod = value;
                                  setData(newData);
                                }}
                              >
                                {paymentMethod.map((value, index) => {
                                  if (index === 0) {
                                    return <></>;
                                  }
                                  return <Option value={index}>{value}</Option>;
                                })}
                              </Select>
                            ) : (
                              <Select
                                style={{
                                  width: 90,
                                  fontSize: 16,
                                  marginRight: 5,
                                  marginBottom: 10,
                                }}
                                value={orderPayment.paymentMethod}
                                disabled
                              >
                                {paymentMethod.map((value, index) => {
                                  if (index === 0) {
                                    return <></>;
                                  }
                                  return <Option value={index}>{value}</Option>;
                                })}
                              </Select>
                            )}
                          </div>
                          <div className="mobile">
                            {editable ? (
                              <Select
                                style={{
                                  width: 75,
                                  fontSize: 16,
                                  marginRight: 5,
                                  marginBottom: 10,
                                }}
                                defaultValue={orderPayment.paymentMethod}
                                onChange={(value) => {
                                  const newData = data;
                                  newData[i].paymentMethod = value;
                                  setData(newData);
                                }}
                              >
                                {paymentMethod.map((value, index) => {
                                  if (index === 0) {
                                    return <></>;
                                  }
                                  return <Option value={index}>{value}</Option>;
                                })}
                              </Select>
                            ) : (
                              <Select
                                style={{
                                  width: 90,
                                  fontSize: 16,
                                  marginRight: 5,
                                  marginBottom: 10,
                                }}
                                value={orderPayment.paymentMethod}
                                disabled
                              >
                                {paymentMethod.map((value, index) => {
                                  if (index === 0) {
                                    return <></>;
                                  }
                                  return <Option value={index}>{value}</Option>;
                                })}
                              </Select>
                            )}
                          </div>

                          <div>
                            {!editable && (
                              <Select
                                style={{
                                  width: 90,
                                  fontSize: 16,
                                  marginRight: 5,
                                  marginBottom: 10,
                                }}
                                value={orderPayment.paymentStatus}
                                disabled
                              >
                                {paymentStatus.map((value, index) => {
                                  if (index === 0) {
                                    return <></>;
                                  }
                                  return <Option value={index}>{value}</Option>;
                                })}
                              </Select>
                            )}
                          </div>

                          <div className="desk">
                            {editable ? (
                              <Input
                                type="number"
                                style={{
                                  width: 110,
                                  textAlign: "center",
                                  fontSize: 16,
                                  padding: 3,
                                  marginBottom: 10,
                                }}
                                defaultValue={
                                  orderPayment.paymentAmount === ""
                                    ? 0
                                    : orderPayment.paymentAmount
                                }
                                value={orderPayment.paymentAmount}
                                onChange={(e) => {
                                  const newData = data;
                                  newData[i].paymentAmount = parseInt(
                                    e.target.value
                                  );
                                  setData(newData);
                                  calcChange();
                                }}
                              ></Input>
                            ) : (
                              <Input
                                type="number"
                                value={orderPayment.paymentAmount}
                                style={{
                                  width: 180,
                                  textAlign: "center",
                                  fontSize: 16,
                                  padding: 3,
                                  marginBottom: 10,
                                }}
                              ></Input>
                            )}
                          </div>
                          <div className="mobile">
                            {editable ? (
                              <Input
                                type="number"
                                style={{
                                  width: 125,
                                  textAlign: "center",
                                  fontSize: 16,
                                  padding: 3,
                                  marginBottom: 10,
                                }}
                                defaultValue={
                                  orderPayment.paymentAmount === ""
                                    ? 0
                                    : orderPayment.paymentAmount
                                }
                                onChange={(e) => {
                                  const newData = data;
                                  newData[i].paymentAmount = parseInt(
                                    e.target.value
                                  );
                                  setData(newData);
                                  calcChange();
                                }}
                              ></Input>
                            ) : (
                              <Input
                                type="number"
                                value={orderPayment.paymentAmount}
                                style={{
                                  width: 125,
                                  textAlign: "center",
                                  fontSize: 16,
                                  padding: 3,
                                  marginBottom: 10,
                                }}
                              ></Input>
                            )}
                          </div>

                          <div>
                            {editable && (
                              <>
                                <Button
                                  type="primary"
                                  style={{
                                    backgroundColor: "black",
                                    borderColor: "black",
                                    marginLeft: 5,
                                  }}
                                  onClick={() => handleMax(orderPayment.idx)}
                                >
                                  <p> 최대 </p>
                                </Button>

                                <Button
                                  type="primary"
                                  style={{
                                    backgroundColor: "black",
                                    borderColor: "black",
                                    marginLeft: 5,
                                  }}
                                  onClick={() => handleReset(orderPayment.idx)}
                                >
                                  <p> 리셋 </p>
                                </Button>

                                <Button
                                  type="primary"
                                  style={{
                                    backgroundColor: "black",
                                    borderColor: "black",
                                    marginLeft: 5,
                                  }}
                                  onClick={() => handleMinus(orderPayment.idx)}
                                >
                                  <p> - </p>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </FormItem>
              ) : (
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  결제 정보가 존재하지 않습니다.
                </div>
              )}
            </div>

            <div className="split-bottom-box">
              <div>
                {orderPrice > 0 ? `남은금액` : `주문금액`} :{" "}
                {comma(change) + " 원"}
              </div>

              <div>
                {editable && (
                  <Button
                    style={{
                      width: 120,
                      height: 40,
                      fontSize: 18,
                      backgroundColor: "black",
                      borderColor: "black",
                      marginTop: 20,
                    }}
                    type="primary"
                    onClick={() => {
                      console.log(orderPrice > 0);
                      console.log(calcSum() > orderPrice);
                      if (!validatePaymentAmount(data)) {
                        Modal.info({
                          title: "설정 오류",
                          content: "결제 금액은 0보다 작을 수 없습니다.",
                        });
                        return;
                      }

                      if (orderPrice >= 0 && calcSum() !== orderPrice) {
                        Modal.info({
                          title: "설정 오류",
                          content: "결제 금액을 확인해주세요.",
                        });
                        return;
                      }

                      if (!checkPaymentMethods(data)) {
                        Modal.info({
                          title: "설정 오류",
                          content: "결제방식 당 하나의 항목만 추가 가능합니다.",
                        });
                        return;
                      }
                      handlePaymentChange(data);
                      close();
                    }}
                  >
                    등록하기
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PaymentDialog;
