import { Button, Form, Input, Modal, Radio, Table } from "antd";
import React, { Component } from "react";
import { httpPost, httpUrl } from "../../../api/httpClient";
import "../../../css/modal.css";
import { deliveryPriceFeeType } from "../../../lib/util/codeUtil";
import { comma } from "../../../lib/util/numberUtil";

const FormItem = Form.Item;

class RiderGroupDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 1,
      },
      rowId: 1,

      selectedGroup: null,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
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

  handleSelectedGroupChange = (value, key) => {
    if (this.state.selectedGroup) {
      let inputRes = this.state.selectedGroup;
      inputRes[key] = value;
      this.setState({ selectedGroup: inputRes });
    } else {
      return null;
    }
  };

  onClickRow = (row) => {
    return {
      onClick: () => {
        const deepCopy = Object.assign({}, row);
        this.setState({ selectedGroup: deepCopy, rowId: deepCopy.idx }, () => {
          this.formRef.current.setFieldsValue({
            amountPerOneTime: row.amountPerOneTime,
            deliveryPriceFeeType: row.deliveryPriceFeeType,
            deliveryPriceFeeAmount: row.deliveryPriceFeeAmount,
          });
          console.log(this.state.selectedGroup);
        });
      },
    };
  };
  setRowClassName = (row, index) => {
    if (this.state.selectedGroup) {
      return index + 1 === this.state.selectedGroup.idx ? "clickRowStyl" : "";
    } else {
      return "";
    }
  };

  getList = () => {
    httpPost(httpUrl.getRiderGroup, [], {}).then((res) => {
      if (res.result === "SUCCESS") {
        this.setState({
          list: res.data.riderSettingGroups,
        });
      }
    });
  };

  handleSubmit = () => {
    if (this.state.selectedGroup) {
      httpPost(httpUrl.updateRiderGroup, [], this.state.selectedGroup).then(
        (res) => {
          if (res.result === "SUCCESS") {
            Modal.info({
              title: "변경 성공",
              content: "기사그룹 설정 변경에 성공했습니다.",
            });
            this.getList();
          }
        }
      );
    } else {
      Modal.info({
        title: "변경 실패",
        content: "기사그룹 설정 변경에 실패했습니다.",
      });
      return;
    }
  };

  render() {
    const columns = [
      {
        title: "그룹명",
        dataIndex: "settingGroupName",
        className: "table-column-center",
        render: (data, row) => {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ selectedGroup: row })}
            >
              {data}
            </div>
          );
        },
      },
      {
        title: "처리건수",
        dataIndex: "amountPerOneTime",
        className: "table-column-center",
        render: (data, row) => {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ selectedGroup: row })}
            >
              {data}
            </div>
          );
        },
      },
      {
        title: "배달 수수료 형식",
        dataIndex: "deliveryPriceFeeType",
        className: "table-column-center",
        render: (data, row) => {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ selectedGroup: row })}
            >
              {deliveryPriceFeeType[data]}
            </div>
          );
        },
      },
      {
        title: "배달수수료",
        dataIndex: "deliveryPriceFeeType",
        className: "table-column-center",
        render: (data, row) => {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                this.setState({ selectedGroup: row }, () =>
                  console.log(this.state.selectedGroup)
                )
              }
            >
              {data === 0
                ? comma(row.deliveryPriceFeeAmount) + " %"
                : comma(row.deliveryPriceFeeAmount) + " 원"}
            </div>
          );
        },
      },
    ];

    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="riderGroup-Dialog">
          <div className="riderGroup-content">
            <div className="riderGroup-title">기사 그룹관리</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="riderGroup-close"
              alt="img"
            />
            <div className="riderGroup-inner">
              <Form ref={this.formRef} onFinish={this.handleIdSubmit}>
                <div className="listBlock">
                  <Table
                    dataSource={this.state.list}
                    columns={columns}
                    onChange={this.handleTableChange}
                    onRow={this.onClickRow}
                    rowClassName={(row, index) =>
                      this.setRowClassName(row, index)
                    }
                  />
                </div>

                <div className="riderGroup-ftline">
                  <div className="riderGroup-ftline-01">
                    <p>처리 건수</p>
                  </div>
                  <div className="inputBox inputBox-rider">
                    <FormItem name="amountPerOneTime">
                      <Input
                        onChange={(e) =>
                          this.handleSelectedGroupChange(
                            e.target.value,
                            "amountPerOneTime"
                          )
                        }
                        value={
                          this.state.selectedGroup
                            ? this.state.selectedGroup.amountPerOneTime
                            : 0
                        }
                      />
                    </FormItem>
                    <div className="riderGText">건 까지 처리 가능</div>
                  </div>
                  <div className="riderGroup-ftline-04">
                    <p>배달수수료</p>
                    <div className="inputBox inputBox-rider">
                      <FormItem name="deliveryPriceFeeType">
                        <Radio.Group
                          className="select-fee-pay-type"
                          onChange={(e) =>
                            this.handleSelectedGroupChange(
                              e.target.value,
                              "deliveryPriceFeeType"
                            )
                          }
                        >
                          <Radio style={{ fontSize: 18 }} value={0}>
                            정률
                          </Radio>
                          <Radio style={{ fontSize: 18 }} value={1}>
                            정액
                          </Radio>
                        </Radio.Group>
                      </FormItem>
                    </div>

                    <div className="inputBox inputBox-rider">
                      <FormItem
                        name="deliveryPriceFeeAmount"
                        rules={[
                          {
                            required: true,
                            message: "배달수수료를 입력해주세요.",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          value={this.state.deliveryPriceFeeAmount}
                          onChange={(e) =>
                            this.handleSelectedGroupChange(
                              e.target.value,
                              "deliveryPriceFeeAmount"
                            )
                          }
                        />
                      </FormItem>
                      <div className="riderGText">
                        {this.state.selectedGroup &&
                          (this.state.selectedGroup.deliveryPriceFeeType === 0
                            ? "%"
                            : "원")}
                        으로 설정
                      </div>
                    </div>
                  </div>

                  <div className="riderGroup-btn">
                    <div className="riderGroup-btn-01">
                      <Button
                        className="tabBtn riderGroup-btn"
                        onClick={() => this.handleSubmit()}
                      >
                        적용
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

export default RiderGroupDialog;
