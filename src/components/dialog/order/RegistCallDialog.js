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
  arriveReqTime,
} from "../../../lib/util/codeUtil";
import { formatDate, formatDateSecond } from "../../../lib/util/dateUtil";
import PaymentDialog from "./PaymentDialog";
import { httpUrl, httpPost, httpGet } from "../../../api/httpClient";
import { updateComplete, updateError } from "../../../api/Modals";
import SearchFranchiseDialog from "../common/SearchFranchiseDialog";
import PostCodeDialog from "../common/PostCodeDialog";

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
  // idx 확인 해보기
  // 이게 orederIdx 면 create에서는 없이 보내는게 맞지 않나
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
      // 모달창 관련
      paymentOpen: false,
      searchFranchiseOpen: false,

      // 조회 / 수정창 구분
      editable: true,
      selectedFr: null,
      selectedDest: null,
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
  // 가맹점조회 dialog
  openSearchFranchiseModal = () => {
    this.setState({ searchFranchiseOpen: true });
  };
  closeSearchFranchiseModal = () => {
    this.setState({ searchFranchiseOpen: false });
  };
  // 주소검색 dialog
  openPostCode = () => {
    this.setState({ isPostCodeOpen: true });
  };
  closePostCode = () => {
    this.setState({ isPostCodeOpen: false });
  };

  handlePaymentChange = (result) => {
    this.setState({
      data: {
        ...this.state.data,
        orderPayments: result,
      },
    });
  };

  getDeliveryPrice = () => {
    // 예시
    const destLatitude = 37;
    const destLongitude = 126;
    httpGet(httpUrl.getDeliveryPrice, [destLatitude, destLongitude], {})
      .then((res) => {
        if (res.result === "SUCCESS") {
          this.setState({
            data: {
              ...this.state.data,
              deliveryPrice: res.data,
            },
          });
        } else {
          updateError();
        }
      })
      .catch((e) => {
        updateError();
      });
  };

  handleSubmit = () => {
    if (this.props.data) {
      console.log(this.state.data);
      httpPost(httpUrl.orderUpdate, [], this.state.data)
        .then((res) => {
          if (res.result === "SUCCESS") {
            updateComplete();
          } else {
            updateError();
          }
        })
        .catch((e) => {
          updateError();
        });
    } else {
      console.log(this.state.data);
      httpPost(httpUrl.orderCreate, [], this.state.data)
        .then((res) => {
          if (res.result === "SUCCESS") {
            updateComplete();
          } else {
            updateError();
          }
        })
        .catch((e) => {
          updateError();
        });
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
                      <div className="contentBlock">
                        <div className="mainTitle">가맹점명</div>
                        <FormItem name="addrMain" className="selectItem">
                          <SearchFranchiseDialog
                            onSelect={(fr) => {
                              this.setState({ selectedFr: fr }, () => {
                                console.log(this.state.selectedFr);
                                const fr = this.state.selectedFr;
                                this.setState({
                                  data: {
                                    ...this.state.data,
                                    // idx
                                    frIdx: fr.idx,
                                    frLatitude: fr.latitude,
                                    frLongitude: fr.longitude,
                                    frName: fr.frName,
                                    frPhone: fr.frPhone,
                                    // 이건 뭐지
                                    packAmount:0,
                                  },
                                });
                              });
                            }}
                            isOpen={this.state.searchFranchiseOpen}
                            close={this.closeSearchFranchiseModal}
                          />

                          <div className="orderPayment-wrapper">
                            <Input
                              value={
                                this.state.selectedFr
                                  ? this.state.selectedFr.frName
                                  : ""
                              }
                              style={{ marginLeft: "20px" }}
                            />
                            <Button onClick={this.openSearchFranchiseModal}>
                              가맹점조회
                            </Button>
                          </div>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">도착지</div>
                        <FormItem name="addrMain" className="selectItem">
                          <PostCodeDialog
                            onSelect={(value) =>
                              this.setState({ selectedDest: value }, () => {
                                console.log(this.state.selectedDest);
                                this.getDeliveryPrice();
                              })
                            }
                            isOpen={this.state.isPostCodeOpen}
                            close={this.closePostCode}
                          />
                          <div className="orderPayment-wrapper">
                            <Input
                              value={
                                this.state.selectedDest
                                  ? this.state.selectedDest.address
                                  : ""
                              }
                              style={{ marginLeft: "20px" }}
                            />
                            <Button onClick={this.openPostCode}>
                              우편번호 검색
                            </Button>
                          </div>
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
                            value={
                              this.state.data
                                ? this.state.data.deliveryPrice
                                : ""
                            }
                            onChange={(e) =>
                              this.handleChangeInput(
                                parseInt(e.target.value),
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
                                parseInt(e.target.value),
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
                          orderPrice={
                            this.state.data
                              ? this.state.data.orderPrice
                              : this.props.data.orderPrice
                          }
                        />
                        <Button
                          onClick={this.openPaymentModal}
                          className="override-input"
                        >
                          결제방식 선택
                        </Button>
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
                        <FormItem name="arriveReqTime" className="selectItem">
                          <Select
                            placeholder="시간단위"
                            className="override-input"
                            onChange={(value) =>
                              this.handleChangeInput(parseInt(value), "arriveReqTime")
                            }
                          >
                            {Object.keys(arriveReqTime).map((key) => (
                              <Option value={key}>{arriveReqTime[key]}</Option>
                            ))}
                          </Select>
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
