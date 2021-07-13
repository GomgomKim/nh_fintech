import { Button, Checkbox, DatePicker, Form, Input, Select } from "antd";
import React, { Component } from "react";
import "../../../css/modal.css";
import moment from 'moment';
import { httpPost, httpUrl } from "../../../api/httpClient";
import { customAlert, customError } from "../../../api/Modals";

const FormItem = Form.Item;
// const Search = Input.Search;
const Option = Select.Option;
const today = new Date();
const { RangePicker } = DatePicker;

class RegistBatchWorkDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchRiderOpen: false,
      selectedGroup: null,
      list: [],
      startDate: "",
      endDate: "",
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      batchSearchGrp: null,
      disabled: false
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    // this.getList()
  }

  setDate = (date) => {
    console.log(date);
  };

  onSearchRider = (value) => {
    this.setState({ searchName: value },
      () => { this.getList() }
    );
  };

  onChangeDate = (dateString) => {
    this.setState({
      startDate: dateString != null ? moment(dateString[0]).format('YYYY-MM-DD 00:00') : '',
      endDate: dateString != null ? moment(dateString[1]).format('YYYY-MM-DD 23:59') : '',
    })
  };

  handleSubmit = () => {
    httpPost(httpUrl.riderBatchWorkCreate, [], {
      ...this.formRef.current.getFieldsValue(),
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      category: 1,
      memo: '',
    }).then((res) => {
      if (res.data === "SUCCESS" && res.result === "SUCCESS") {
        customAlert("일차감 등록",
          this.formRef.current.getFieldValue("title") + " 일차감이 등록되었습니다.")
        this.props.close()
        this.props.callback()
      }
      else
        customError("추가 오류", "오류가 발생하였습니다. 다시 시도해 주십시오.")
    })
      .catch((error) => {
        customError("추가 오류", "오류가 발생하였습니다. 다시 시도해 주십시오.")
      });
  }


  render() {
    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="taskWork-Dialog">
          <div className="taskWork-content">
            <Form ref={this.formRef} onFinish={this.handleSubmit}>
              <div className="taskWork-title">일차감 등록</div>
              <img
                onClick={close}
                src={require("../../../img/login/close.png").default}
                className="taskWork-close"
                alt="close"
              />
              <div className="taskWork-title-sub">일차감 등록정보</div>
              <div className="taskWork-inner">
                <div className="taskWork-list">
                  {/* <div className="twl taskWork-list-01">
                  <div className="twl-text">사용여부</div>
                  <Checkbox></Checkbox>
                  {/* <span className="useText">사용함</span> */}
                  {/* </div> */}
                  <div className="twl taskWork-list-02">
                    <div className="twl-text">차감명</div>
                    <div className="inputBox inputBox-taskWork sub">
                      <FormItem
                        name="title"
                        rules={[{ required: true, message: "차감명을 입력해주세요." }]}
                      >
                        <Input style={{ width: 250 }} />
                      </FormItem>
                    </div>
                  </div>
                  <div className="twl taskWork-list-04">
                    <div className="twl-text">차감금액</div>
                    <div className="taskWork-place1">
                      <div className="inputBox inputBox-taskWork sub">
                        <FormItem
                          name="ncashDelta"
                          rules={[{ required: true, message: "금액을 입력해주세요." }]}
                        >
                          <Input style={{ width: 250, marginRight: 10, float: "left" }} />
                        </FormItem>
                      </div>
                    </div>
                  </div>


                  {/* <div className="twl taskWork-list-02">
                  <div className="twl-text">메모</div>
                  <div className="inputBox inputBox-taskWork sub">
                    <FormItem
                      name="memo"
                    >
                      <Input style={{ width:250 }}/>
                    </FormItem>
                  </div>
                </div> */}


                  {/* <div className="twl taskWork-list-03">
                  <div className="twl-text">적용대상</div>
                  <div className="taskWork-place1">
                  {this.state.batchSearchGrp &&
                  <SearchBatchGroupDialog
                    close={this.closeSurchargeSearchGrpModal}
                    callback={(data) => {
                    this.setState({ selectedGroup:data })
                    }}
                  />}
                   <FormItem
                      name="frName"
                      className="selectItem"
                    >
                      <Input style={{width: 185}}placeholder="그룹명 입력" className="override-input sub" required
                        value={ this.state.selectedGroup ? this.state.selectedGroup.settingGroupName : ""}>
                      </Input>
                        <Button onClick={this.openSurchargeSearchGrpModal}>
                        조회
                        </Button>
                    </FormItem>                                             
                  </div>
                </div> */}
                  <div className="twl taskWork-list-05">
                    <div className="twl-text">기간제한</div>
                    <RangePicker
                      placeholder={['시작일', '종료일']}
                      // showTime={{ format: 'HH:mm' }}
                      onChange={this.onChangeDate}
                      disabled={this.state.disabled}
                      style={{ width: 350 }}
                    />
                  </div>
                  <div style={{
                    lineHeight: 1,
                    color: "#ccc",
                    textAlign: "center",
                    marginLeft: -25
                  }}>
                    * 선택한 기간동안 새벽 5시에 차감됩니다
                  </div>
                </div>
              </div>

              <div className="taskWork-btn-01">
                <Button
                  type="primary" htmlType="submit"
                  className="tabBtn taskWork-btn">
                  등록
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RegistBatchWorkDialog;
