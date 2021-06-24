import { Modal, Table } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { httpGet, httpPost, httpUrl } from "../../api/httpClient";
import SelectBox from "../../components/input/SelectBox";
import "../../css/common.css";
import "../../css/staff.css";
import { buyStatusString } from "../../lib/util/codeUtil";
import { formatDate } from "../../lib/util/dateUtil";
import { comma } from "../../lib/util/numberUtil";
const today = new Date();

class MallMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      buyStatus: 1,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 20,
      },
    };
  }

  componentDidMount() {
    this.getList();
  }

  onChange = (e) => {
    this.setState(
      {
        buyStatus: e.target.value,
      },
      () => this.getList()
    );
  };

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

  onChangeStatus = (index, value) => {
    let self = this;
    if (parseInt(value) === 1) {
      Modal.confirm({
        title: "상태 변경",
        content: "상태를 수정하시겠습니까?",
        okText: "확인",
        cancelText: "취소",
        onOk() {
          httpPost(httpUrl.updateBuy, [], {
            idx: index,
            buyStatus: value
          })
            .then((res) => {
              if(res.result === "SUCCESS" && res.data === "SUCCESS"){
                Modal.info({
                  title: "변경 완료",
                  content: <div>상태가 변경되었습니다.</div>,
                });
                self.getList();
              }
              else {
                Modal.info({
                  title: "변경 오류",
                  content: "오류가 발생하였습니다. 다시 시도해 주십시오.",
                });
              }
            })
            .catch((error) => {
              Modal.info({
                title: "변경 오류",
                content: "오류가 발생하였습니다. 다시 시도해 주십시오.",
              });
            });
        },
      });
    } else if (parseInt(value) === 2) {
      Modal.confirm({
        title: "상태 변경",
        content: "상태를 수정하시겠습니까?",
        okText: "확인",
        cancelText: "취소",
        onOk() {
          httpPost(httpUrl.updateBuy, [], {
            idx: index,
            buyStatus: value,
            pickupDate: moment(today).format("YYYY-MM-DD hh:mm:ss"),
          })
            .then((res) => {
              if(res.result === "SUCCESS" && res.data === "SUCCESS"){
                Modal.info({
                  title: "변경 완료",
                  content: <div>상태가 변경되었습니다.</div>,
                });
                self.getList();
              } else {
                  Modal.info({
                    title: "변경 오류",
                    content: "오류가 발생하였습니다. 다시 시도해 주십시오.",
                  });
                }
              })
            .catch((error) => {
              Modal.info({
                title: "변경 오류",
                content: "오류가 발생하였습니다. 다시 시도해 주십시오.",
              });
            });
        },
      });
    }
  };

  getList = () => {
    let pageSize = this.state.pagination.pageSize;
    let pageNum = this.state.pagination.current;
    httpGet(httpUrl.buyList, [pageNum, pageSize], {}).then((result) => {
      console.log("## nnbox result=" + JSON.stringify(result, null, 4));
      const pagination = { ...this.state.pagination };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      this.setState({
        list: result.data.mallBuys,
        // pagination,
      });
    });
  };

  closeStaffRegistrationModal = () => {
    this.setState({ registStaff: false });
  };

  render() {
    const columns = [
      {
        title: "순번",
        dataIndex: "idx",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "이름",
        dataIndex: "riderName",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "구매상품",
        dataIndex: "productName",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "카테고리",
        dataIndex: "category",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "금액",
        dataIndex: "price",
        className: "table-column-center",
        width: "200px",
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: "메모",
        dataIndex: "memo",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "수령날짜",
        dataIndex: "pickupDate",
        className: "table-column-center",
        width: "200px",
        render: (data, row) => (
          <div>{row.buyStatus === 1 ? "" : formatDate(data)}</div>
        ),
      },
      {
        title: "상태",
        dataIndex: "buyStatus",
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <SelectBox
              className="buyList-select"
              placeholder={"상태"}
              value={buyStatusString[data]}
              code={Object.keys(buyStatusString)}
              codeString={buyStatusString}
              onChange={(value) => {
                if (parseInt(value) !== row.buyStatus) {
                  this.onChangeStatus(row.idx, value);
                }
              }}
            />
          </div>
        ),
      },
    ];
    return (
      <div className="">
        {/* <div className="selectLayout"/> */}
        <div className="dataTableLayout">
          <Table
            dataSource={this.state.list}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

export default MallMain;
