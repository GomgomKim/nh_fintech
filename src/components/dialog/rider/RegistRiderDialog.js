import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { httpPost, httpUrl } from "../../../api/httpClient";
import {
  registComplete,
  registError,
  updateComplete,
  updateError,
  idDuplicated
} from "../../../api/Modals";
import "../../../css/modal.css";
import {
  bankCode,
  bikeType,
  items,
  riderGroupString,
  riderLevelText
} from "../../../lib/util/codeUtil";
import {
  formatDateSecond,
  formatDateToDay,
  formatYear
} from "../../../lib/util/dateUtil";
import SearchBikeDialog from "../../dialog/common/SearchBikeDialog";
import SearchRiderDialog from "../common/SearchRiderDialog";

const Option = Select.Option;
const FormItem = Form.Item;

class RegistRiderDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      staffAuth: 1,
      feeManner: 1,
      userGroup: 1,
      riderLevel: null,
      riderGroup: 0,
      withdrawLimit: 100000,

      bikeType: 0,
      isSearchBikeOpen: false,
      searchRiderOpen: false,
      selectedBike: null,
      selectedRider: null,

      // agreeSms: true,

      // 바이크 등록 param
      bikeNumber: "",
      makeDate: "",
      maker: "",
      modelName: "",
      modelYear: "",
      mileage: "",
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    // this.getList()
    if (this.props.data) {
      this.setState(
        {
          selectedBike: this.props.data.bike,
          riderLevel: this.props.data.riderLevel,
          selectedRider: { idx: this.props.data.teamManagerIdx },
        },
        () =>
          this.formRef.current.setFieldsValue({
            teamManagerIdx: this.state.selectedRider.idx,
          })
      );
    }
    console.log(this.props.data);
  }

  // onChange = e => {
  //     this.setState({
  //         staffAuth: e.target.value,
  //     });
  // };

  handleSubmit = () => {
    let self = this;
    let { data } = this.props;
    Modal.confirm({
      title: <div> {data ? "기사 수정" : "기사 등록"}</div>,
      content: (
        <div>
          {data
            ? "기사 정보를 수정하시겠습니까?"
            : "새로운 기사를 등록하시겠습니까?"}
        </div>
      ),

      okText: "확인",
      cancelText: "취소",
      onOk() {
        if (data) {
          console.log({
            ...self.formRef.current.getFieldsValue(),
            idx: data.idx,
            branchIdx: self.props.branchIdx,
            agreeSms: self.state.agreeSms,
            riderSettingGroup: {
              idx: self.formRef.current.getFieldValue("riderSettingGroup"),
            },
            bikeIdx: self.state.selectedBike && self.state.selectedBike.idx,
            items: self.formRef.current.getFieldValue("items").join(","),
            joinDate: formatDateToDay(
              self.formRef.current.getFieldValue("joinDate")
            ),
            leaveDate: formatDateToDay(
              self.formRef.current.getFieldValue("leaveDate")
            ),
            registrationNumber: self.formRef.current
              .getFieldValue("registrationNumber")
              .replace("-", ""),

            // 삭제컬럼
            agreeSms: false,
          });
          httpPost(httpUrl.updateRider, [], {
            ...self.formRef.current.getFieldsValue(),
            idx: data.idx,
            branchIdx: self.props.branchIdx,
            agreeSms: self.state.agreeSms,
            riderSettingGroup: {
              idx: self.formRef.current.getFieldValue("riderSettingGroup"),
            },
            bikeIdx: self.state.selectedBike && self.state.selectedBike.idx,
            items: self.formRef.current.getFieldValue("items").join(","),
            joinDate: formatDateToDay(
              self.formRef.current.getFieldValue("joinDate")
            ),
            leaveDate: formatDateToDay(
              self.formRef.current.getFieldValue("leaveDate")
            ),
            password: self.formRef.current.getFieldValue("password")
              ? self.formRef.current.getFieldValue("password")
              : null,
            registrationNumber: self.formRef.current
              .getFieldValue("registrationNumber")
              .replace("-", ""),

            // 삭제컬럼
            agreeSms: false,
          })
            .then((res) => {
              console.log(JSON.stringify(res.data, null, 4))
              if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                updateComplete();
              }
              else {
                updateError();
              }
              self.props.close();
            })
            .catch((e) => {
              updateError();
            });
        } else {
          console.log({
            ...self.formRef.current.getFieldsValue(),
            branchIdx: self.props.branchIdx,
            agreeSms: self.state.agreeSms,
            riderSettingGroup: {
              idx: self.formRef.current.getFieldValue("riderSettingGroup"),
            },
            userType: 1,
            bikeIdx: self.state.selectedBike && self.state.selectedBike.idx,
            ncash: 0,
            items: self.formRef.current.getFieldValue("items").join(","),
            joinDate: formatDateToDay(
              self.formRef.current.getFieldValue("joinDate")
            ),
            leaveDate: formatDateToDay(
              self.formRef.current.getFieldValue("leaveDate")
            ),
            agreeSms: false,
            registrationNumber: self.formRef.current
              .getFieldValue("registrationNumber")
              .replace("-", ""),

            // deliveryPriceFeeType: self.state.feeManner,
          });
          httpPost(httpUrl.registRider, [], {
            ...self.formRef.current.getFieldsValue(),
            branchIdx: self.props.branchIdx,
            agreeSms: self.state.agreeSms,
            riderSettingGroup: {
              idx: self.formRef.current.getFieldValue("riderSettingGroup"),
            },
            userType: 1,
            bikeIdx: self.state.selectedBike && self.state.selectedBike.idx,
            items: self.formRef.current.getFieldValue("items").join(","),
            joinDate: formatDateToDay(
              self.formRef.current.getFieldValue("joinDate")
            ),
            leaveDate: formatDateToDay(
              self.formRef.current.getFieldValue("leaveDate")
            ),
            agreeSms: false,
            registrationNumber: self.formRef.current
              .getFieldValue("registrationNumber")
              .replace("-", ""),

            // 기사 생성 시 예치금 정책 어떻게 될지에 따라 변경 될 수 있음
            // ncash 컬럼이 not null 이어서 기사 등록 시 0 설정
            ncash: 0,
            // deliveryPriceFeeType: self.state.feeManner,
          })
            .then((res) => {
              // console.log(JSON.stringify(res, null, 4))
              if (res.result === "SUCCESS" && res.data == "SUCCESS") {
                registComplete();
                self.props.close();
              } else if (res.result === "SUCCESS" && res.data == "ID_DUPLICATED") {
                idDuplicated();
              } else {
                registError();
                self.props.close();
              }

            })
            .catch((e) => {
              registError();
            });
        }
      },
    });
  };

  handleClear = () => {
    this.formRef.current.resetFields();
  };

  handleInput = (value, key) => {
    let newState = this.state;
    newState[key] = value;
    this.setState(newState, () => console.log(this.state));
  };

  createBike = () => {
    httpPost(httpUrl.createBike, [], {
      bikeNumber: this.state.bikeNumber,
      makeDate: this.state.makeDate,
      maker: this.state.maker,
      modelName: this.state.modelName,
      modelYear: this.state.modelYear,
      mileage: this.state.mileage,
    })
      .then((res) => {
        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
          Modal.info({
            title: "등록성공",
            content: "바이크 등록에 성공했습니다.",
          });
        } else {
          Modal.info({
            title: "등록실패",
            content: "바이크 등록에 실패했습니다.",
          });
        }
      })
      .catch((e) => {
        Modal.info({
          title: "등록실패",
          content: "바이크 등록에 실패했습니다.",
        });
        console.log(e);
        throw e;
      });
  };

  onChangFeeManner = (e) => {
    this.setState({ feeManner: e.target.value }, () => { });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys: selectedRowKeys });
  };

  onCheckType = (e) => {
    this.setState({ bikeType: e.target.value });
  };

  openSearchBikeModal = () => {
    this.setState({ isSearchBikeOpen: true });
  };

  closeSearchBikeModal = () => {
    this.setState({ isSearchBikeOpen: false });
  };

  openSearchRiderModal = () => {
    this.setState({ searchRiderOpen: true });
  };

  closeSearchRiderModal = () => {
    this.setState({ searchRiderOpen: false });
  };

  render() {
    const { close, data } = this.props;
    console.log(data);

    const dateFormat = "YYYY/MM/DD";
    const today = new Date();

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="registRider-Dialog">
          <div className="registRider-content">
            <div className="registRider-title">
              {data ? "기사 수정" : "기사 등록"}
            </div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="registRider-close"
              alt="close"
            />

            <Form ref={this.formRef} onFinish={this.handleSubmit}>
              <div className="registRiderLayout">
                <div className="registRiderBox">
                  <div className="registFranTitle">
                    <div className="registFranTitle-sub">기본정보</div>
                  </div>
                  <div className="registRiderWrapper">
                    <div className="contentBlock">
                      <div className="mainTitle">기사그룹</div>
                      <FormItem
                        name="riderSettingGroup"
                        className="selectItem"
                        rules={[
                          { required: true, message: "그룹을 선택해주세요" },
                        ]}
                        initialValue={
                          data
                            ? riderGroupString.findIndex(
                              (item) =>
                                item ===
                                data.riderSettingGroup.settingGroupName
                            )
                            : 3
                        }
                      >
                        <Select>
                          {riderGroupString.map((v, index) => {
                            if (index === 0) return <></>;
                            return <Option value={index}>{v}</Option>;
                          })}
                        </Select>
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">직급</div>
                      <FormItem
                        name="riderLevel"
                        className="selectItem"
                        rules={[
                          { required: true, message: "직급을 선택해주세요" },
                        ]}
                        initialValue={data ? data.riderLevel : 1}
                      >
                        <Select
                          onChange={(value) =>
                            this.setState({ riderLevel: value })
                          }
                        >
                          {riderLevelText.map((v, index) => {
                            if (index === 0) return <></>;
                            return <Option value={index}>{v}</Option>;
                          })}
                        </Select>
                      </FormItem>
                    </div>
                    {/* {this.state.riderLevelSelected && (
                      <div className="contentBlock">
                        <div className="mainTitle">소속팀장</div>
                        <FormItem
                          name="teamManager"
                          className="selectItem"
                          rules={[
                            {
                              required: true,
                              message: "팀장을 선택해주세요",
                            },
                          ]}
                        >
                          <Select
                            placeholder="팀장을 선택해주세요."
                            className="override-select branch"
                          >
                            <Option value={1}>김동일</Option>
                            <Option value={2}>문승현</Option>
                            <Option value={3}>송용학</Option>
                            <Option value={4}>김시욱</Option>
                            <Option value={5}>홍원표</Option>
                          </Select>
                        </FormItem>
                      </div>
                    )} */}

                    <div className="contentBlock">
                      <div className="mainTitle">기사명</div>
                      <FormItem
                        name="riderName"
                        className="selectItem"
                        rules={[
                          {
                            required: true,
                            message: "직원명을 입력해주세요",
                          },
                        ]}
                        initialValue={data ? data.riderName : ""}
                      >
                        <Input
                          placeholder="직원명을 입력해주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
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
                        initialValue={data ? data.id : ""}
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
                        // rules={[{ required: true, message: "이메일을 입력해주세요" }]}
                        initialValue={data ? data.email : ""}
                      >
                        <Input
                          placeholder="ex) example@naver.com"
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">패스워드</div>
                      <FormItem
                        name="password"
                        className="selectItem"
                        rules={[
                          {
                            required: data ? false : true,
                            message: "패스워드를 입력해주세요",
                          },
                        ]}
                      >
                        <Input.Password
                          placeholder="패스워드를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">전화번호</div>
                      <FormItem
                        name="phone"
                        className="selectItem"
                        rules={[
                          {
                            required: true,
                            message: "전화번호를 입력해주세요",
                          },
                        ]}
                        initialValue={data ? data.phone : ""}
                      >
                        <Input
                          placeholder="휴대전화 번호를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    {this.state.isSearchBikeOpen && (
                      <SearchBikeDialog
                        onSelect={(selectedBike) =>
                          this.setState({ selectedBike: selectedBike }, () => {
                            console.log("selectedBike");
                            console.log(
                              this.state.selectedBike
                                ? this.state.selectedBike.bikeNumber
                                : this.props.data
                                  ? this.props.data.bikeNumber
                                  : ""
                            );
                            console.log(this.state.selectedBike);
                          })
                        }
                        close={this.closeSearchBikeModal}
                      />
                    )}
                    <div className="contentBlock" style={{ marginTop: 10 }}>
                      <div className="mainTitle">바이크</div>
                      <Radio.Group
                        className="searchRequirement"
                        onChange={this.onCheckType}
                        value={this.state.bikeType}
                        defaultValue={bikeType[0]}
                        style={{ marginRight: 19 }}
                      >
                        {Object.entries(bikeType).map(([key, value]) => {
                          return <Radio value={parseInt(key)}>{value}</Radio>;
                        })}
                      </Radio.Group>
                      <Button
                        className="tabBtn sectionTab"
                        onClick={this.openSearchBikeModal}
                      >
                        바이크 조회
                      </Button>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle" />
                      {/* <FormItem
                        name="bikeNumber"
                        className="selectItem override-input"
                      > */}
                      <Input
                        value={
                          this.state.selectedBike &&
                          this.state.selectedBike.bikeNumber
                        }
                        className="override-input"
                        placeholder="바이크를 선택해주세요."
                      // disabled
                      />
                      {/* </FormItem> */}
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">메모</div>
                      <FormItem
                        name="memo"
                        className="selectItem"
                        // rules={[{ required: true, message: "메모를 입력해주세요" }]}
                        initialValue={data ? data.memo : ""}
                      >
                        <Input
                          placeholder="메모를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      {/* 컬럼 확인 필요 */}
                      <div className="mainTitle">최소보유잔액</div>
                      <FormItem
                        name="ncashMin"
                        className="selectItem"
                        initialValue={data ? data.ncashMin : 100000}
                      >
                        <Input
                          placeholder="최소보유잔액을 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                  </div>
                  <div className="registRiderWrapper sub">
                    {this.state.riderLevel >= 3 && (
                      <>
                        <div className="contentBlock">
                          <div className="mainTitle">기본 배달료</div>
                          <FormItem
                            name="basicDeliveryPrice"
                            className="selectItem"
                            initialValue={data ? data.basicDeliveryPrice : 3600}
                          >
                            <Input
                              placeholder="기본배달료를 입력해 주세요."
                              className="override-input"
                            // disabled={this.state.riderLevel <= 2}
                            />
                          </FormItem>
                        </div>
                        <div className="contentBlock">
                          <div className="mainTitle">월기본건수</div>
                          <FormItem
                            name="monthBasicAmount"
                            className="selectItem"
                            initialValue={data ? data.monthBasicAmount : 250}
                          >
                            <Input
                              placeholder="월기본건수를 입력해 주세요."
                              className="override-input"
                            // disabled={this.state.riderLevel <= 2}
                            />
                          </FormItem>
                        </div>
                      </>
                    )}
                    {this.state.riderLevel < 3 && (
                      <>
                        <div className="contentBlock">
                          <div className="mainTitle">소속팀장</div>
                          <FormItem
                            name="teamManagerIdx"
                            className="selectItem"
                            rules={[
                              {
                                required: true,
                                message: "팀장순번을 입력해주세요",
                              },
                            ]}
                          >
                            <Input
                              style={{ width: 170 }}
                              placeholder="팀장순번을 입력해 주세요."
                              value={
                                this.state.selectedRider &&
                                this.state.selectedRider.idx
                              }
                            />
                            <Button onClick={() => this.openSearchRiderModal()}>
                              기사 조회
                            </Button>
                          </FormItem>
                        </div>
                        {this.state.searchRiderOpen && (
                          <SearchRiderDialog
                            teamManagerOnly={true}
                            callback={(selectedRider) =>
                              this.setState(
                                { selectedRider: selectedRider },
                                () => {
                                  this.formRef.current.setFieldsValue({
                                    teamManagerIdx:
                                      this.state.selectedRider.idx,
                                  });
                                }
                              )
                            }
                            close={this.closeSearchRiderModal}
                          />
                        )}
                      </>
                    )}

                    <div className="contentBlock">
                      <div className="mainTitle">주민등록번호</div>
                      <FormItem
                        name="registrationNumber"
                        className="selectItem"
                        rules={[
                          {
                            required: true,
                            message: "주민번호를 '-'를 빼고 입력해주세요",
                          },
                        ]}
                        initialValue={data ? data.registrationNumber : ""}
                      >
                        <Input
                          placeholder="주민번호를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">은행</div>
                      <FormItem
                        name="bank"
                        className="selectItem"
                        rules={[
                          { required: true, message: "은행을 선택해주세요" },
                        ]}
                        initialValue={data ? data.bank : "기업은행,003"}
                      >
                        <Select>
                          {Object.keys(bankCode).map((key) => {
                            return (
                              <Option value={key + "," + bankCode[key]}>
                                {key}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">계좌번호</div>
                      <FormItem
                        name="bankAccount"
                        className="selectItem"
                        rules={[
                          {
                            required: true,
                            message: "계좌번호를 입력해주세요",
                          },
                        ]}
                        initialValue={data ? data.bankAccount : ""}
                      >
                        <Input
                          placeholder="계좌번호를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">예금주</div>
                      <FormItem
                        name="depositor"
                        className="selectItem"
                        rules={[
                          { required: true, message: "예금주를 입력해주세요" },
                        ]}
                        initialValue={data ? data.depositor : ""}
                      >
                        <Input
                          placeholder="예금주를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">입사일</div>
                      <FormItem
                        name="joinDate"
                        className="selectItem"
                        initialValue={
                          data
                            ? moment(data.joinDate, "YYYY-MM-DD")
                            : moment(today, dateFormat)
                        }
                      >
                        <DatePicker
                          style={{ width: 260 }}
                          className="selectItem"
                          format={dateFormat}
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">퇴사일</div>
                      <FormItem name="leaveDate" className="selectItem">
                        <DatePicker
                          style={{ width: 260 }}
                          className="selectItem"
                          defaultValue={
                            data
                              ? data.leaveDate
                                ? moment(data.leaveDate, "YYYY-MM-DD")
                                : ""
                              : ""
                          }
                          format={dateFormat}
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">비품지급</div>
                      <FormItem
                        name="items"
                        className="giveBox selectItem"
                        initialValue={
                          data && data.items ? data.items.split(",") : []
                        }
                      >
                        <Checkbox.Group
                          options={items}
                          // initialValue={
                          //   data && data.items ? data.items.split(",") : []
                          // }
                          onChange={(value) => console.log(value)}
                        />
                      </FormItem>
                    </div>
                    {/* <div className="contentBlock" style={{ marginTop: 10 }}>
                      <div className="mainTitle">강제배차 사용</div>
                      <FormItem
                        name="agreeForceAllocate"
                        className="giveBox selectItem"
                        defaultChecked={data ? data.agreeForceAllocate : true}
                      >
                        <Checkbox
                          className="override-input"
                          defaultChecked={data ? data.agreeForceAllocate : true}
                        >
                          사용
                        </Checkbox>
                      </FormItem>
                    </div> */}
                    {/* <div className="contentBlock" style={{ marginTop: 10 }}>
                      <div className="mainTitle">SMS수신동의</div>
                      <FormItem name="agreeSms" className="giveBox selectItem">
                        <Checkbox
                          className="override-input"
                          defaultChecked={data ? data.agreeSms : true}
                          onChange={(e) =>
                            this.setState({ agreeSms: e.target.checked })
                          }
                        >
                          수신동의
                        </Checkbox>
                      </FormItem>
                    </div> */}
                    <div className="submitBlock">
                      <Button type="primary" htmlType="submit">
                        등록하기
                      </Button>

                      {!data && (
                        <Button className="clearBtn" onClick={this.handleClear}>
                          초기화
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                {this.state.bikeType === 1 ? (
                  <div className="bike-type-box">
                    <div>지입바이크 등록</div>
                    <ul>
                      <li>
                        <p className="regist-bike-title">바이크번호</p>
                        <div name="bikeNumber" className="selectItem">
                          <Input
                            placeholder="번호를 입력해주세요."
                            className="override-input"
                            value={this.state.bikeNumber}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "bikeNumber")
                            }
                          />
                        </div>
                      </li>

                      <li>
                        <p className="regist-bike-title">모델명</p>
                        <div name="modelName" className="selectItem">
                          <Input
                            placeholder="모델명을 입력해주세요."
                            className="override-input"
                            value={this.state.modelName}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "modelName")
                            }
                          />
                        </div>
                      </li>
                      <li>
                        <p className="regist-bike-title">제조사</p>
                        <div name="maker" className="selectItem">
                          <Input
                            placeholder="제조사를 입력해주세요."
                            className="override-input"
                            value={this.state.maker}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "maker")
                            }
                          />
                        </div>
                      </li>
                      <li>
                        <p className="regist-bike-title">제조일자</p>
                        <div name="makeDate" className="selectItem">
                          {/* <Input
                            placeholder="제조일자를 입력해주세요."
                            className="override-input"
                          /> */}
                          <DatePicker
                            onSelect={(value) =>
                              this.handleInput(
                                formatDateSecond(value),
                                "makeDate"
                              )
                            }
                          />
                        </div>
                      </li>

                      <li>
                        <p className="regist-bike-title">모델연식</p>
                        <div name="modelYear" className="selectItem">
                          <DatePicker
                            onSelect={(value) =>
                              this.handleInput(formatYear(value), "modelYear")
                            }
                            picker="year"
                          />
                        </div>
                      </li>

                      <li>
                        <p className="regist-bike-title">주행거리</p>
                        <div name="mileage" className="selectItem">
                          <Input
                            type="number"
                            placeholder="주행거리를 입력해주세요."
                            className="override-input"
                            value={this.state.mileage}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "mileage")
                            }
                          />
                        </div>
                      </li>

                      <li></li>
                    </ul>
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#000",
                        borderColor: "#000",
                        float: "right",
                        marginTop: 20,
                        marginRight: 35,
                      }}
                      onClick={() => this.createBike()}
                    >
                      등록하기
                    </Button>
                  </div>
                ) : (
                  <div className="bike-type-box">
                    <div>지입바이크 등록</div>
                    <ul>
                      <li>
                        <p className="regist-bike-title">바이크번호</p>
                        <div name="bikeNumber" className="selectItem">
                          <Input
                            placeholder="번호를 입력해주세요."
                            className="override-input"
                            value={this.state.bikeNumber}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "bikeNumber")
                            }
                            disabled
                          />
                        </div>
                      </li>

                      <li>
                        <p className="regist-bike-title">모델명</p>
                        <div name="modelName" className="selectItem">
                          <Input
                            placeholder="모델명을 입력해주세요."
                            className="override-input"
                            value={this.state.modelName}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "modelName")
                            }
                            disabled
                          />
                        </div>
                      </li>
                      <li>
                        <p className="regist-bike-title">제조사</p>
                        <div name="maker" className="selectItem">
                          <Input
                            placeholder="제조사를 입력해주세요."
                            className="override-input"
                            value={this.state.maker}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "maker")
                            }
                            disabled
                          />
                        </div>
                      </li>
                      <li>
                        <p className="regist-bike-title">제조일자</p>
                        <div name="makeDate" className="selectItem">
                          {/* <Input
                            placeholder="제조일자를 입력해주세요."
                            className="override-input"
                          /> */}
                          <DatePicker
                            onSelect={(value) =>
                              this.handleInput(
                                formatDateSecond(value),
                                "makeDate"
                              )
                            }
                            disabled
                          />
                        </div>
                      </li>

                      <li>
                        <p className="regist-bike-title">모델연식</p>
                        <div name="modelYear" className="selectItem">
                          <DatePicker
                            onSelect={(value) =>
                              this.handleInput(formatYear(value), "modelYear")
                            }
                            picker="year"
                            disabled
                          />
                        </div>
                      </li>

                      <li>
                        <p className="regist-bike-title">주행거리</p>
                        <div name="mileage" className="selectItem">
                          <Input
                            type="number"
                            placeholder="주행거리를 입력해주세요."
                            className="override-input"
                            value={this.state.mileage}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "mileage")
                            }
                            disabled
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
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

const mapDispatchToProps = () => { };

export default connect(mapStateToProps, mapDispatchToProps)(RegistRiderDialog);
