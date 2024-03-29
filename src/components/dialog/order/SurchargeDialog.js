import React, { Component } from "react";
import {
  Form,
  Input,
  DatePicker,
  Table,
  Button,
  Modal,
  Checkbox,
  Radio,
  TimePicker,
} from "antd";
import { httpUrl, httpPost, httpGet } from "../../../api/httpClient";
import "../../../css/modal.css";
import { connect } from "react-redux";
import { comma } from "../../../lib/util/numberUtil";
import moment from "moment";
import SelectBox from "../../../components/input/SelectBox";
import { customAlert, customError } from "../../../api/Modals";
import {
  enabledString,
  enabledCode,
  surchargeType,
} from "../../../lib/util/codeUtil";
import SurchargeGroupDialog from "./SurchargeGroupDialog";
import SearchSurGroupDialog from "../../dialog/common/SearchSurGroupDialog";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SurchargeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      grpList: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      startDate: "",
      endDate: "",
      surchargeGroupOpen: false,
      surchargeSearchGrp: false,
      selectedGroup: null,
      surchargeType: 0,
      surchargeCheck: false,
      disabled: false,
      toggleDisable: "",
      pickerChange: false
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getGroupList();
    this.getList();
  }

  handleTableChange = (pagination) => {
    console.log(pagination);
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState(
      {
        pagination: pager,
      },
      () => this.getList()
    );
  };

  // 할증목록
  getList = () => {
    let pageNum = this.state.pagination.current;
    let pageSize = this.state.pagination.pageSize;
    httpGet(httpUrl.priceExtraList, [pageNum, pageSize], {})
      .then((res) => {
        console.log(JSON.stringify(res.data.deliveryPriceExtras, null, 4));
        const pagination = { ...this.state.pagination };
        pagination.current = res.data.currentPage;
        pagination.total = res.data.totalCount;
        this.setState({
          list: res.data.deliveryPriceExtras,
          pagination,
        });
      })
      .catch((e) => {
        Modal.info({
          title: "시스템 에러",
          content: "시스템 에러가 발생하였습니다. 다시 시도해 주십시오.",
        });
      });
  };
  // 지점에 해당된 그룹 리스트
  getGroupList = () => {
    httpPost(httpUrl.priceExtraGroupList, [], {
      branchIdx: this.props.branchIdx,
      pageNum: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
    })
      .then((res) => {
        if (res.result === "SUCCESS") {
          console.log("res.data :" + JSON.stringify(res.data, null, 4));
          this.setState(
            {
              grpList: res.data.frSettingGroups,
            },
            () => console.log(this.state.grpList)
          );
        } else {
          customAlert("목록 에러", "에러가 발생하여 목록을 불러올수 없습니다.");
        }
      })
      .catch((e) => {
        customError("목록 에러", "에러가 발생하여 목록을 불러올수 없습니다.");
      });
  };

  // 할증 그룹이름
  getSurChargeStr = (index) => {
    var selGrpList = this.state.grpList.filter((x) => x.idx === index);
    var groupName = "";
    for (let i = 0; i < selGrpList.length; i++) {
      groupName = selGrpList[i].settingGroupName;
    }
    return selGrpList.length !== 0 ? groupName : "전체";
  };

  // 할증등록
  handleSubmit = () => {
    let self = this;
    let frSettingGroupIdx;
    if (this.state.selectedGroup) {
      frSettingGroupIdx = this.state.selectedGroup.idx;
    }
    Modal.confirm({
      title: "할증 등록",
      content: (
        <div>
          {self.formRef.current.getFieldsValue().name + "을 등록하시겠습니까?"}
        </div>
      ),
      okText: "확인",
      cancelText: "취소",
      onOk() {
        let enabled = true;
        httpPost(httpUrl.priceExtraRegist, [], {
          ...self.formRef.current.getFieldsValue(),
          enabled,
          branchIdx: self.props.branchIdx,
          startDate: self.state.startDate,
          endDate: self.state.endDate,
          type: self.state.pickerChange == false ? 0 : 1,
          frSettingGroupIdx:
            self.state.surchargeType === 0 ? null : frSettingGroupIdx,
        })
          .then((res) => {
            if (res.result === "SUCCESS" && res.data === "SUCCESS") {
              customAlert(
                "등록 완료",
                self.formRef.current.getFieldsValue().name +
                  " 이(가) 등록되었습니다."
              );
            }
            self.handleClear();
            self.setState(
              {
                pagination: {
                  current: 1,
                  pageSize: 5,
                },
              },
              () => self.getList()
            );
          })
          .catch((error) => {
            customError(
              "등록 오류",
              "오류가 발생하였습니다. 다시 시도해 주십시오."
            );
          });
      },
    });
  };

  // 할증 등록기간 설정
  onChangeDate = (dateString) => {
    // 상시할증
    if(this.state.pickerChange){
      this.setState({
        startDate: dateString != null ? moment(dateString[0]).format("1999-01-01 HH:mm") : "",
        endDate: dateString != null ? moment(dateString[1]).format("2999-12-31 HH:mm") : "",
      });
    }
    // 기간설정 할증
    else this.setState({
      startDate:
        dateString != null
          ? moment(dateString[0]).format("YYYY-MM-DD HH:mm")
          : "",
      endDate:
        dateString != null
          ? moment(dateString[1]).format("YYYY-MM-DD HH:mm")
          : "",
    });
  };

  // 할증 등록시 초기화
  handleClear = () => {
    this.formRef.current.resetFields();
  };

  // 할증삭제
  onDelete = (row) => {
    let self = this;
    Modal.confirm({
      title: "할증 삭제",
      content: <div> {row.name} 할증을 삭제하시겠습니까?</div>,
      okText: "확인",
      cancelText: "취소",
      onOk() {
        let idx = row.idx;
        let name = row.name;
        httpGet(httpUrl.priceExtraDelete, [idx], {})
          .then((res) => {
            if (res.result === "SUCCESS" && res.data === "SUCCESS") {
              customAlert("할증 삭제", name + " 할증이 삭제되었습니다.");
              self.getList();
            }
          })
          .catch((error) => {
            customError(
              "삭제 오류",
              "오류가 발생하였습니다. 다시 시도해 주십시오."
            );
          });
      },
    });
  };

  // 할증 사용여부수정
  onChangeStatus = (index, value) => {
    httpPost(httpUrl.priceExtraUpdate, [], { idx: index, enabled: value })
      .then((res) => {
        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
          this.getList();
        }
      })
      .catch((error) => {
        customError(
          "수정 오류",
          "오류가 발생하였습니다. 다시 시도해 주십시오."
        );
      });
  };

  //대상 적용
  onCheckType = (e) => {
    this.setState({ surchargeType: e.target.value });
  };

  // 할증그룹관리 dialog
  openSurchargeGroupModal = () => {
    this.setState({ surchargeGroupOpen: true });
  };
  closeSurchargeGroupModal = () => {
    this.setState({ surchargeGroupOpen: false });
  };

  // 할증그룹조회 dialog
  openSurchargeSearchGrpModal = () => {
    this.setState({ surchargeSearchGrp: true });
  };
  closeSurchargeSearchGrpModal = () => {
    this.setState({ surchargeSearchGrp: false });
  };

  render() {
    const columns = [
      {
        title: "사용여부",
        dataIndex: "enabled",
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <SelectBox
              value={enabledString[data]}
              code={enabledCode}
              codeString={enabledString}
              onChange={(value) => {
                if (parseInt(value) !== row.enabled) {
                  this.onChangeStatus(row.idx, value);
                }
              }}
            />
          </div>
        ),
      },
      {
        title: "할증명",
        dataIndex: "name",
        className: "table-column-center",
      },
      {
        title: "적용시간",
        dataIndex: "completionTime",
        className: "table-column-center",
        render: (data, row) =>
         <div>
           {  row.type == 0 ? 
              row.startDate + " ~ " + row.endDate
              : "매일 " + moment(row.startDate).format("hh:mm") + " ~ "
              + moment(row.endDate).format("hh:mm")
           }
        </div>,
      },
      {
        title: "추가요금",
        dataIndex: "extraPrice",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: "할증 그룹",
        className: "table-column-center",
        render: (data, row) => (
          <div>{this.getSurChargeStr(row.frSettingGroupIdx)}</div>
        ),
      },
      {
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => {
                this.onDelete(row);
              }}
            >
              삭제
            </Button>
          </div>
        ),
      },
    ];

    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="surcharge-Dialog">
          <div className="surcharge-container">
            <div className="surcharge-title">할증</div>

            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="surcharge-close"
              alt="close"
            />

            <div className="surchargeLayout">
              {this.state.surchargeGroupOpen && (
                <SurchargeGroupDialog
                  isOpen={this.state.surchargeGroupOpen}
                  close={this.closeSurchargeGroupModal}
                />
              )}
              <Button onClick={this.openSurchargeGroupModal}>
                할증 그룹관리
              </Button>
              <div className="listBlock">
                <Table
                  dataSource={this.state.list}
                  columns={columns}
                  pagination={this.state.pagination}
                  onChange={this.handleTableChange}
                />
              </div>
              <Form ref={this.formRef} onFinish={this.handleSubmit}>
                <div className="insertBlock">
                  <div className="mainTitle">할증 요금 정보</div>

                  <div className="m-t-20">
                    <div>
                      <div className="subTitle">할증명</div>
                      <div className="inputBox">
                        <FormItem
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "할증명을 입력해주세요.",
                            },
                          ]}
                        >
                          <Input style={{ width: 180, marginRight: 45 }} />
                        </FormItem>
                      </div>
                      <div className="subDatePrice">추가요금</div>
                      <div className="inputBox">
                        <FormItem
                          name="extraPrice"
                          rules={[
                            {
                              required: true,
                              message: "추가금액을 입력해주세요.",
                            },
                          ]}
                        >
                          <Input style={{ width: 180 }} />
                        </FormItem>
                        <div className="priceText">원</div>
                      </div>
                    </div>

                    <div className="surcheck">
                      <div className="checkbox" style={{height: 32}}>상시할증</div>

                      <Checkbox
                        style={{ width: 225 }}
                        defaultChecked={
                          this.state.toggleDisable ? "checked" : ""
                        }
                        onChange={(e) =>
                          this.setState({ pickerChange: e.target.checked })
                        }
                      />

                      <div className="subDatePrice">{this.state.pickerChange == false ? "등록기간" : "등록시간"}</div>
                      <div className="selectBox">
                        {this.state.pickerChange == false ? 
                        <FormItem name="surchargeDate">
                          <RangePicker
                            placeholder={["시작일", "종료일"]}
                            showTime={{ format: "HH:mm" }}
                            onChange={this.onChangeDate}
                            />
                        </FormItem>
                        :
                        <FormItem name="surchargeDate">
                           <TimePicker.RangePicker
                            placeholder={["시작시간", "종료시간"]}
                            showTime={{ format: "HH:mm" }}
                            onChange={this.onChangeDate}
                            />
                        </FormItem>
                        }
                      </div>
                      <div>* 상시할증을 체크하는 경우 기간이 아니라 매일 등록시간에 해당하는 경우 적용됩니다.</div>
                    </div>

                    <div>
                      <div className="radioBtn">대상지정</div>
                      <Radio.Group
                        className="searchRequirement"
                        onChange={this.onCheckType}
                        value={this.state.surchargeType}
                        defaultValue={surchargeType[0]}
                        style={{ marginRight: 35 }}
                      >
                        {Object.entries(surchargeType).map(([key, value]) => {
                          return <Radio value={parseInt(key)}>{value}</Radio>;
                        })}
                      </Radio.Group>

                      {this.state.surchargeType === 1 ? (
                        <>
                          <div className="search-input">그룹명</div>
                          {this.state.surchargeSearchGrp && (
                            <SearchSurGroupDialog
                              close={this.closeSurchargeSearchGrpModal}
                              callback={(data) => {
                                this.setState({ selectedGroup: data });
                              }}
                            />
                          )}
                          <FormItem name="frName" className="selectItem">
                            <Input
                              style={{ width: 180 }}
                              placeholder="그룹명 입력"
                              className="override-input sub"
                              required
                              value={
                                this.state.selectedGroup
                                  ? this.state.selectedGroup.settingGroupName
                                  : ""
                              }
                            ></Input>
                            <Button onClick={this.openSurchargeSearchGrpModal}>
                              조회
                            </Button>
                          </FormItem>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="btnInsert">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="tabBtn insertTab"
                      >
                        등록하기
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    branchIdx: state.login.loginInfo.branchIdx,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SurchargeDialog);
