import { Button, Form, Input, Radio, Table } from "antd";
import React, { Component } from "react";
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
      deliveryPriceFeeType: 0,
      rowId: 1,

      normalMaxCall: 0,
      peakMaxCall: 0,
      deliveryPriceFeeAmount: 0,
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

  onClickRow = (index) => {
    if (this.state.list.find((x) => x.id === this.state.rowId.id)) {
      // console.log(this.state.list.find((x) => x.id === this.state.rowId.id).proCount)
      const data = this.state.list.find((x) => x.id === this.state.rowId.id);
      if (data !== null) {
        this.formRef.current.setFieldsValue({
          assignCnt: data.proCount,
          riderFee: data.riderFee,
          deliveryPriceFeeType: data.deliveryPriceFeeType,
          withdraw: data.withdrawLimit,
          transferLimit: data.transferLimit,
        });
        // @todo ????
        // this.setState({payType: data.payType});
      }
    }
    return {
      onClick: () => {
        this.setState({
          rowId: index,
        });
      },
    };
  };
  setRowClassName = (index) => {
    return index === this.state.rowId ? "clickRowStyl" : "";
  };

  getList = () => {
    var list = [
      {
        // className={ "mypage-left-select " + (depth1.idx == row.idx ? 'active' : '') },
        id: 1,
        riderGroup: "A",
        proCount: 6,
        riderFee: "100",
        deliveryPriceFeeType: 0,
        deliveryPriceFeeAmount: 10,
        withdrawLimit: "100000",
        transferLimit: "500",
      },
      {
        id: 2,
        riderGroup: "B",
        proCount: 5,
        riderFee: "200",
        deliveryPriceFeeType: 1,
        deliveryPriceFeeAmount: 1000,
        withdrawLimit: "10000",
        transferLimit: "1500",
      },
      {
        id: 3,
        riderGroup: "C",
        proCount: 4,
        riderFee: "300",
        deliveryPriceFeeType: 0,
        deliveryPriceFeeAmount: 10,
        withdrawLimit: "200000",
        transferLimit: "1000",
      },
      {
        id: 4,
        riderGroup: "D",
        proCount: 3,
        riderFee: "400",
        deliveryPriceFeeType: 1,
        deliveryPriceFeeAmount: 2000,
        withdrawLimit: "40000",
        transferLimit: "500",
      },
      {
        id: 5,
        riderGroup: "E",
        proCount: 2,
        riderFee: "500",
        deliveryPriceFeeType: 0,
        deliveryPriceFeeAmount: 8,
        withdrawLimit: "100000",
        transferLimit: "500",
      },
    ];
    this.setState({
      list: list,
    });
  };

  handleSubmit = () => {
    console.log(this.state);
  };

  render() {
    const columns = [
      {
        title: "그룹명",
        dataIndex: "riderGroup",
        className: "table-column-center",
      },
      {
        title: "처리건수",
        dataIndex: "proCount",
        className: "table-column-center",
      },
      {
        title: "배달 수수료 형식",
        dataIndex: "deliveryPriceFeeType",
        className: "table-column-center",
        render: (data) => <div>{deliveryPriceFeeType[data]}</div>,
      },
      {
        title: "배달수수료",
        dataIndex: "deliveryPriceFeeType",
        className: "table-column-center",
        render: (data, row) => (
          <div>
            {data === 0
              ? comma(row.deliveryPriceFeeAmount) + " %"
              : comma(row.deliveryPriceFeeAmount) + " 원"}
          </div>
        ),
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
                    // pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                    onRow={this.onClickRow}
                    rowClassName={this.setRowClassName}
                  />
                </div>

                <div className="riderGroup-ftline">
                  <div className="riderGroup-ftline-01">
                    <p>처리 건수</p>
                  </div>
                  <div className="inputBox inputBox-rider">
                    <div className="riderGText">일반 최대</div>
                    <FormItem name="normalMaxCall">
                      <Input
                        type="number"
                        onChange={(e) =>
                          this.setState({
                            normalMaxCall: parseInt(e.target.value),
                          })
                        }
                        value={this.state.normalMaxCall}
                      />
                    </FormItem>
                    <div className="riderGText">피크타임 최대</div>
                    <FormItem name="peakMaxCall">
                      <Input
                        type="number"
                        onChange={(e) =>
                          this.setState({
                            peakMaxCall: parseInt(e.target.value),
                          })
                        }
                        value={this.state.peakMaxCall}
                      />
                    </FormItem>
                  </div>
                  <div className="riderGroup-ftline-04">
                    <p>배달수수료</p>
                    <Radio.Group
                      className="select-fee-pay-type"
                      defaultValue={this.state.deliveryPriceFeeType}
                      onChange={(e) =>
                        this.setState({ deliveryPriceFeeType: e.target.value })
                      }
                    >
                      <Radio style={{ fontSize: 18 }} value={0}>
                        정률
                      </Radio>
                      <Radio style={{ fontSize: 18 }} value={1}>
                        정액&nbsp;&nbsp;&nbsp;
                      </Radio>
                    </Radio.Group>

                    <div className="inputBox inputBox-rider">
                      <FormItem
                        name="deliveryPriceFeeAmount"
                        rules={[{ required: true, message: "0건." }]}
                      >
                        <Input
                          value={this.state.deliveryPriceFeeAmount}
                          onChange={(e) =>
                            this.setState({
                              deliveryPriceFeeAmount: parseInt(e.target.value),
                            })
                          }
                        />
                      </FormItem>
                      <div className="riderGText">
                        {this.state.deliveryPriceFeeType === 0 ? "%" : "원"}{" "}
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
