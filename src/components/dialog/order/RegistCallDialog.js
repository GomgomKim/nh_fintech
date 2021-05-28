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
  packAmount,
} from "../../../lib/util/codeUtil";
import { formatDate, formatDateSecond } from "../../../lib/util/dateUtil";
import PaymentDialog from "./PaymentDialog";
import { httpUrl, httpPost, httpGet } from "../../../api/httpClient";
import { updateComplete, updateError } from "../../../api/Modals";
import SearchFranchiseDialog from "../common/SearchFranchiseDialog";
import PostCodeDialog from "../common/PostCodeDialog";

const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;
const newOrder = {
  arriveReqTime: 5,
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
  frIdx: 0,
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
  packAmount: 1,
};

class RegistCallDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 모달창 관련
      paymentOpen: false,
      searchFranchiseOpen: false,

      // 가맹점, 도착지 정보
      selectedFr: null,
      selectedDest: null,

      // 조회 / 수정창 구분
      editable: true,
      navermaps: true,

      mapLat: null,
      mapLng: null,

      taskWorkOpen:false,
    };
    this.formRef = React.createRef();
  }

  setDefaultState = () => {
    this.setState({
      data: this.props.data ? this.props.data : newOrder,
      selectedDest: {
        address: this.props.data ? this.props.data.destAddr1 : "",
      },
      selectedFr: {
        frIdx: this.props.data ? this.props.data.frIdx : 0,
        frLatitude: this.props.data ? this.props.data.frLatitude : 0,
        frLongitude: this.props.data ? this.props.data.frLongitude : 0,
        frName: this.props.data ? this.props.data.frName : "",
        frPhone: this.props.data ? this.props.data.frPhone : "",
      },
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) {
      this.setDefaultState();
    }
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
    this.setState({ taskWorkOpen: true });
  };
  closeSearchFranchiseModal = () => {
    this.setState({ taskWorkOpen: false });
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

  getGeocode = (roadAddress) => {
    httpGet(httpUrl.getGeocode, [roadAddress], {})
      .then((res) => {
        let result = JSON.parse(res.data.json);
        if (res.result === "SUCCESS" && result.addresses.length > 0) {
          return {
            lat: result.address[0].y,
            lng: result.address[0].x,
          };
        }
      })
      .catch((e) => {
        console.log(e);
        Modal.info({
          title: "좌표 변화 실패",
          content: "좌표변환에 실패했습니다.",
        });
      });
  };

  getDeliveryPrice = () => {
    // 예시
    var self = this;
    console.log(this.state.selectedDest.roadAddress);

    httpGet(httpUrl.getGeocode, [this.state.selectedDest.roadAddress], {})
      .then((res) => {
        let result = JSON.parse(res.data.json);
        if (res.result === "SUCCESS" && result.addresses.length > 0) {
          const lat = result.addresses[0].y;
          const lng = result.addresses[0].x;
          console.log(lat, lng);
          this.setState({
            mapLat: lat,
            mapLng: lng,
            data: {
              ...this.state.data,
              latitude: lat,
              longitude: lng,
            },
          });
          httpGet(httpUrl.getDeliveryPrice, [lat, lng], {})
            .then((res) => {
              if (res.result === "SUCCESS") {
                console.log(res.data.deliveryPriceSum);
                self.formRef.current.setFieldsValue({
                  deliveryPrice: res.data.deliveryPriceSum,
                });
                this.setState({
                  data: {
                    ...this.state.data,
                    deliveryPrice: res.data.deliveryPriceSum,
                  },
                });
              } else {
                Modal.info({
                  title: "등록오류",
                  content: "배달요금 계산 오류1",
                });
              }
            })
            .catch((e) => {
              Modal.info({
                title: "등록오류",
                content: "배달요금 계산 오류2",
              });
            });
        }
      })
      .catch((e) => {
        Modal.info({
          title: "등록오류",
          content: "좌표 계산 오류",
        });
      });
  };

  getDeliveryPriceByLatLng = (lat, lng) => {
    const self = this;
    httpGet(httpUrl.getDeliveryPrice, [lat, lng], {})
      .then((res) => {
        if (res.result === "SUCCESS") {
          self.formRef.current.setFieldsValue({
            deliveryPrice: res.data.deliveryPriceSum,
          });
          this.setState({
            data: {
              ...this.state.data,
              deliveryPrice: res.data.deliveryPriceSum,
            },
          });
        } else {
          Modal.info({
            title: "등록오류",
            content: "배달요금 계산 오류1",
          });
        }
      })
      .catch((e) => {
        Modal.info({
          title: "등록오류",
          content: "배달요금 계산 오류2",
        });
      });
  };

  clearData = () => {
    this.setState({ data: newOrder });
  };

  handleSubmit = () => {
    if (this.props.data) {
      httpPost(httpUrl.orderUpdate, [], this.state.data)
        .then((res) => {
          if (res.result === "SUCCESS") {
            updateComplete();
            this.props.close();
          } else {
            updateError();
          }
        })
        .catch((e) => {
          updateError();
        });
    } else {
      httpPost(httpUrl.orderCreate, [], this.state.data)
        .then((res) => {
          if (res.result === "SUCCESS") {
            updateComplete();
            this.props.close();
            this.clearData();
          } else {
            updateError();
          }
        })
        .catch((e) => {
          updateError();
        });
    }
    this.props.getList();
  };

  render() {
    const lat = 37.643623625321474;
    const lng = 126.66509442649551;

    const { close } = this.props;
    const data = this.props.data ? this.props.data : newOrder;
    const navermaps = window.naver.maps;
    let deliveryPrice = this.state.data
      ? this.state.data.deliveryPrice
      : this.props.data
      ? this.props.data.deliveryPrice
      : "";

    const reverseGeocode = navermaps.Service.reverseGeocode;

    return (

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

                <Form ref={this.formRef} onFinish={this.handleSubmit}>
                  <div className="registCallLayout">
                    <div className="registCallWrapper">
                      <div className="contentBlock">
                        <div className="mainTitle">가맹점명</div>
                        <FormItem name="addrMain" className="selectItem">
                        {this.state.taskWorkOpen &&
                          <SearchFranchiseDialog
                            onSelect={(fr) => {
                              this.setState({ selectedFr: fr }, () => {
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
                                  },
                                });
                              });
                            }}
                            close={this.closeSearchFranchiseModal}
                          />}

                          <div className="orderPayment-wrapper">
                            <Input
                              value={
                                this.state.selectedFr
                                  ? this.state.selectedFr.frName
                                  : this.props.data
                                  ? this.props.data.frName
                                  : ""
                              }
                              style={{ marginLeft: "20px" }}
                              required
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
                            onSelect={(value) => {
                              console.log(value);
                              this.setState({ selectedDest: value }, () => {
                                this.setState({
                                  data: {
                                    ...this.state.data,
                                    destAddr1: this.state.selectedDest.address,
                                  },
                                });
                                this.getDeliveryPrice();
                              });
                            }}
                            isOpen={this.state.isPostCodeOpen}
                            close={this.closePostCode}
                          />
                          <div className="orderPayment-wrapper">
                            <Input
                              initialValue={
                                this.state.selectedDest
                                  ? this.state.selectedDest.address
                                  : this.props.data
                                  ? this.props.data.destAddr1
                                  : ""
                              }
                              value={
                                this.state.selectedDest
                                  ? this.state.selectedDest.address
                                  : this.props.data
                                  ? this.props.data.destAddr1
                                  : ""
                              }
                              style={{ marginLeft: "20px" }}
                              required
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
                        <FormItem name="deliveryPrice" className="selectItem">
                          <Input
                            placeholder="배달요금 입력"
                            className="override-input"
                            defaultValue={deliveryPrice}
                            required
                            disabled
                          ></Input>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">가격</div>
                        <FormItem name="orderPrice" className="selectItem">
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
                            required
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
                              : this.props.data
                              ? this.props.data.orderPrice
                              : ""
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
                        <div className="mainTitle">음식준비완료</div>
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
                            defaultValue={
                              this.state.data
                                ? arriveReqTime[this.state.data.arriveReqTime]
                                : this.props.data
                                ? arriveReqTime[this.props.data.arriveReqTime]
                                : arriveReqTime[5]
                            }
                            placeholder="시간단위"
                            className="override-input"
                            onChange={(value) =>
                              this.handleChangeInput(
                                parseInt(value),
                                "arriveReqTime"
                              )
                            }
                            required
                          >
                            {Object.keys(arriveReqTime).map((key) => (
                              <Option value={key}>{arriveReqTime[key]}</Option>
                            ))}
                          </Select>
                        </FormItem>
                      </div>
                      <div className="contentBlock">
                        <div className="mainTitle">배달갯수</div>
                        <FormItem name="packAmount" className="selectItem">
                          <Select
                            defaultValue={
                              this.state.data
                                ? packAmount[this.state.data.packAmount]
                                : this.props.data
                                ? packAmount[this.props.data.packAmount]
                                : packAmount[1]
                            }
                            placeholder="배달갯수"
                            className="override-input"
                            onChange={(value) =>
                              this.handleChangeInput(
                                parseInt(value),
                                "packAmount"
                              )
                            }
                            required
                          >
                            {Object.keys(packAmount).map((key) => (
                              <Option value={key}>{packAmount[key]}</Option>
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
                            required
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
                            required
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
                      {navermaps && (
                        <NaverMap
                          className="mapLayout"
                          defaultZoom={14}
                          center={
                            this.state.mapLat && this.state.mapLng
                              ? navermaps.LatLng(
                                  this.state.mapLat,
                                  this.state.mapLng
                                )
                              : this.props.data
                              ? navermaps.LatLng(
                                  this.props.data.latitude,
                                  this.props.data.longitude
                                )
                              : navermaps.LatLng(lat, lng)
                          }
                          onClick={(e) => {
                            this.setState({
                              mapLat: e.latlng.y,
                              mapLng: e.latlng.x,
                            });
                            window.naver.maps.Service.reverseGeocode(
                              {
                                location: window.naver.maps.LatLng(
                                  e.latlng.y,
                                  e.latlng.x
                                ),
                              },
                              (status, response) => {
                                if (status !== navermaps.Service.Status.OK) {
                                  return alert("실패");
                                } else {
                                  this.setState(
                                    {
                                      data: {
                                        ...this.state.data,
                                        latitude: e.latlng.y,
                                        longitude: e.latlng.x,
                                        destAddr1:
                                          response.result.items[0].address,
                                      },
                                      selectedDest: {
                                        address:
                                          response.result.items[0].address,
                                      },
                                    },
                                    () =>
                                      this.getDeliveryPriceByLatLng(
                                        e.latlng.y,
                                        e.latlng.x
                                      )
                                  );
                                  console.log(response.result.items[0].address);
                                }
                              }
                            );
                          }}
                        >
                          <Marker
                            position={
                              this.state.mapLat && this.state.mapLng
                                ? navermaps.LatLng(
                                    this.state.mapLat,
                                    this.state.mapLng
                                  )
                                : this.props.data
                                ? navermaps.LatLng(
                                    this.props.data.latitude,
                                    this.props.data.longitude
                                  )
                                : navermaps.LatLng(lat, lng)
                            }
                            icon={
                              require("../../../img/login/map/marker_target.png")
                                .default
                            }
                          />
                        </NaverMap>
                      )}
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </React.Fragment>

    );
  }
}

export default RegistCallDialog;

