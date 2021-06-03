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
    calcChange();
  });

  return (

    <React.Fragment>
    <div className="Dialog-overlay" onClick={() => close()} />

    <div className="payment-container" style={{ textAlign: 'left' }}>



        {/* 타이틀 */}

        <div className="detail-title">
            <div>결제내역</div>
            <div onClick={() => close()}> <img src={require("../../../img/login/close.png").default} alt="exit" /> </div>
        </div>

        {/* 컨텐츠 */}
        <div className="detail-content">

            <div className="split-content-box">

              <div className="split-content-title">

                  <div>내역수정</div>

                  <div className="plus-btn">
                    {editable && (
                        <Button
                          type="primary"
                          style={{ backgroundColor: "black" , borderColor: "black" }}
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

                            <div
                              key={orderPayment.idx}
                            >
                              <div>
                              {editable ? (
                                <Select
                                  style={{width: 100, fontSize: 16, marginRight: 5, marginBottom: 10}}
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
                                  style={{width: 95, fontSize: 16, marginRight: 5, marginBottom: 10}}
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
                              </div>

                              <div>
                              {!editable && (
                                <Select 
                                style={{width: 95, fontSize: 16, marginRight: 5, marginBottom: 10}}
                                value={orderPayment.paymentStatus}>
                                  {paymentStatus.map((value, index) => {
                                    if (index === 0) {
                                      return;
                                    }
                                    return <Option value={index}>{value}</Option>;
                                  })}
                                </Select>
                              )}
                              </div>

                              <div>
                              {editable ? (
                                <Input
                                  style={{width:220, textAlign: 'center', fontSize: 16, padding:3, marginBottom: 10}}
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
                              </div>

                              <div>
                              {editable && (
                                <Button
                                  type="primary"
                                  style={{backgroundColor: "black", borderColor:"black", marginLeft:5}}
                                  onClick={() => handleMinus(orderPayment.idx)}
                                >
                                 <p> - </p>
                                </Button>
                              )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </FormItem>

                  ) : (
                    <div style={{fontSize: 18, fontWeight: "bold", color:"black", textAlign:'center'}}>
                      결제 정보가 존재하지 않습니다.
                    </div>
                  )}

            </div> 

                  <div className="split-bottom-box">

                    <div>{orderPrice > 0 ? `남은금액` : `주문금액` } : {comma(change) + " 원"}</div>   

                    <div>
                      {editable && (
                        <Button
                          style={{width: 120, height: 40, fontSize: 18, backgroundColor:'black', borderColor:'black', marginTop: 20}}
                          type="primary"
                          onClick={() => {
                            if (orderPrice > 0 && calcSum() > orderPrice) {
                              Modal.info({
                                title: "설정 오류",
                                content: "결제 금액이 초과 되었습니다.",
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
)
}
//     <React.Fragment>
//       <div className="Dialog-overlay" onClick={() => close()} />

//       <div className="registFran-Dialog">
        
//         <div className="registFran-container">
          
//             <div className="registFran-title">
//               결제내역
//             </div>
//             <div>
//           <img onClick={() => close()} src={require("../../../img/login/close.png").default} alt="exit" className="surcharge-close" />

//           </div>
//           <Form>
//             <div className="layout">
//               <div className="modifyOrderLayout">
//                 <div className="mainTitle" style={{ marginBottom: "15px" }}>
//                   내역수정
//                 </div>

//                 <div className="plus-btn">
//                 {editable && (
//                   <Button
//                     type="primary"
//                     style={{
//                       float: "right",
//                     }}
//                     onClick={handlePlus}
//                   >
//                     +
//                   </Button>
//                 )}
//                 </div>


//                 {data.length > 0 ? (
//                   <FormItem name="orderPayments">
//                     <div className="orderPayments-wrapper">
//                       {data.map((orderPayment, i) => {
//                         return (
//                           <div
//                             className="orderPayment-wrapper"
//                             key={orderPayment.idx}
//                           >
//                             <div>
//                             {editable ? (
//                               <Select
//                                 defaultValue={orderPayment.paymentMethod}                                
//                                 onChange={(value) => {
//                                   const newData = data;
//                                   newData[i].paymentMethod = value;
//                                   setData(newData);
//                                 }}
//                               >
//                                 {paymentMethod.map((value, index) => {
//                                   if (index === 0) {
//                                     return;
//                                   }
//                                   return <Option value={index}>{value}</Option>;
//                                 })}
//                               </Select>
//                             ) : (
//                               <Select
//                                 value={orderPayment.paymentMethod}
//                                 onChange={(value) => {
//                                   const newData = data;
//                                   newData[i].paymentMethod = value;
//                                   setData(newData);
//                                 }}
//                               >
//                                 {paymentMethod.map((value, index) => {
//                                   if (index === 0) {
//                                     return;
//                                   }
//                                   return <Option value={index}>{value}</Option>;
//                                 })}
//                               </Select>
//                             )}
//                             </div>

//                             <div>
//                             {!editable && (
//                               <Select value={orderPayment.paymentStatus}>
//                                 {paymentStatus.map((value, index) => {
//                                   if (index === 0) {
//                                     return;
//                                   }
//                                   return <Option value={index}>{value}</Option>;
//                                 })}
//                               </Select>
//                             )}
//                             </div>

//                             <div>
//                             {editable ? (
//                               <Input
//                                 defaultValue={orderPayment.paymentAmount}
//                                 onChange={(e) => {
//                                   const newData = data;
//                                   newData[i].paymentAmount = parseInt(
//                                     e.target.value
//                                   );
//                                   setData(newData);
//                                   calcChange();
//                                 }}
//                               ></Input>
//                             ) : (
//                               <Input value={orderPayment.paymentAmount}></Input>
//                             )}
//                             </div>

//                             <div>
//                             {editable && (
//                               <Button
//                                 type="primary"
//                                 onClick={() => handleMinus(orderPayment.idx)}
//                               >
//                                 -
//                               </Button>
//                             )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </FormItem>
//                 ) : (
//                   <div className="orderPayments-wrapper">
//                     결제 정보가 존재하지 않습니다.
//                   </div>
//                 )}
//                 <div className="btnWrapper">
//                   {editable && (
//                     <Button
//                       type="primary"
//                       onClick={() => {
//                         if (calcSum() > orderPrice) {
//                           Modal.info({
//                             title: "설정 오류",
//                             content: "결제 금액이 초과 되었습니다.",
//                           });
//                           return;
//                         }
//                         handlePaymentChange(data);
//                         close();
//                       }}
//                     >
//                       등록하기
//                     </Button>
//                   )}
//                   <div className="mainTitle">{comma(change) + " 원"}</div>
//                   <div className="mainTitle">남은금액 :</div>
//                 </div>
//               </div>
//             </div>
//           </Form>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

export default PaymentDialog;
