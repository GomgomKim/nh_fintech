import { Button, Checkbox, DatePicker, Form, Input, Select } from "antd";
import React, { Component } from "react";
import "../../../css/modal.css";

const FormItem = Form.Item;
// const Search = Input.Search;
const Option = Select.Option;

const today = new Date();
const { RangePicker } = DatePicker;

class TaskWorkDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: today,
      isTimeLimit: false,
      searchRiderOpen: false,
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    // this.getList()
    // console.log(this.props)
  }

  setDate = (date) => {
    console.log(date);
  };

  timeLimitCheck = () => {
    if (this.state.isTimeLimit) {
      this.setState({
        isTimeLimit: false,
      });
    } else {
      this.setState({
        isTimeLimit: true,
      });
    }
  };

  onSearchRider = (value) => {
    this.setState(
      {
        searchName: value,
      },
      () => {
        this.getList();
      }
    );
  };
  onSearchRiderDetail = (data) => {
    console.log("### get fran list data : " + data);
    // this.setState({ results: data });
  };

  // 기사조회 dialog
  openSearchRiderModal = () => {
    this.setState({ searchRiderOpen: true });
  };
  closeSearchRiderModal = () => {
    this.setState({ searchRiderOpen: false });
  };

  render() {
    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="taskWork-Dialog">
          <div className="taskWork-content">
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
                <div className="twl taskWork-list-01">
                  <div className="twl-text">사용여부</div>
                  <Checkbox></Checkbox>
                  {/* <span className="useText">사용함</span> */}
                </div>
                <div className="twl taskWork-list-02">
                  <div className="twl-text">차감명</div>
                  <div className="inputBox inputBox-taskWork sub">
                    <FormItem
                      name="riderG"
                      rules={[{ required: true, message: "0건." }]}
                    >
                      <Input />
                    </FormItem>
                  </div>
                </div>
                <div className="twl taskWork-list-03">
                  <div className="twl-text">적용대상</div>
                  <div className="taskWork-place1">
                    <FormItem
                      style={{
                        marginBottom: 0,
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                      name="taskWork-place"
                    >
                      <Select
                        placeholder="적용대상을 선택해주세요"
                        className="taskWork-select"
                      >
                        {/* <Option value={1}>대여금 -36300원 배지현</Option>
                                                <Option value={2}>대여금 -36300원 배지현</Option>
                                                <Option value={3}>대여금 -36300원 배지현</Option> */}
                        <Option value={1}>리스 21,000원 그룹</Option>
                        <Option value={2}>리스 23,000원 그룹</Option>
                        <Option value={3}>대출상환 31,000원 그룹</Option>
                      </Select>
                      {/* {this.state.searchRiderOpen &&
                                                <SearchRiderDialog
                                                    close={this.closeSearchRiderModal}
                                                    callback={(data) => this.setState({
                                                        selectedRider: data
                                                    })}
                                                />}
                                            <Button className="tabBtn" onClick={this.openSearchRiderModal}
                                                style={{ width: 186, marginLeft: -1 }}>
                                                기사조회
                                             </Button> */}
                    </FormItem>
                  </div>
                </div>
                <div className="twl taskWork-list-04">
                  <div className="twl-text">차감금액</div>
                  <div className="taskWork-place1">
                    <div className="inputBox inputBox-taskWork sub">
                      <FormItem
                        name="riderG"
                        rules={[{ required: true, message: "0건." }]}
                      >
                        <Input style={{ marginRight: 10, float: "left" }} />
                      </FormItem>
                    </div>
                  </div>
                </div>
                <div className="twl taskWork-list-05">
                  <div className="twl-text">기간제한사용</div>
                  <Checkbox
                    className="useBtn"
                    onClick={this.timeLimitCheck}
                    style={{ marginLeft: 0 }}
                  ></Checkbox>

                  {this.state.isTimeLimit && (
                    <RangePicker
                      placeholder={["시작일", "종료일"]}
                      format={"YYYY-MM-DD"}
                      onChange={this.onChangeDate}
                      style={{ width: 300 }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="taskWork-btn-01">
              <Button className="tabBtn taskWork-btn" onClick={() => {}}>
                등록
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TaskWorkDialog;
