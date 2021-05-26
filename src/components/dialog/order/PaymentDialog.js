import React, { Component, useEffect, useState } from "react";
import { Form, Modal, Input, DatePicker, Button, Select, Table } from "antd";
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
import { comma } from "../../../lib/util/numberUtil";

const PaymentDialog = ({
  isOpen,
  close,
  orderPayments,
  handlePaymentChange,
  editable,
  orderPrice,
}) => {
  const Option = Select.Option;
  const FormItem = Form.Item;
  const [data, setData] = useState(orderPayments);
  const [change, setChange] = useState(0);
  const [maxIdx, setMaxIdx] = useState(1);
  const handlePlus = () => {
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
  const calcSum = () => {
    var res = 0;
    for (let i = 0; i < data.length; i++) {
      res += data[i].paymentAmount;
    }
    return res;
  };
  const calcChange = () => {
    setChange(orderPrice - calcSum());
  };

  useEffect(() => {
    calcChange();
    let initialIndex = 0;
    for (let i = 0; data.length > i; i++) {
      initialIndex = Math.max(initialIndex, data[i].idx);
    }
    setMaxIdx(initialIndex + 1);
  });

  return (
    <React.Fragment>
      {isOpen ? (
        <React.Fragment>
          <div className="Dialog-overlay" onClick={close} />
          <div className="registFran-Dialog">
            <div className="registFran-container">
              <div className="registFran-title">결제내역</div>
              <img
                onClick={close}
                src={require("../../../img/login/close.png").default}
                className="surcharge-close"
                alt="exit"
              />
              <Form>
                <div className="layout">
                  <div className="modifyOrderLayout">
                    <div className="mainTitle" style={{ marginBottom: "15px" }}>
                      내역수정
                    </div>
                    {editable && (
                      <Button
                        type="primary"
                        style={{
                          float: "right",
                        }}
                        onClick={handlePlus}
                      >
                        +
                      </Button>
                    )}
                    {data.length > 0 ? (
                      <FormItem name="orderPayments">
                        <div className="orderPayments-wrapper">
                          {data.map((orderPayment, i) => {
                            console.log(orderPayment, i);
                            return (
                              <div
                                className="orderPayment-wrapper"
                                key={orderPayment.idx}
                              >
                                {editable ? (
                                  <Select
                                    defaultValue={orderPayment.paymentMethod}
                                    onChange={(value) => {
                                      const newData = data;
                                      newData[i].paymentMethod = value;
                                      setData(newData);
                                    }}
                                  >
                                    {paymentMethod.map((value, index) => {
                                      if (index === 0) {
                                        return;
                                      }
                                      return (
                                        <Option value={index}>{value}</Option>
                                      );
                                    })}
                                  </Select>
                                ) : (
                                  <Select
                                    value={orderPayment.paymentMethod}
                                    onChange={(value) => {
                                      const newData = data;
                                      newData[i].paymentMethod = value;
                                      setData(newData);
                                    }}
                                  >
                                    {paymentMethod.map((value, index) => {
                                      if (index === 0) {
                                        return;
                                      }
                                      return (
                                        <Option value={index}>{value}</Option>
                                      );
                                    })}
                                  </Select>
                                )}
                                {editable ? (
                                  <Select
                                    defaultValue={orderPayment.paymentStatus}
                                  >
                                    {paymentStatus.map((value, index) => {
                                      if (index === 0) {
                                        return;
                                      }
                                      return (
                                        <Option value={index}>{value}</Option>
                                      );
                                    })}
                                  </Select>
                                ) : (
                                  <Select value={orderPayment.paymentStatus}>
                                    {paymentStatus.map((value, index) => {
                                      if (index === 0) {
                                        return;
                                      }
                                      return (
                                        <Option value={index}>{value}</Option>
                                      );
                                    })}
                                  </Select>
                                )}
                                {editable ? (
                                  <Input
                                    defaultValue={orderPayment.paymentAmount}
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
                                    value={orderPayment.paymentAmount}
                                  ></Input>
                                )}
                                {editable && (
                                  <Button
                                    type="primary"
                                    onClick={() =>
                                      handleMinus(orderPayment.idx)
                                    }
                                  >
                                    -
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </FormItem>
                    ) : (
                      <div className="orderPayments-wrapper">
                        결제 정보가 존재하지 않습니다.
                      </div>
                    )}
                    <div className="btnWrapper">
                      {editable && (
                        <Button
                          type="primary"
                          onClick={() => {
                            handlePaymentChange(data);
                            close();
                          }}
                        >
                          등록하기
                        </Button>
                      )}
                      <div className="mainTitle">{comma(change) + " 원"}</div>
                      <div className="mainTitle">남은금액 :</div>
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
};

export default PaymentDialog;
