import { Input, Table, Button, Modal, DatePicker } from "antd";
import React, { Component } from "react";
import { httpGet, httpUrl, httpPost } from "../../api/httpClient";
import RiderGroupDialog from "../../components/dialog/rider/RiderGroupDialog";
import SendSnsDialog from "../../components/dialog/rider/SendSnsDialog";
import TaskSchedulerDialog from "../../components/dialog/rider/TaskSchedulerDialog";
import RegistRiderDialog from "../../components/dialog/rider/RegistRiderDialog";
import RiderCoinDialog from "../../components/dialog/rider/RiderCoinDialog";
import RiderBankDialog from "../../components/dialog/rider/RiderBankDialog";
import BlindRiderListDialog from "../../components/dialog/rider/BlindRiderListDialog";
import UpdatePasswordDialog from "../../components/dialog/rider/UpdatePasswordDialog";
import "../../css/modal.css";
import { comma } from "../../lib/util/numberUtil";
import SelectBox from "../../components/input/SelectBox";
import SearchRiderDialog from "../../components/dialog/common/SearchRiderDialog";
import {
  tableStatusString,
  statusString,
  riderLevelText,
  riderGroupString,
  feeManner,
} from "../../lib/util/codeUtil";
import { formatDate } from "../../lib/util/dateUtil";
import moment from "moment";

const Search = Input.Search;
const dateFormat = "YYYY/MM/DD";
const today = new Date();

class RiderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riderLevel: [1],
      userData: 1,
      searchName: "",
      sendSnsOpen: false, //sns전송
      taskSchedulerOpen: false, // 일차감
      riderGroupOpen: false, // 기사 그룹 관리
      registRiderOpen: false, // 기사등록
      riderCoinOpen: false, // 기사코인충전
      riderBankOpen: false, //기사 입출금내역
      workTabOpen: false, // 작업
      riderUpdateOpen: false, // 기사 수정
      updatePasswordOpen: false, // 출금 비밀번호
      blindListOpen: false, // 블라인드
      blindRiderData: [], //블라인드 정보
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      dialogData: [],
      userStatus: 0,
      searchRiderOpen: false,
      selRider: "",
    };
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

  getList = () => {
    let pageNum = this.state.pagination.current;
    // let riderLevel = this.state.riderLevel;
    let userStatus = this.state.userStatus === 0 ? "" : this.state.userStatus;
    let searchName = this.state.searchName;

    httpGet(httpUrl.riderList, [10, pageNum, searchName, userStatus], {}).then(
      (result) => {
        console.log("## nnbox result=" + JSON.stringify(result, null, 4));
        const pagination = { ...this.state.pagination };
        pagination.current = result.data.currentPage;
        pagination.total = result.data.totalCount;
        this.setState({
          results: result.data.riders,
          pagination,
        });
      }
    );
  };

  onChangeStatus = (index, value) => {
    let self = this;
    httpPost(httpUrl.updateRider, [], {
      idx: index,
      userStatus: value,
    })
      .then((result) => {
        Modal.info({
          title: "변경 완료",
          content: <div>상태가 변경되었습니다.</div>,
        });
        self.getList();
      })
      .catch((error) => {
        Modal.error({
          title: "변경 실패",
          content: <div>변경에 실패했습니다.</div>,
        });
      });
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

  onChange = (e) => {
    this.setState(
      {
        userStatus: e.target.value,
      },
      () => this.getList()
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

  // sns dialog
  openSendSnsModal = () => {
    this.setState({ sendSnsOpen: true });
  };
  closeSendSnsModal = () => {
    this.setState({ sendSnsOpen: false });
  };
  //일차감
  openTaskSchedulerModal = () => {
    this.setState({ taskSchedulerOpen: true });
  };
  closeTaskSchedulerModal = () => {
    this.setState({ taskSchedulerOpen: false });
  };

  //기사 그룹관리
  openRiderGroupModal = () => {
    this.setState({ riderGroupOpen: true });
  };
  closeRiderGroupModal = () => {
    this.setState({ riderGroupOpen: false });
  };

  //기사 등록
  openRegistRiderModal = () => {
    this.setState({ registRiderOpen: true });
  };
  closeRegistRiderModal = () => {
    this.setState({ registRiderOpen: false });
    this.getList();
  };

  //기사 수정
  closeUpdateRiderModal = () => {
    this.setState({ riderUpdateOpen: false });
    this.getList();
  };

  // 블라인드 dialog
  openBlindModal = () => {
    this.setState({ blindListOpen: true });
  };
  closeBlindModal = () => {
    this.setState({ blindListOpen: false });
  };

  //코인충전
  openRiderCoinModal = () => {
    this.setState({ riderCoinOpen: true });
  };
  closeRiderCoinModal = () => {
    this.setState({ riderCoinOpen: false });
  };

  //입출금내역
  openRiderBankModal = () => {
    this.setState({ riderBankOpen: true });
  };
  closeRiderBankModal = () => {
    this.setState({ riderBankOpen: false });
  };

  //출금비밀번호
  openUpdatePasswordModal = (rider) => {
    this.setState({ 
      updatePasswordOpen: true,
      selRider: rider,
     });
  };
  closeUpdatePasswordModal = () => {
    this.setState({ updatePasswordOpen: false });
  };

  //블라인드
  setBlackList = () => {
    alert("블라인드 처리 되었습니다.");
  };

  render() {
    const columns = [
      // {
      //   title: "지사명",
      //   dataIndex: "id",
      //   className: "table-column-center",
      // },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center",
      },
      {
        title: "아이디",
        dataIndex: "id",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "직급",
        dataIndex: "riderLevel",
        className: "table-column-center",
        width: "200px",
        render: (data) => <div>{riderLevelText[data]}</div>,
      },
      {
        title: "기사그룹",
        dataIndex: "userGroup",
        className: "table-column-center",
        render: (data) => <div>{riderGroupString[data]}</div>,
      },
      {
        title: "출금비밀번호",
        className: "table-column-center",
        render: (data, row) => (
          <div>

            <Button
              className="tabBtn surchargeTab"
              onClick={() => this.openUpdatePasswordModal(row)}
            >
              초기화
            </Button>
          </div>
        ),
      },
      {
        title: "블라인드",
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() =>
                this.setState({ blindRiderData: row, blindListOpen: true })
              }
            >
              블라인드
            </Button>
          </div>
        ),
      },
      {
        title: "입사일",
        // dataIndex: "wdawdDate",
        className: "table-column-center",
        render: (data) => <div>{formatDate("2021-03-21 12:00")}</div>,
        // render: (data, row) => <div>
        //   <DatePicker
        //     defaultValue={moment(today, dateFormat)}
        //     format={dateFormat}
        //     onChange={date => this.setState({ selected: date })} />
        // </div>
      },
      {
        title: "퇴사일",
        // dataIndex: "wdawdDate",
        className: "table-column-center",
        render: (data) => <div>{formatDate("2021-04-29 11:00:21")}</div>,
        // render: (data, row) => <div>
        //   <DatePicker
        //     defaultValue={moment(today, dateFormat)}
        //     format={dateFormat}
        //     onChange={date => this.setState({ selected: date })} />
        // </div>
      },
      {
        title: "상태",
        dataIndex: "userStatus",
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <SelectBox
              value={statusString[data]}
              code={Object.keys(statusString)}
              codeString={statusString}
              onChange={(value) => {
                if (parseInt(value) !== row.userStatus) {
                  this.onChangeStatus(row.idx, value);
                }
              }}
            />
          </div>
        ),
      },
      {
        title: "수정",
        className: "table-column-center",
        render: (data, row) => (
          <div>
            {/* {this.state.riderUpdateOpen &&
            <RegistRiderDialog close={this.closeUpdateRiderModal} data={this.state.dialogData} />} */}
            <Button
              className="tabBtn surchargeTab"
              onClick={() =>
                this.setState({ riderUpdateOpen: true, dialogData: row })
              }
            >
              수정
            </Button>
          </div>
        ),
      },
    ];

    const expandedRowRender = (record) => {
      const dropColumns = [
        {
          title: "최소보유잔액",
          dataIndex: "minCashAmount",
          className: "table-column-center",
          render: (data) => <div>{1000}</div>,
        },
        {
          title: "전화번호",
          dataIndex: "phone",
          className: "table-column-center",
        },
        {
          title: "잔액",
          dataIndex: "ncash",
          className: "table-column-center",
          render: (data) => <div>{comma(data)}</div>,
        },
        {
          title: "메모",
          dataIndex: "memo",
          className: "table-column-center",
          render: (data) => <div>{data}</div>,
        },
        {
          title: "수수료",
          dataIndex: "deliveryPriceFeeAmount",
          className: "table-column-center",
          render: (data) => <div>{comma(data)}</div>,
        },
        {
          title: "수수료방식",
          dataIndex: "deliveryPriceFeeType",
          className: "table-column-center",
          // render: (data) => <div>{data === 1 ? "정량" : "정률"}</div>
          render: (data) => <div>{feeManner[data]}</div>,
        },
        {
          title: "은행명",
          dataIndex: "bank",
          className: "table-column-center",
        },
        {
          title: "예금주",
          dataIndex: "riderName",
          className: "table-column-center",
        },
        {
          title: "계좌번호",
          dataIndex: "bankAccount",
          className: "table-column-center",
        },
      ];
      return (
        <Table
          rowKey={(record) => `record: ${record.idx}`}
          columns={dropColumns}
          dataSource={[record]}
          pagination={false}
        />
      );
    };

    return (
      <div className="">
        <div className="selectLayout">
          <span className="searchRequirementText">검색조건</span>
          <br />
          <br />

          <SelectBox
            value={tableStatusString[this.state.userStatus]}
            code={Object.keys(tableStatusString)}
            codeString={tableStatusString}
            onChange={(value) => {
              if (parseInt(value) !== this.state.userStatus) {
                this.setState({ userStatus: parseInt(value) }, () =>
                  this.getList()
                );
              }
            }}
          />

          <Search
            placeholder="기사검색"
            className="searchFranchiseInput"
            enterButton
            allowClear
            onSearch={this.onSearchRider}
            style={{}}
          />

          {this.state.searchRiderOpen && (
            <SearchRiderDialog
              callback={(data) => this.onSearchRiderDetail(data)}
              close={this.closeSearchRiderModal}
              multi={true}
            />
          )}
          <Button className="tabBtn" onClick={this.openSearchRiderModal}>
            기사조회
          </Button>
          {this.state.registRiderOpen && (
            <RegistRiderDialog
              close={this.closeRegistRiderModal}
            />
          )}
          <Button
            className="riderManageBtn"
            onClick={this.openRegistRiderModal}
          >
            기사 등록
          </Button>

          {this.state.riderGroupOpen && (
            <RiderGroupDialog close={this.closeRiderGroupModal} />
          )}
          <Button className="riderManageBtn" onClick={this.openRiderGroupModal}>
            기사 그룹 관리
          </Button>
          {this.state.taskSchedulerOpen && (
            <TaskSchedulerDialog close={this.closeTaskSchedulerModal} />
          )}
          <Button
            className="riderManageBtn"
            onClick={this.openTaskSchedulerModal}
          >
            일차감
          </Button>

          {this.state.sendSnsOpen && (
            <SendSnsDialog
              close={this.closeSendSnsModal}
              callback={this.onSearchRiderDetail}
            />
          )}
          <Button className="riderManageBtn" onClick={this.openSendSnsModal}>
            SNS 전송
          </Button>

          {this.state.blindListOpen &&
          <BlindRiderListDialog
            close={this.closeBlindModal}
            data={this.state.blindRiderData}
          />}
        </div>

        <div className="dataTableLayout">
          <Table
            rowKey={(record) => record.idx}
            dataSource={this.state.results}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
            expandedRowRender={expandedRowRender}
          />
        </div>
        {this.state.riderUpdateOpen && (
        <RegistRiderDialog
            close={this.closeUpdateRiderModal}
            data={this.state.dialogData}
            />
            )}
            {this.state.updatePasswordOpen &&
            <UpdatePasswordDialog
              rider={this.state.selRider}
              close={this.closeUpdatePasswordModal}
            />}
      </div>
    );
  }
}

export default RiderMain;
