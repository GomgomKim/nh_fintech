/*global kakao*/
import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import React, { Component } from "react";
import { Marker, NaverMap, Polyline } from "react-naver-maps";
import { httpGet, httpPost, httpUrl } from "../../../api/httpClient";
import {
  registComplete,
  registError,
  updateComplete,
  updateError
} from "../../../api/Modals";
import "../../../css/modal.css";
import {
  arriveReqTime,
  deliveryStatusCode,
  modifyType,
  packAmount,
  paymentMethod
} from "../../../lib/util/codeUtil";
import { comma } from "../../../lib/util/numberUtil";
import PostCodeDialog from "../common/PostCodeDialog";
import SearchFranchiseDialog from "../common/SearchFranchiseDialog";
import PaymentDialog from "./PaymentDialog";

const Option = Select.Option;
const FormItem = Form.Item;
const newOrder = {
  arriveReqTime: 5,
  assignDate: "",
  cancelReason: "",
  completeDate: "",
  custMessage: "",
  custPhone: "",
  deliveryPrice: 0,
  basicDeliveryPrice: 0,
  extraDeliveryPrice: 0,
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
  idx: -1,
  itemPrepared: false,
  itemPreparingTime: 0,
  latitude: 0,
  longitude: 0,
  memo: "",
  ncashPayEnabled: true,
  orderIdx: 0,
  orderPayments: [
    {
      idx: 1,
      paymentAmount: 0,
      paymentMethod: 3,
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

      taskWorkOpen: false,
    };
    this.formRef = React.createRef();
  }

  setDefaultState = () => {
    console.log(this.props.data ? this.props.data : "등록");
    this.setState({
      data: this.props.data ? this.props.data : newOrder,
      selectedDest: this.props.data
        ? {
            address: this.props.data.destAddr1,
          }
        : null,
      selectedFr: {
        idx: this.props.data ? this.props.data.frIdx : 0,
        latitude: this.props.data ? this.props.data.frLatitude : 0,
        longitude: this.props.data ? this.props.data.frLongitude : 0,
        frName: this.props.data ? this.props.data.frName : "",
        frPhone: this.props.data ? this.props.data.frPhone : "",
      },
    });
  };

  componentDidMount() {
    this.setDefaultState();
  }

  handleChangeInput = (value, stateKey) => {
    const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
    let newData = cloneObj(this.state.data);
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
        Modal.info({
          title: "좌표 변화 실패",
          content: "좌표변환에 실패했습니다.",
        });
      });
  };
  addressSearchKakao = (address) => {
    const geocoder = new kakao.maps.services.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = [result[0].y, result[0].x];
          resolve(coords);
        } else {
          reject(status);
        }
      });
    });
  };

  getDeliveryPrice = () => {
    console.log("getDeliiveryPrice!!!!!!!!!!!!!!!!!");
    var self = this;
    httpGet(httpUrl.getGeocode, [this.state.selectedDest.roadAddress], {})
      .then((res) => {
        console.log(res);
        let result = JSON.parse(res.data.json);
        if (res.result === "SUCCESS" && result.meta.totalCount !== 0) {
          console.log("geocode api");
          const lat = result.addresses[0].y;
          const lng = result.addresses[0].x;

          this.setState({
            mapLat: lat,
            mapLng: lng,
            data: {
              ...this.state.data,
              latitude: lat,
              longitude: lng,
            },
          });
          console.log(this.state.selectedFr.idx, lat, lng);
          httpGet(
            httpUrl.getDeliveryPrice,
            [this.state.selectedFr.idx, lat, lng],
            {}
          )
            .then((res) => {
              if (res.result === "SUCCESS") {
                console.log("getdeliveryprice res");
                console.log(res);

                if (this.props.data) {
                  self.formRef.current.setFieldsValue({
                    deliveryPrice: comma(
                      res.data.deliveryPriceBasic +
                        this.formRef.current.getFieldValue("extraDeliveryPrice")
                    ),
                    basicDeliveryPrice: comma(res.data.deliveryPriceBasic),
                  });
                  this.setState({
                    data: {
                      ...this.state.data,
                      deliveryPrice:
                        res.data.deliveryPriceBasic +
                        this.formRef.current.getFieldValue(
                          "extraDeliveryPrice"
                        ),
                      basicDeliveryPrice: res.data.deliveryPriceBasic,
                    },
                  });
                } else {
                  self.formRef.current.setFieldsValue({
                    deliveryPrice: comma(
                      res.data.deliveryPriceBasic + res.data.deliveryPriceExtra
                    ),
                    basicDeliveryPrice: comma(res.data.deliveryPriceBasic),
                    extraDeliveryPrice: res.data.deliveryPriceExtra,
                  });
                  this.setState({
                    data: {
                      ...this.state.data,
                      deliveryPrice:
                        res.data.deliveryPriceBasic +
                        res.data.deliveryPriceExtra,
                      basicDeliveryPrice: res.data.deliveryPriceBasic,
                      extraDeliveryPrice: res.data.deliveryPriceExtra,
                    },
                  });
                }
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
        } else {
          console.log("kakao api");
          this.addressSearchKakao(this.state.selectedDest.roadAddress)
            .then((res) => {
              console.log(res);
              const [lat, lng] = res;
              this.setState({
                mapLat: lat,
                mapLng: lng,
                data: {
                  ...this.state.data,
                  latitude: lat,
                  longitude: lng,
                },
              });
              console.log(this.state.selectedFr.idx, lat, lng);
              httpGet(
                httpUrl.getDeliveryPrice,
                [this.state.selectedFr.idx, lat, lng],
                {}
              )
                .then((res) => {
                  if (res.result === "SUCCESS") {
                    console.log("getdeliveryprice res");
                    console.log(res);

                    if (this.props.data) {
                      self.formRef.current.setFieldsValue({
                        deliveryPrice: comma(
                          res.data.deliveryPriceBasic +
                            this.formRef.current.getFieldValue(
                              "extraDeliveryPrice"
                            )
                        ),
                        basicDeliveryPrice: comma(res.data.deliveryPriceBasic),
                      });
                      this.setState({
                        data: {
                          ...this.state.data,
                          deliveryPrice:
                            res.data.deliveryPriceBasic +
                            this.formRef.current.getFieldValue(
                              "extraDeliveryPrice"
                            ),
                          basicDeliveryPrice: res.data.deliveryPriceBasic,
                        },
                      });
                    } else {
                      self.formRef.current.setFieldsValue({
                        deliveryPrice: comma(
                          res.data.deliveryPriceBasic +
                            res.data.deliveryPriceExtra
                        ),
                        basicDeliveryPrice: comma(res.data.deliveryPriceBasic),
                        extraDeliveryPrice: res.data.deliveryPriceExtra,
                      });
                      this.setState({
                        data: {
                          ...this.state.data,
                          deliveryPrice:
                            res.data.deliveryPriceBasic +
                            res.data.deliveryPriceExtra,
                          basicDeliveryPrice: res.data.deliveryPriceBasic,
                          extraDeliveryPrice: res.data.deliveryPriceExtra,
                        },
                      });
                    }
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
            })
            .catch((e) => {
              throw e;
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
    console.log(this.state.selectedFr.idx, lat, lng);
    httpGet(httpUrl.getDeliveryPrice, [this.state.selectedFr.idx, lat, lng], {})
      .then((res) => {
        if (res.result === "SUCCESS") {
          console.log(res);

          if (this.props.data) {
            self.formRef.current.setFieldsValue({
              deliveryPrice: comma(
                res.data.deliveryPriceBasic +
                  this.formRef.current.getFieldValue("extraDeliveryPrice")
              ),
              basicDeliveryPrice: comma(res.data.deliveryPriceBasic),
            });
            this.setState({
              data: {
                ...this.state.data,
                deliveryPrice:
                  res.data.deliveryPriceBasic +
                  this.formRef.current.getFieldValue("extraDeliveryPrice"),
                basicDeliveryPrice: res.data.deliveryPriceBasic,
              },
            });
          } else {
            self.formRef.current.setFieldsValue({
              deliveryPrice: comma(
                res.data.deliveryPriceBasic + res.data.deliveryPriceExtra
              ),
              basicDeliveryPrice: comma(res.data.deliveryPriceBasic),
              extraDeliveryPrice: res.data.deliveryPriceExtra,
            });
            this.setState({
              data: {
                ...this.state.data,
                deliveryPrice:
                  res.data.deliveryPriceBasic + res.data.deliveryPriceExtra,
                basicDeliveryPrice: res.data.deliveryPriceBasic,
                extraDeliveryPrice: res.data.deliveryPriceExtra,
              },
            });
          }
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
    this.setState(
      {
        data: {
          ...this.state.data,
          deliveryPrice:
            this.state.data.extraDeliveryPrice +
            this.state.data.basicDeliveryPrice,
        },
      },
      () => {
        console.log(this.state.data);
        if (this.state.data.orderPayments.length === 1) {
          let newData = { ...this.state.data };
          newData.orderPayments[0].paymentAmount = newData.orderPrice;
          this.setState({ data: newData });
        }
        if (this.props.data) {
          let paySum = 0;
          this.state.data.orderPayments.forEach(
            (payment) => (paySum += payment.paymentAmount)
          );
          if (paySum !== this.state.data.orderPrice) {
            Modal.info({
              title: "등록 오류",
              content:
                "주문가격과 결제내역이 다릅니다. 결제내역을 확인해주세요.",
            });
            return;
          }
          console.log("====================update===============");
          console.log(this.state.data);
          httpPost(httpUrl.orderUpdate, [], this.state.data)
            .then((res) => {
              console.log(res);

              if (res.result === "SUCCESS") {
                if (res.data === "SUCCESS") {
                  updateComplete();
                  this.props.close();
                } else if (res.data === "NOT_ENOUGH_NCASH") {
                  Modal.info({
                    title: "등록 오류",
                    content: "가맹점 예치금이 부족합니다.",
                  });
                } else if (res.data === "BRANCH_CLOSED") {
                  Modal.info({
                    title: "등록 오류",
                    content: "가맹점 영업시간이 아닙니다.",
                  });
                }
              } else {
                updateError();
              }
            })
            .catch((e) => {
              updateError();
            });
        } else {
          let paySum = 0;
          this.state.data.orderPayments.forEach(
            (payment) => (paySum += payment.paymentAmount)
          );
          if (paySum !== this.state.data.orderPrice) {
            Modal.info({
              title: "등록 오류",
              content:
                "주문가격과 결제내역이 다릅니다. 결제내역을 확인해주세요.",
            });
            return;
          }
          httpPost(httpUrl.orderCreate, [], this.state.data)
            .then((res) => {
              console.log(res);
              if (res.result === "SUCCESS") {
                if (res.data === "SUCCESS") {
                  registComplete();

                  this.props.close();
                  this.clearData();
                } else if (res.data === "NOT_ENOUGH_NCASH") {
                  Modal.info({
                    title: "등록 오류",
                    content: "가맹점 예치금이 부족합니다.",
                  });
                } else if (res.data === "BRANCH_CLOSED") {
                  Modal.info({
                    title: "등록 오류",
                    content: "가맹점 영업시간이 아닙니다.",
                  });
                }
              } else {
                registError();
              }
            })
            .catch((e) => {
              registError();
            });
        }
      }
    );
  };

  render() {
    const lat = 37.643623625321474;
    const lng = 126.66509442649551;

    const { close } = this.props;
    const data = this.props.data ? this.props.data : newOrder;
    const navermaps = window.naver.maps;
    let basicDeliveryPrice = this.state.data
      ? this.state.data.basicDeliveryPrice
      : this.props.data
      ? this.props.data.basicDeliveryPrice
      : "";

    console.log("this.state.selectedFr");
    console.log(this.state.selectedFr);

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
                  <div>
                    <div className="contentBlock">
                      <div className="mainTitle">가맹점명</div>
                      <FormItem name="addrMain" className="selectItem">
                        {this.state.taskWorkOpen && (
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
                                console.log(this.state.selectedDest);
                                if (this.state.selectedDest) {
                                  if (
                                    Object.keys(
                                      this.state.selectedDest
                                    ).includes("postcode")
                                  ) {
                                    this.getDeliveryPrice();
                                  } else {
                                    this.getDeliveryPriceByLatLng();
                                  }
                                } else return;
                              });
                            }}
                            close={this.closeSearchFranchiseModal}
                          />
                        )}

                        <div className="orderPayment-wrapper desk">
                          <Input
                            value={
                              this.state.selectedFr
                                ? this.state.selectedFr.frName
                                : this.props.data
                                ? this.props.data.frName
                                : ""
                            }
                            style={{ marginLeft: 20, width: 250 }}
                            required
                          />
                          <Button
                            style={{ width: 150 }}
                            onClick={this.openSearchFranchiseModal}
                          >
                            가맹점조회
                          </Button>
                        </div>
                        <div className="orderPayment-wrapper mobile">
                          <Input
                            value={
                              this.state.selectedFr
                                ? this.state.selectedFr.frName
                                : this.props.data
                                ? this.props.data.frName
                                : ""
                            }
                            style={{ marginLeft: 10, width: 180 }}
                            required
                          />
                          <Button
                            style={{ width: 80 }}
                            onClick={this.openSearchFranchiseModal}
                          >
                            조회
                          </Button>
                        </div>
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">도착지</div>
                      <FormItem name="addrMain" className="selectItem">
                        <PostCodeDialog
                          onSelect={(value) => {
                            this.setState({ selectedDest: value }, () => {
                              this.setState({
                                data: {
                                  ...this.state.data,
                                  destAddr1: this.state.selectedDest.address,
                                },
                              });
                              console.log(this.state.selectedFr);
                              if (this.state.selectedFr.idx !== 0) {
                                console.log("기본 state 가맹점");
                                console.log(this.state.selectedFr);
                                this.getDeliveryPrice();
                              }
                            });
                          }}
                          isOpen={this.state.isPostCodeOpen}
                          close={this.closePostCode}
                        />
                        <div className="orderPayment-wrapper desk">
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
                            style={{ marginLeft: 20, width: 250 }}
                            required
                          />
                          <Button
                            style={{ width: 150 }}
                            onClick={this.openPostCode}
                          >
                            우편번호 검색
                          </Button>
                        </div>
                        <div className="orderPayment-wrapper mobile">
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
                            style={{ marginLeft: 10, width: 180 }}
                            required
                          />
                          <Button
                            style={{ width: 80 }}
                            onClick={this.openPostCode}
                          >
                            검색
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
                            this.handleChangeInput(e.target.value, "destAddr2")
                          }
                        ></Input>
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">기본 배달요금</div>
                      <FormItem
                        name="basicDeliveryPrice"
                        className="selectItem"
                      >
                        <Input
                          placeholder="배달요금 입력"
                          className="override-input"
                          defaultValue={comma(basicDeliveryPrice)}
                          required
                          disabled
                        ></Input>
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">할증 배달요금</div>
                      <FormItem
                        name="extraDeliveryPrice"
                        className="selectItem"
                      >
                        <Input
                          // type="number"
                          placeholder="할증 배달요금 입력"
                          className="override-input"
                          defaultValue={
                            this.props.data
                              ? comma(this.props.data.extraDeliveryPrice)
                              : "0"
                          }
                          onChange={(e) =>
                            this.handleChangeInput(
                              parseInt(e.target.value),
                              "extraDeliveryPrice"
                            )
                          }
                        ></Input>
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">가격</div>
                      <FormItem name="orderPrice" className="selectItem">
                        <Input
                          // type="number"
                          placeholder="가격 입력"
                          className="override-input"
                          defaultValue={comma(data.orderPrice)}
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
                      <Select
                        className="override-input"
                        // style={{
                        //   width: 100,
                        //   fontSize: 16,
                        //   marginRight: 5,
                        //   marginLeft: 20,
                        // }}
                        defaultValue={
                          this.state.data
                            ? this.state.data.orderPayments[0].paymentMethod
                            : this.props.data
                            ? this.props.data.orderPayments[0].paymentMethod
                            : 1
                        }
                        value={
                          this.state.data
                            ? this.state.data.orderPayments[0].paymentMethod
                            : this.props.data
                            ? this.props.data.orderPayments[0].paymentMethod
                            : 1
                        }
                        disabled={
                          this.state.data
                            ? this.state.data.orderPayments.length > 1
                            : this.props.data
                            ? this.props.data.length > 1
                            : false
                        }
                        onChange={(value) => {
                          let orderData = { ...this.state.data };
                          orderData.orderPayments[0].paymentMethod = value;
                          this.setState({ data: orderData });
                        }}
                      >
                        {paymentMethod.map((value, index) => {
                          if (index === 0) {
                            return <></>;
                          }
                          return <Option value={index}>{value}</Option>;
                        })}
                      </Select>
                      {/* <Input
                        style={{ width: 295 }}
                        type="number"
                        defaultValue={
                          this.state.data
                            ? this.state.data.orderPayments.length > 1
                              ? null
                              : this.state.data.orderPayments[0].paymentAmount
                            : this.props.data
                            ? this.props.data.orderPayments.length > 1
                              ? null
                              : this.props.data.orderPayments[0].paymentAmount
                            : ""
                        }
                        value={
                          this.state.data
                            ? this.state.data.orderPayments[0].paymentAmount
                            : ""
                        }
                        disabled={
                          this.state.data
                            ? this.state.data.orderPayments.length > 1
                            : this.props.data
                            ? this.props.data.length > 1
                            : false
                        }
                        onChange={(e) => {
                          let orderData = { ...this.state.data };
                          orderData.orderPayments[0].paymentAmount = parseInt(
                            e.target.value
                          );
                          this.setState({ data: orderData }, () =>
                            console.log(this.state.data.orderPayments)
                          );
                        }}
                      /> */}
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle"></div>

                      {this.state.paymentOpen && (
                        <PaymentDialog
                          close={this.closePaymentModal}
                          handlePaymentChange={this.handlePaymentChange}
                          orderPayments={
                            this.state.data
                              ? this.state.data.orderPayments
                              : this.props.data
                              ? this.props.data.orderPayments
                              : ""
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
                      )}

                      <Button
                        onClick={this.openPaymentModal}
                        style={{ marginLeft: 20, width: 290 }}
                        // className="override-input"
                      >
                        분할결제 지정
                      </Button>
                      <Button
                        type="danger"
                        onClick={() => {
                          this.setState({
                            data: {
                              ...this.state.data,
                              orderPayments: [
                                {
                                  idx: 1,
                                  paymentMethod: 1,
                                  paymentStatus: 1,
                                  paymentAmount: "",
                                },
                              ],
                            },
                          });
                        }}
                        // className="override-input"
                      >
                        분할결제 취소
                      </Button>
                    </div>
                    {this.state.data &&
                      this.state.data.orderPayments.length > 1 && (
                        <div className="contentBlock">
                          <div className="mainTitle" />
                          <div
                            className="selectItem"
                            style={{ marginLeft: 20 }}
                          >
                            {this.state.data.orderPayments.map((el) => {
                              return (
                                <div
                                  style={{
                                    display: "inline-block",
                                    backgroundColor: "black",
                                    color: "#fddc00",
                                    padding: "5px 8px",
                                    borderRadius: 5,
                                    marginRight: 10,
                                  }}
                                >
                                  {paymentMethod[el.paymentMethod]} :{" "}
                                  {comma(el.paymentAmount)} 원
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>

                  <div>
                    {this.props.data && (
                      <div className="contentBlock">
                        <div className="mainTitle">주문상태</div>
                        <Select
                          className="override-input"
                          defaultValue={
                            this.state.data && this.state.data.orderStatus
                          }
                          value={this.state.data && this.state.data.orderStatus}
                          onChange={(value) => {
                            if (!modifyType[data.orderStatus].includes(value)) {
                              Modal.info({
                                content: <div>상태를 바꿀 수 없습니다.</div>,
                              });
                              return;
                            }
                            // 대기중 -> 픽업중 변경 시 강제배차 알림
                            if (data.orderStatus === 1 && value === 2) {
                              Modal.info({
                                content: <div>강제배차를 사용하세요.</div>,
                              });
                              return;
                            }
                            // 픽업 -> 접수 변경 시 배차상태로 변경 알림
                            if (data.orderStatus === 3 && value === 1) {
                              Modal.info({
                                content: (
                                  <div>
                                    배차상태로 먼저 변경한 후 접수로
                                    변경해주세요.
                                  </div>
                                ),
                              });
                              return;
                            }

                            //완료를 복원시키는 경우
                            if (data.orderStatus === 4 && value === 3) {
                              const self = this;
                              Modal.confirm({
                                title: "주문복구",
                                content:
                                  "주문을 복구하는 경우 라이더에게 지급된 가맹점 배달료도 북구됩니다. 정말 복구하시겠습니까?",
                                okText: "확인",
                                cancelText: "취소",
                                onOk() {
                                  httpPost(httpUrl.orderCompleteRestore, [], {
                                    orderIdx: data.idx,
                                  }).then((res) => {
                                    if (
                                      res.result === "SUCCESS" &&
                                      res.data === "SUCCESS"
                                    ) {
                                      // Modal.info({
                                      //   title: "변경 성공",
                                      //   content: "주문상태가 변경되었습니다.",
                                      // });
                                      this.setState({
                                        data: { ...data, orderStatus: value },
                                      });
                                    } else {
                                      Modal.info({
                                        title: "변경 실패",
                                        content:
                                          "주문상태 변경에 실패했습니다.",
                                      });
                                    }
                                  });
                                },
                              });
                              return;
                            }
                            const orderStatuseChangeApiCode = [
                              "",
                              httpUrl.orderAssignCancel,
                              httpUrl.orderPickupCancel,
                              httpUrl.orderPickup,
                              httpUrl.orderComplete,
                              httpUrl.orderCancel,
                            ];

                            httpPost(orderStatuseChangeApiCode[value], [], {
                              orderIdx: data.idx,
                            })
                              .then((res) => {
                                if (
                                  res.result === "SUCCESS" &&
                                  res.data === "SUCCESS"
                                ) {
                                  // Modal.info({
                                  //   title: "변경 성공",
                                  //   content: "주문상태가 변경되었습니다.",
                                  // });
                                  this.setState({
                                    data: { ...data, orderStatus: value },
                                  });
                                } else {
                                  Modal.info({
                                    title: "변경 실패",
                                    content: "주문상태 변경에 실패했습니다.",
                                  });
                                }
                              })
                              .catch((e) => {
                                Modal.info({
                                  title: "변경 실패",
                                  content: "주문상태 변경에 실패했습니다.",
                                });

                                throw e;
                              });
                          }}
                        >
                          {deliveryStatusCode.map((value, index) => {
                            if (index === 0) return <></>;
                            else
                              return (
                                <Option key={index} value={index}>
                                  {value}
                                </Option>
                              );
                          })}
                        </Select>
                        <p style={{ color: "red", marginTop: 5 }}>
                          * 주문상태는 클릭하는 즉시 적용되니 주의하시기
                          바랍니다.
                        </p>
                      </div>
                    )}
                    <div className="contentBlock" style={{ marginTop: 0 }}>
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
                      <div className="mainTitle">묶음배송 봉지수</div>
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
                </div>
                <div className="mapLayout regist-call-map desk" id="myMap">
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
                            console.log(status);
                            console.log(response);
                            if (status !== navermaps.Service.Status.OK) {
                              Modal.info({
                                title: "조회실패",
                                content:
                                  "유효하지 않은 지역입니다. 다시 선택해주세요.",
                              });
                            } else {
                              if (response.result.items.length > 0) {
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
                                      address: response.result.items[0].address,
                                    },
                                  },
                                  () => {
                                    if (this.state.selectedFr.idx !== 0) {
                                      this.getDeliveryPriceByLatLng(
                                        e.latlng.y,
                                        e.latlng.x
                                      );
                                    }
                                  }
                                );
                              } else {
                                Modal.info({
                                  title: "조회실패",
                                  content:
                                    "유효하지 않은 지역입니다. 다시 선택해주세요.",
                                });
                              }
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
                      {this.state.selectedFr &&
                        this.state.selectedFr.latitude !== 0 &&
                        this.state.selectedFr.longitude !== 0 && (
                          <>
                            <Marker
                              position={navermaps.LatLng(
                                this.state.selectedFr.latitude,
                                this.state.selectedFr.longitude
                              )}
                              icon={
                                require("../../../img/login/map/marker_rider.png")
                                  .default
                              }
                            />
                            <Polyline
                              path={[
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
                                  : navermaps.LatLng(lat, lng),
                                navermaps.LatLng(
                                  this.state.selectedFr.latitude,
                                  this.state.selectedFr.longitude
                                ),
                              ]}
                              strokeColor={"#0000ff"}
                              strokeWeight={5}
                            />
                          </>
                        )}
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
