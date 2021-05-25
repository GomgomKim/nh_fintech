import React, { Component } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  Radio,
  Checkbox,
  Modal,
} from "antd";
import "../../../css/modal.css";
// import MapContainer from "./MapContainer";
import { NaverMap, Marker, Polyline } from "react-naver-maps";
import {
  modifyType,
  paymentMethod,
  paymentStatus,
  deliveryStatusCode,
} from "../../../lib/util/codeUtil";
import { formatDate, formatDateSecond } from "../../../lib/util/dateUtil";
import PaymentDialog from "./PaymentDialog";
import { httpUrl, httpPost } from "../../../api/httpClient";

// {
//   "arriveReqDate": "2021-05-01 00:00:00",
//   "custMessage": "문 앞에 놓아주세요.",
//   "custPhone": "010-0000-0000",
//   "deliveryPrice": 4000,
//   "destAddr1": "서울특별시 강남구 선릉로 717(논현동)",
//   "destAddr2": "3층",
//   "destAddr3": "서울특별시 강남구 논현동 111-22",
//   "itemPrepared": false,
//   "itemPreparingTime": 0,
//   "latitude": 37.51884425976253,
//   "longitude": 127.04050585566475,
//   "ncashPayEnabled": true,
//   "orderPayments": [
//     {
//       "paymentMethod": 1,
//       "paymentAmount": 10000,
//       "paymentStatus": 2
//     },
//     {
//       "paymentMethod": 2,
//       "paymentAmount": 20000,
//       "paymentStatus": 2
//     }
//   ],
//   "orderPrice": 10000
// }

const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;
const newOrder = {
  arriveReqDate: "",
  assignDate: "",
  cancelReason: "",
  completeDate: "",
  custMessage: "",
  custPhone: "",
  deliveryPrice: 0,
  deliveryPriceFee: 0,
  destAddr1: "",
  destAddr2: "",
  destAddr3: "",
  distance: 0,
  frId: "",
  frLatitude: 0,
  frLongitude: 0,
  frName: "",
  frPhone: "",
  idx: 0,
  itemPrepared: false,
  itemPreparingTime: 0,
  latitude: 0,
  longitude: 0,
  memo: "",
  ncashPayEnabled: true,
  orderIdx: 0,
  orderPayments: [
    {
      paymentAmount: 0,
      paymentMethod: 1,
      paymentStatus: 1,
    },
  ],
  orderPrice: 0,
  orderStatus: 1,
  pickupDate: "",
  riderName: "",
  riderPhone: "",
  tidNormal: "",
  tidNormalRate: 0,
  tidPrepay: "",
  userIdx: 0,
};

class RegistCallDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentOpen: false,
      editable: true,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      data: this.props.data ? this.props.data : newOrder,
    });
  }

  handleChangeInput = (value, stateKey) => {
    const newData = this.state.data;
    newData[stateKey] = value;
    this.setState({
      data: newData,
    });
  };

  openPaymentModal = () => {
    this.setState({ paymentOpen: true });
  };
  closePaymentModal = () => {
    this.setState({ paymentOpen: false });
  };
  handlePaymentChange = (result) => {
    this.setState({
      data: {
        ...this.state.data,
        orderPayments: result,
      },
    });
  };

  handleSubmit = () => {
    if (this.props.data) {
      console.log(this.state.data);
      httpPost(httpUrl.orderUpdate, [], this.state.data)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {});
    } else {
      const { data } = this.state;
      httpPost(httpUrl.orderCreate, [], {
        arriveReqDate: data.arriveReqDate,
        custMessage: data.custMessage,
        custPhone: data.custPhone,
        deliveryPrice: data.deliveryPrice,
        destAddr1: data.destAddr1,
        destAddr2: data.destAddr2,
        destAddr3: data.destAddr3,
        itemPrepared: data.itemPrepared,
        itemPreparingTime: data.itemPreparingTime,
        latitude: data.latitude,
        longitude: data.longitude,
        ncashPayEnabled: true,
        orderPayments: data.orderPayments,
        orderPrice: parseInt(data.orderPrice),
      })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {});
    }
  };

  render() {
    const { isOpen, close } = this.props;
    const data = this.props.data ? this.props.data : newOrder;
    const navermaps = window.naver.maps;

    return (
      <React.Fragment>
        {isOpen ? (
          <React.Fragment>
            <div className="Dialog-overlay" onClick={close} />
            <div className="registCall-Dialog">
              <div className="registCall-container">
                <div className="registCall-title">
                  {this.props.data ? "주문수정" : "주문등록"}
                </div>
                <img
                  onClick={close}
                  src={require("../../../img/login/close.png").default}
                  className="surcharge-close"
                  alt="닫기"
                />

                <Form ref={this.formIdRef} onFinish={this.handleSubmit}>
                  <div className="registCallLayout">
                    <div className="registCallWrapper">
                      <div className="contentBlock first-child">
                        <div className="mainTitle">가맹점명</div>
                        {/* <FormItem
                                                        name="franchiseName"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="가맹점을 선택해 주세요." className="override-select fran">
                                                            <Option value={0}>플러스김포 / 플러스김포</Option>
                                                            <Option value={1}>김포1지점 / 플러스김포</Option>
                                                            <Option value={2}>김포2지점 / 플러스김포</Option>
                                                        </Select>
                                                    </FormItem> */}
                        <Search
                          placeholder="가맹점검색"
                          className="selectItem"
                          enterButton
                          allowClear
                          onChange={(e) =>
                            this.handleChangeInput(e.target.value, "frName")
                          }
                          onSearch={this.onSearchFranchisee}
                          defaultValue={data.frName}
                          style={{
                            width: 190,
                            marginLeft: 10,
                          }}
                        />
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">도착지</div>
                        <FormItem name="addrMain" className="selectItem">
                          <Input
                            placeholder="도착지를 선택해 주세요."
                            className="override-input"
                            defaultValue={data.destAddr1}
                            onChange={(e) =>
                              this.handleChangeInput(
                                e.target.value,
                                "destAddr1"
                              )
                            }
                          ></Input>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">상세주소</div>
                        <FormItem name="addrSub" className="selectItem">
                          <Input
                            placeholder="상세주소를 입력해 주세요."
                            className="override-input"
                            defaultValue={data.destAddr2}
                            onChange={(e) =>
                              this.handleChangeInput(
                                e.target.value,
                                "destAddr2"
                              )
                            }
                          ></Input>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">배달요금</div>
                        <FormItem name="callAmount" className="selectItem">
                          <Input
                            placeholder="배달요금 입력"
                            className="override-input"
                            defaultValue={data.deliveryPrice}
                            onChange={(e) =>
                              this.handleChangeInput(
                                e.target.value,
                                "deliveryPrice"
                              )
                            }
                          ></Input>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">가격</div>
                        <FormItem name="callprice" className="selectItem">
                          <Input
                            placeholder="가격 입력"
                            className="override-input"
                            defaultValue={data.orderPrice}
                            onChange={(e) =>
                              this.handleChangeInput(
                                e.target.value,
                                "orderPrice"
                              )
                            }
                          ></Input>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">결제방식</div>
                        <PaymentDialog
                          isOpen={this.state.paymentOpen}
                          close={this.closePaymentModal}
                          handlePaymentChange={this.handlePaymentChange}
                          orderPayments={
                            this.props.data ? this.props.data.orderPayments : []
                          }
                          editable={this.state.editable}
                          orderPrice={this.props.data ? this.props.data.orderPrice : 0}
                        />
                        <Button
                          onClick={this.openPaymentModal}
                          className="selectItem"
                        >
                          결제방식 선택
                        </Button>
                        {/* <FormItem name="orderPayments" className="selectItem">
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
                        </FormItem> */}
                      </div>
                      {/* <FormItem
                        style={{
                          marginBottom: 0,
                          display: "inline-block",
                          verticalAlign: "middle",
                        }}
                        name="payType"
                        initialValue={0}
                      >
                        <Radio.Group>
                          <Radio style={{ fontSize: 18 }} value={0}>
                            현금
                          </Radio>
                          <Radio style={{ fontSize: 18 }} value={1}>
                            카드
                          </Radio>
                          <Radio style={{ fontSize: 18 }} value={2}>
                            선결
                          </Radio>
                        </Radio.Group>
                      </FormItem> */}
                      {/* <div className="contentBlock">
                        <div className="mainTitle">주문상태</div>
                        <Select
                          className="override-input"
                          defaultValue={data.orderStatus}
                          onChange={(value) => {
                            var flag = true;

                            if (!modifyType[data.orderStatus].includes(value)) {
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
                              this.handleChangeInput(value, "orderStatus");
                            }
                          }}
                        >
                          {deliveryStatusCode.map((value, index) => {
                            if (index === 0) return <></>;
                            else return <Option value={index}>{value}</Option>;
                          })}
                        </Select>
                      </div> */}

                      <div className="contentBlock">
                        <div className="mainTitle">준비시간</div>
                        <FormItem name="preparationTime" className="selectItem">
                          <Select
                            placeholder="시간단위"
                            className="override-input"
                            onChange={(value) =>
                              this.handleChangeInput(value, "itemPreparingTime")
                            }
                          >
                            <Option value={5}>5분</Option>
                            <Option value={10}>10분</Option>
                            <Option value={15}>15분</Option>
                            <Option value={20}>20분</Option>
                            <Option value={30}>30분</Option>
                            <Option value={40}>40분</Option>
                            <Option value={1005}>후5분</Option>
                            <Option value={1010}>후10분</Option>
                          </Select>
                        </FormItem>
                        {/* <FormItem
                          style={{
                            marginLeft: 10,
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                          name="payType"
                          initialValue={0}
                          className="selectItem"
                        >
                          <Checkbox style={{ fontSize: 16 }} value={0}>
                            과금
                          </Checkbox>
                          <Checkbox style={{ fontSize: 18 }} value={1}>
                            과적
                          </Checkbox>
                        </FormItem> */}
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">음식준비 완료</div>
                        <FormItem name="itemPrepared" className="selectItem">
                          <Checkbox
                            defaultChecked={data.itemPrepared}
                            onChange={(e) =>
                              this.handleChangeInput(
                                e.target.checked,
                                "itemPrepared"
                              )
                            }
                          />
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">요청시간</div>
                        <FormItem name="arriveReqDate" className="selectItem">
                          <DatePicker
                            className="override-input"
                            showTime
                            onOk={(value) => {
                              const newDate = value.toDate();
                              const data = this.state.data;
                              data["arriveReqDate"] = formatDateSecond(newDate);
                              this.setState({ data: data }, () =>
                                console.log(this.state.data)
                              );
                            }}
                          />
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
                              this.setState({
                                data: {
                                  ...this.state.data,
                                  custPhone: e.target.value,
                                },
                              })
                            }
                          ></Input>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">메모</div>
                        <FormItem name="callmemo" className="selectItem">
                          <Input
                            placeholder="메모를 입력해 주세요."
                            className="override-input"
                            defaultValue={data.custMessage}
                            onChange={(e) =>
                              this.handleChangeInput(
                                e.target.value,
                                "custMessage"
                              )
                            }
                          ></Input>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="callTab"
                        >
                          등록하기
                        </Button>
                      </div>
                    </div>

                    <div className="mapLayout regist-call-map" id="myMap">
                      {/* <MapContainer /> */}
                      {/* 
                                                {navermaps &&
                                                    <NaverMap
                                                        className='map-navermap'
                                                        defaultZoom={14}
                                                        center={{ lat: lat, lng: lng }}
                                                    >
                                                    <Marker
                                                        position={navermaps.LatLng(lat, lng)}
                                                        icon={require('../../../img/login/map/marker_rider.png').default}
                                                    />
                                                    <Marker
                                                        position={navermaps.LatLng(lat, lng)}
                                                        icon={require('../../../img/login/map/marker_target.png').default}
                                                    />
                                                    <Polyline 
                                                    path={[
                                                        navermaps.LatLng(lat, lng),
                                                        navermaps.LatLng(lat, lng),
                                                    ]}
                                                    // clickable // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
                                                    strokeColor={'#5347AA'}
                                                    strokeWeight={5}        
                                                    />
                                                    </NaverMap>
                                                } */}
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

export default RegistCallDialog;
