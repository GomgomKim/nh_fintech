import { Button, Checkbox, DatePicker, Form, Input, Radio } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { httpGet, httpPost, httpUrl } from "../../../api/httpClient";
import {
  customError,
  registComplete,
  registError,
  updateComplete,
  updateError
} from "../../../api/Modals";
import "../../../css/modal.css";
import { pgUseRate } from "../../../lib/util/codeUtil";
import PostCodeDialog from "../common/PostCodeDialog";
import SearchRiderDialog from "../common/SearchRiderDialog";

const FormItem = Form.Item;
const dateFormat = "YYYY/MM/DD";
const today = new Date();

class RegistFranDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogData: [],
      isPostCodeOpen: false,
      roadAddr: "",
      localAddr: "",
      feeManner: 1,
      // 좌표
      targetLat: 0,
      targetLng: 0,

      agreeSms: true,

      searchRiderOpen: false,
      selectedRider: null,

      isMember: true,
      riderTotalList: [],
      chargeDate: 1,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.data) {
      console.log(this.props.data);
      this.getRiderList(this.props.data.frSalesUserIdx);
      this.setState({ chargeDate: this.props.data.chargeDate });
    }
  }
  getRiderList = (frSalesUserIdx) => {
    httpGet(httpUrl.riderTotalList, [], {}).then((res) => {
      if (res.result === "SUCCESS")
        this.setState(
          {
            riderTotalList: res.data.riders,
          },
          () => {
            this.setState({
              selectedRider: this.state.riderTotalList.find(
                (rider) => rider.idx === frSalesUserIdx
              ),
            });
          }
        );
    });
  };

  openSearchRider = () => {
    this.setState({ searchRiderOpen: true });
  };

  closeSearchRider = () => {
    this.setState({ searchRiderOpen: false });
  };

  handleSubmit = () => {
    if (this.props.data) {
      console.log({
        ...this.formRef.current.getFieldsValue(),
        idx: this.props.data.idx,
        branchIdx: this.props.branchIdx,
        frSalesUserIdx: this.state.selectedRider.idx,
        userGroup: 0,
        nonmemberFee: this.state.isMember ? 0 : 1000,
      });
      httpPost(httpUrl.franchiseUpdate, [], {
        ...this.formRef.current.getFieldsValue(),
        idx: this.props.data.idx,
        branchIdx: this.props.branchIdx,
        frSalesUserIdx: this.state.selectedRider.idx,
        userGroup: 0,
        nonmemberFee: this.state.isMember ? 0 : 1000,
        chargeDate: this.state.chargeDate,
      })
        .then((result) => {
          console.log("## result: " + JSON.stringify(result, null, 4));
          if (result.result === "SUCCESS") {
            this.props.getList();
            updateComplete();
          } else {
            updateError();
          }
          this.props.close();
        })
        .catch((e) => {
          updateError();
        });
    } else {
      console.log({
        ...this.formRef.current.getFieldsValue(),
        branchIdx: this.props.branchIdx,
        ncash: 0,
        userStatus: 1,
        recommenderIdx: 0,
        userType: 2,
        withdrawPassword: "0000",
        bank: "",
        bankAccount: 0,
        depositor: "",
        userGroup: 0,
        latitude: this.state.targetLat,
        longitude: this.state.targetLng,
        frStatus: 1,
        ncashPayEnabled: false,
        tidNormal: "",
        tidPrepay: "",
        // tidNormalRate: this.state.PgRate, // 100 or 0
        duesAutoChargeEnabled: false,
        dues: 0,
        agreeSms: this.state.agreeSms,
        frSalesUserIdx: this.state.selectedRider.idx,
        nonmemberFee: this.state.isMember ? 0 : 1000,
      });
      httpPost(httpUrl.registFranchise, [], {
        ...this.formRef.current.getFieldsValue(),
        branchIdx: this.props.branchIdx,
        ncash: 0,
        userStatus: 1,
        recommenderIdx: 0,
        userType: 2,
        withdrawPassword: "0000",
        bank: "",
        bankAccount: 0,
        depositor: "",
        userGroup: 0,
        latitude: this.state.targetLat,
        longitude: this.state.targetLng,
        frStatus: 1,
        ncashPayEnabled: false,
        tidNormal: "",
        tidPrepay: "",
        // tidNormalRate: this.state.PgRate, // 100 or 0
        duesAutoChargeEnabled: false,
        dues: 0,
        agreeSms: this.state.agreeSms,
        frSalesUserIdx: this.state.selectedRider.idx,
        nonmemberFee: this.state.isMember ? 0 : 1000,
        chargeDate: this.state.chargeDate,
      })
        .then((result) => {
          console.log("## result: " + JSON.stringify(result, null, 4));
          if (result.result === "SUCCESS") {
            this.props.getList();
            registComplete();
          } else {
            registError();
          }
          this.props.close();
        })
        .catch((e) => {
          registError();
        });
    }
  };

  // 우편번호 검색
  openPostCode = () => {
    this.setState({ isPostCodeOpen: true });
  };

  closePostCode = () => {
    this.setState({ isPostCodeOpen: false });
  };

  // 우편번호 - 주소 저장
  getAddr = (addrData) => {
    console.log(addrData);
    // console.log(addrData.address)
    this.formRef.current.setFieldsValue({
      addr1: addrData.roadAddress, // 도로명 주소
      addr3:
        addrData.jibunAddress === ""
          ? addrData.autoJibunAddress
          : addrData.jibunAddress, // 지번
    });

    // 좌표변환
    httpGet(httpUrl.getGeocode, [addrData.roadAddress], {}).then((res) => {
      let result = JSON.parse(res.data.json);
      console.log(result);

      // console.log(result)
      // console.log(result.addresses.length)
      if (res.result === "SUCCESS" && result.addresses.length > 0) {
        const lat = result.addresses[0].y;
        const lng = result.addresses[0].x;
        // console.log(lat)
        // console.log(lng)

        this.setState({
          targetLat: lat,
          targetLng: lng,
        });

        // 예상 배송 요금
        // httpGet(httpUrl.expectDeliveryPrice, [lat, lng], {}).then((res) => {
        //   // console.log("expectDeliveryPrice data :"+res.data)
        //   // console.log("expectDeliveryPrice data :"+res.data.distance)
        //   // console.log("expectDeliveryPrice data :"+res.data.deliveryPriceBasic)
        //   // console.log("expectDeliveryPrice data :"+res.data.deliveryPriceExtra)
        //   if (res.result === "SUCCESS" && res.data != null) {
        //     this.formRef.current.setFieldsValue({
        //       distance: res.data.distance,
        //       basicDeliveryPrice: res.data.deliveryPriceBasic,
        //       deliveryPriceExtra: res.data.deliveryPriceExtra,
        //     });
        //   } else
        //     customError(
        //       "배송 요금 오류",
        //       "예상 배송요금을 불러오는 데 실패했습니다. 관리자에게 문의하세요."
        //     );
        // });
      } else {
        customError(
          "위치 반환 오류",
          "위치 데이터가 존재하지 않습니다. 관리자에게 문의하세요."
        );
      }
    });
  };

  onChangFeeManner = (e) => {
    console.log(e.target.value);
    this.setState({ feeManner: e.target.value }, () => {});
  };

  onChangeIsMember(e) {
    this.setState({ isMember: e.target.value });
  }

  render() {
    const { close, data } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={() => close()} />
        <div className="registFran-Dialog">
          <div className="registFran-container">
            <div className="registFran-title">
              {data ? "가맹점 수정" : "가맹점 등록"}
            </div>

            <img
              onClick={() => close()}
              src={require("../../../img/login/close.png").default}
              className="surcharge-close"
              alt="exit"
            />

            <Form ref={this.formRef} onFinish={this.handleSubmit}>
              <div className="registFranLayout">
                <div className="registFranTitle">
                  <div className="registFranTitle-sub">기본정보</div>
                  <div className="registFran-radio">
                    <FormItem
                      name="isMember"
                      initialValue={data ? data.isMember : true}
                    >
                      <Radio.Group
                        // 가맹여부 컬럼 이름 조정 필요
                        initialValue={data ? data.isMember : true}
                        onChange={(e) => this.onChangeIsMember(e)}
                      >
                        <Radio.Button value={true}>가맹</Radio.Button>
                        <Radio.Button value={false}>무가맹</Radio.Button>
                      </Radio.Group>
                    </FormItem>
                  </div>
                </div>
                <div className="registFranBox">
                  <div className="registFranWrapper">
                    <div className="contentBlock">
                      <div className="mainTitle">가맹점명</div>
                      <FormItem
                        name="frName"
                        className="selectItem"
                        initialValue={data && data.frName}
                      >
                        <Input
                          placeholder="가맹점명을 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">사업자번호</div>
                      <FormItem
                        name="businessNumber"
                        className="selectItem"
                        initialValue={data && data.businessNumber}
                      >
                        <Input
                          placeholder="사업자번호를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">대표자명</div>
                      <FormItem
                        name="ownerName"
                        className="selectItem"
                        // initialValue={data && data.ownerName}
                        initialValue={data && "대표자명"}
                      >
                        <Input
                          placeholder="대표자명을 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">가맹점전화</div>
                      <FormItem
                        name="frPhone"
                        className="selectItem"
                        initialValue={data && data.frPhone}
                      >
                        <Input
                          placeholder="가맹점 전화번호를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">휴대전화</div>
                      <FormItem
                        name="phone"
                        className="selectItem"
                        // initialValue={data && data.frPhone}
                        initialValue={data && data.phone}
                      >
                        <Input
                          placeholder="휴대전화 번호를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">주소</div>
                      <FormItem
                        name="addr1"
                        className="selectItem"
                        initialValue={data && data.addr1}
                      >
                        <Input
                          placeholder="주소를 입력해 주세요."
                          disabled
                          className="override-input addrText"
                        />
                      </FormItem>
                      <PostCodeDialog
                        data={(addrData) => this.getAddr(addrData)}
                        isOpen={this.state.isPostCodeOpen}
                        close={this.closePostCode}
                      />
                      <Button
                        onClick={this.openPostCode}
                        className="override-input addrBtn"
                      >
                        우편번호 검색
                      </Button>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">지번주소</div>
                      <FormItem
                        name="addr3"
                        className="selectItem"
                        // initialValue={data && data.addr3}
                        initialValue={data && "test"}
                      >
                        <Input
                          placeholder="상세주소를 입력해 주세요."
                          disabled
                          className="override-input sub"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">상세주소</div>
                      <FormItem
                        name="addr2"
                        className="selectItem"
                        initialValue={data && data.addr2}
                      >
                        <Input
                          placeholder="상세주소를 입력해 주세요."
                          className="override-input sub"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">영업담당자</div>
                      <FormItem name="addrMain" className="selectItem">
                        {this.state.searchRiderOpen && (
                          <SearchRiderDialog
                            callback={(rider) => {
                              this.setState({ selectedRider: rider }, () => {
                                console.log(this.state.selectedRider);
                              });
                            }}
                            close={this.closeSearchRider}
                          />
                        )}

                        <div className="orderPayment-wrapper">
                          <Input
                            style={{ marginLeft: 20, width: 220 }}
                            placeholder="영업담당자를 선택해주세요."
                            value={
                              this.state.selectedRider
                                ? this.state.selectedRider.riderName
                                : ""
                            }
                            required
                          />
                          <Button
                            // style={{ width: 150 }}
                            onClick={this.openSearchRider}
                          >
                            기사조회
                          </Button>
                        </div>
                      </FormItem>
                    </div>
                  </div>

                  <div className="registFranWrapper sub">
                    <div className="contentBlock">
                      <div className="mainTitle">아이디</div>
                      <FormItem
                        name="id"
                        className="selectItem"
                        rules={[
                          {
                            required: true,
                            message: "아이디를 입력해주세요",
                          },
                        ]}
                        initialValue={data && data.id}
                      >
                        <Input
                          placeholder="아이디를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">이메일</div>
                      <FormItem
                        name="email"
                        className="selectItem"
                        rules={[
                          {
                            required: true,
                            message: "이메일을 입력해주세요",
                          },
                        ]}
                        initialValue={data && data.email}
                      >
                        <Input
                          placeholder="ex) example@naver.com"
                          className="override-input"
                        />
                      </FormItem>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">PG 사용여부</div>
                      <div className="registRiderCheck">
                        <FormItem
                          name="tidNormalRate"
                          initialValue={data ? data.tidNormalRate : 100}
                        >
                          <Radio.Group
                            className="searchRequirement"
                            initialValue={data ? data.tidNormalRate : 100}
                          >
                            {Object.keys(pgUseRate)
                              .reverse()
                              .map((key) => {
                                return (
                                  <Radio value={parseInt(key)}>
                                    {pgUseRate[key]}
                                  </Radio>
                                );
                              })}
                          </Radio.Group>
                        </FormItem>
                      </div>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">기본배달요금</div>
                      <FormItem
                        name="basicDeliveryPrice"
                        className="selectItem"
                        // initialValue={data && data.basicDeliveryPrice}
                        initialValue={data && data.basicDeliveryPrice}
                        rules={[
                          {
                            required: true,
                            message: "기본배달요금을 입력해주세요.",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder="배달요금을 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">기본거리</div>
                      <FormItem
                        name="basicDeliveryDistance"
                        className="selectItem"
                        initialValue={
                          data && parseInt(data.basicDeliveryDistance)
                        }
                        rules={[
                          {
                            required: true,
                            message: "기본거리를 입력해주세요.",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder="기본거리를 m(미터) 단위로 입력해주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">비밀번호</div>
                      <FormItem name="password" className="selectItem">
                        {data ? (
                          <Input.Password
                            placeholder="비밀번호를 입력해 주세요."
                            className="override-input sub"
                          />
                        ) : (
                          <Input.Password
                            placeholder="비밀번호를 입력해 주세요."
                            className="override-input sub"
                          />
                        )}
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">메모</div>
                      <FormItem name="memo" className="selectItem">
                        {data ? (
                          <Input
                            placeholder="메모를 입력해 주세요."
                            className="override-input sub"
                            defaultValue={data.memo}
                          />
                        ) : (
                          <Input
                            placeholder="메모를 입력해 주세요."
                            className="override-input sub"
                          />
                        )}
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">가입일자</div>
                      <FormItem name="frJoinDate" className="selectItem">
                        <DatePicker
                          style={{ marginLeft: 20, width: 300 }}
                          defaultValue={moment(today, dateFormat)}
                          format={dateFormat}
                          // onChange={date => this.setState({ selectedDate: date })}
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div style={{ fontSize: "1rem" }} className="mainTitle">
                        SMS수신동의
                      </div>
                      <FormItem name="agreeSms" className="selectItem">
                        <Checkbox
                          className="override-input"
                          defaultChecked={
                            this.props.data ? this.props.data.agreeSms : true
                          }
                          value={this.state.agreeSms}
                          onChange={(e) =>
                            this.setState({ agreeSms: e.target.checked })
                          }
                        >
                          수신동의
                        </Checkbox>
                      </FormItem>
                    </div>
                  </div>
                </div>

                <div className="registFranWrapper bot">
                  <div className="registFranTitle">월관리비 설정</div>

                  <div className="contentBlock">
                    <div className="subTitle">월회비납부일</div>
                    {this.state.isMember ? (
                      <>
                        <FormItem
                          name="chargeDate"
                          className="selectItem"
                          style={{ marginLeft: 10 }}
                        >
                          {/* <DatePicker
                            style={{ marginLeft: 10 }}
                            initialValue={
                              data
                                ? moment(data.chargeDate, dateFormat)
                                : moment(today, dateFormat)
                            }
                            format={dateFormat}
                            // onChange={date => this.setState({ selectedDate: date })}
                          /> */}
                          <div className="riderGText">매월</div>
                          <Input
                            value={this.state.chargeDate}
                            className="override-input sub"
                            onChange={(e) => {
                              this.setState({ chargeDate: e.target.value });
                            }}
                          />
                          <div className="riderGText">일</div>
                        </FormItem>
                        <div className="subTitle">관리비</div>
                        <FormItem name="dues" className="selectItem">
                          <Input
                            name="dues"
                            placeholder="관리비 입력"
                            className="override-input sub"
                          />
                        </FormItem>
                      </>
                    ) : (
                      <>
                        <FormItem name="payDate" className="selectItem">
                          <DatePicker
                            style={{ marginLeft: 10 }}
                            defaultValue={moment(today, dateFormat)}
                            format={dateFormat}
                            disabled
                            // onChange={date => this.setState({ selectedDate: date })}
                          />
                        </FormItem>
                        <div className="subTitle">관리비</div>
                        <FormItem name="managePrice" className="selectItem">
                          <Input
                            type="number"
                            value={0}
                            placeholder="관리비 입력"
                            className="override-input sub"
                            disabled
                          />
                        </FormItem>
                      </>
                    )}
                  </div>

                  <div className="registFran-btn">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="callTab"
                      style={{
                        width: 180,
                        height: 40,
                        fontSize: 18,
                        marginTop: -5,
                      }}
                    >
                      등록하기
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  branchIdx: state.login.loginInfo.branchIdx,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RegistFranDialog);
