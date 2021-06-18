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
import React, { Component } from "react";
import { connect } from "react-redux";
import { httpPost, httpUrl } from "../../../api/httpClient";
import {
  registComplete,
  registError,
  updateComplete,
  updateError
} from "../../../api/Modals";
import "../../../css/modal.css";
import {
  bikeType,
  riderGroupString,
  riderLevelText
} from "../../../lib/util/codeUtil";
import { formatDateSecond, formatYear } from "../../../lib/util/dateUtil";
import SearchBikeDialog from "../../dialog/common/SearchBikeDialog";

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
      // riderLevelSelected: false,
      // riderGroupSelected: false,
      feeManner: 1,
      userGroup: 1,
      riderLevel: 1,
      riderGroup: 0,
      withdrawLimit: 100000,

      bikeType: 0,
      isSearchBikeOpen: false,
      selectedBike: null,

      agreeSms: true,

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
            : "새로운 기사를 등록하시겠습니까??"}
        </div>
      ),

      okText: "확인",
      cancelText: "취소",
      onOk() {
        if (data) {
          httpPost(httpUrl.updateRider, [], {
            ...self.formRef.current.getFieldsValue(),
            idx: data.idx,
            branchIdx: self.props.branchIdx,
            agreeSms: self.state.agreeSms,
          })
            .then((res) => {
              if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                updateComplete();
              } else {
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
            // userType: 1,
            // deliveryPriceFeeType: self.state.feeManner,
          });
          httpPost(httpUrl.registRider, [], {
            ...self.formRef.current.getFieldsValue(),
            branchIdx: self.props.branchIdx,
            agreeSms: self.state.agreeSms,

            // userType: 1,
            // deliveryPriceFeeType: self.state.feeManner,
          })
            .then((res) => {
              if (res.result === "SUCCESS") {
                registComplete();
              } else {
                registError();
              }
              self.props.close();
              // this.getList();
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

  // handleChangeRiderLevel = (value) => {
  //     if (value === 1) {
  //         this.setState({ riderLevelSelected: true });
  //     } else {
  //         this.setState({ riderLevelSelected: false });
  //     }
  // }

  // handleChangeRiderGroup = (value) => {
  //     if (value === 1) {
  //         this.setState({ riderGroupSelected: true });
  //     } else {
  //         this.setState({ riderGroupSelected: false });
  //     }
  // }

  onChangFeeManner = (e) => {
    this.setState({ feeManner: e.target.value }, () => {});
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

  render() {
    // const selectedRowKeys = this.state.selectedRowKeys
    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: this.onSelectChange
    // };
    const { close, data } = this.props;
    console.log(data);

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
                        name="userType"
                        className="selectItem"
                        rules={[
                          { required: true, message: "그룹을 선택해주세요" },
                        ]}
                        initialValue={data ? data.userType : 3}
                      >
                        <Select
                          onChange={() =>
                            console.log(this.formRef.current.getFieldsValue())
                          }
                        >
                          {riderGroupString.map((v, index) => {
                            if (index === 0) return;
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
                          onChange={() =>
                            console.log(this.formRef.current.getFieldsValue())
                          }
                        >
                          {riderLevelText.map((v, index) => {
                            if (index === 0) return;
                            return <Option value={index}>{v}</Option>;
                          })}
                        </Select>
                      </FormItem>
                    </div>
                    {this.state.riderLevelSelected && (
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
                    )}

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
                      <FormItem name="password" className="selectItem">
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
                          this.setState({ selectedBike: selectedBike })
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
                      <Input
                        value={
                          this.state.selectedBike
                            ? this.state.selectedBike.bikeNumber
                            : this.props.data
                            ? this.props.data.bikeNumber
                            : ""
                        }
                        className="override-input"
                        placeholder="바이크를 선택해주세요."
                        disabled
                      />
                    </div>
                  </div>
                  <div className="registRiderWrapper sub">
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
                      <div className="mainTitle">최소보유잔액</div>
                      <FormItem
                        name="ncash"
                        className="selectItem"
                        initialValue={data ? data.ncash : 100000}
                      >
                        <Input
                          placeholder="최소보유잔액을 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">기본 배달료</div>
                      <FormItem
                        name="basicDeliveryPrice"
                        className="selectItem"
                        initialValue={data ? data.basicDeliveryPrice : 2500}
                      >
                        <Input
                          placeholder="기본배달료를 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">월기본건수</div>
                      <FormItem
                        name="monthBasicAmount"
                        className="selectItem"
                        initialValue={data ? data.monthBasicAmount : 10}
                      >
                        <Input
                          placeholder="최소보유잔액을 입력해 주세요."
                          className="override-input"
                        />
                      </FormItem>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">비품지급</div>
                      <FormItem name="" className="giveBox selectItem">
                        <Checkbox>헬멧</Checkbox>
                        <Checkbox>조끼</Checkbox>
                        <Checkbox>배달통</Checkbox>
                        <Checkbox>보냉</Checkbox>
                        <Checkbox>우의</Checkbox>
                        <Checkbox>피자가방</Checkbox>
                        <Checkbox>여름티</Checkbox>
                        <Checkbox>토시</Checkbox>
                        <Checkbox>바람막이</Checkbox>
                        <Checkbox>카드리더기</Checkbox>
                      </FormItem>
                    </div>

                    <div className="contentBlock" style={{ marginTop: 10 }}>
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
                    </div>

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
                        <p>바이크번호</p>
                        <FormItem name="bikeNumber" className="selectItem">
                          <Input
                            placeholder="번호를 입력해주세요."
                            className="override-input"
                            value={this.state.bikeNumber}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "bikeNumber")
                            }
                          />
                        </FormItem>
                      </li>

                      <li>
                        <p>모델명</p>
                        <FormItem name="modelName" className="selectItem">
                          <Input
                            placeholder="모델명을 입력해주세요."
                            className="override-input"
                            value={this.state.modelName}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "modelName")
                            }
                          />
                        </FormItem>
                      </li>
                      <li>
                        <p>제조사</p>
                        <FormItem name="maker" className="selectItem">
                          <Input
                            placeholder="제조사를 입력해주세요."
                            className="override-input"
                            value={this.state.maker}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "maker")
                            }
                          />
                        </FormItem>
                      </li>
                      <li>
                        <p>제조일자</p>
                        <FormItem name="makeDate" className="selectItem">
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
                        </FormItem>
                      </li>

                      <li>
                        <p>모델연식</p>
                        <FormItem name="modelYear" className="selectItem">
                          <DatePicker
                            onSelect={(value) =>
                              this.handleInput(formatYear(value), "modelYear")
                            }
                            picker="year"
                          />
                        </FormItem>
                      </li>

                      <li>
                        <p>주행거리</p>
                        <FormItem name="mileage" className="selectItem">
                          <Input
                            type="number"
                            placeholder="주행거리를 입력해주세요."
                            className="override-input"
                            value={this.state.mileage}
                            onChange={(e) =>
                              this.handleInput(e.target.value, "mileage")
                            }
                          />
                        </FormItem>
                      </li>

                      <li>
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: "#000",
                            borderColor: "#000",
                          }}
                          onClick={() => this.createBike()}
                        >
                          등록하기
                        </Button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="bike-type-box">
                    <div>지입바이크 등록</div>
                    <ul>
                      <li>
                        <p>바이크번호</p>
                        <FormItem
                          name="bike_number"
                          className="selectItem"
                          initialValue={data ? data.bike_number : ""}
                        >
                          <Input
                            placeholder="번호를 입력해주세요."
                            className="override-input"
                            disabled
                          />
                        </FormItem>
                      </li>

                      <li>
                        <p>모델명</p>
                        <FormItem
                          name="model_name"
                          className="selectItem"
                          initialValue={data ? data.model_name : ""}
                        >
                          <Input
                            placeholder="모델명을 입력해주세요."
                            className="override-input"
                            disabled
                          />
                        </FormItem>
                      </li>
                      <li>
                        <p>제조사</p>
                        <FormItem
                          name="maker"
                          className="selectItem"
                          initialValue={data ? data.maker : ""}
                          disabled
                        >
                          <Input
                            placeholder="제조사를 입력해주세요."
                            className="override-input"
                            disabled
                          />
                        </FormItem>
                      </li>
                      <li>
                        <p>제조일자</p>
                        <FormItem name="makeDate" className="selectItem">
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
                        </FormItem>
                      </li>

                      <li>
                        <p>모델연식</p>
                        <FormItem name="modelYear" className="selectItem">
                          <DatePicker
                            onSelect={(value) =>
                              this.handleInput(formatYear(value), "modelYear")
                            }
                            picker="year"
                            disabled
                          />
                        </FormItem>
                      </li>

                      <li>
                        <p>주행거리</p>
                        <FormItem name="mileage" className="selectItem">
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
                        </FormItem>
                      </li>

                      <li>
                        <Button onClick={() => this.createBike()} disabled>
                          등록하기
                        </Button>
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

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(RegistRiderDialog);
