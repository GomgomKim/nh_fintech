import { Button, Image, Input, Modal, Popover, Table } from "antd";
import React, { Component } from "react";
import { httpGet, httpPost, httpUrl, imageUrl } from "../../api/httpClient";
import { customAlert, updateError } from "../../api/Modals";
import BlindRiderListDialog from "../../components/dialog/rider/BlindRiderListDialog";
import RegistRiderDialog from "../../components/dialog/rider/RegistRiderDialog";
import RiderGroupDialog from "../../components/dialog/rider/RiderGroupDialog";
import BatchWorkListDialog from "../../components/dialog/rider/BatchWorkListDialog";
import UpdatePasswordDialog from "../../components/dialog/rider/UpdatePasswordDialog";
import SelectBox from "../../components/input/SelectBox";
import "../../css/modal.css";
import {
  riderLevelText,
  statusString,
  tableStatusString,
  riderStatusCode,
} from "../../lib/util/codeUtil";
import { formatDateToDay } from "../../lib/util/dateUtil";
import { comma } from "../../lib/util/numberUtil";

const Search = Input.Search;

class RiderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riderLevel: [1],
      userData: 1,
      searchName: "",
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
        pageSize: 100,
      },
      dialogData: [],
      userStatus: 0,
      selRider: "",
      withdrawPassword: 1111,
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

    httpGet(
      httpUrl.riderList,
      [
        this.state.pagination.pageSize,
        pageNum,
        searchName,
        userStatus,
        [1, 2, 3, 4, 5, 6, 7],
      ],
      {}
    ).then((result) => {
      console.log(result, null, 4);
      const pagination = { ...this.state.pagination };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      this.setState({
        results: result.data.riders,
        pagination,
      });
    });
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
        pagination: {
          current: 1,
          pageSize: this.state.pagination.pageSize,
        },
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

  onResetPW = (row) => {
    let self = this;
    Modal.confirm({
      title: <div> {"비밀번호 초기화"} </div>,
      content: <div> {"비밀번호를 초기화하시겠습니까?"} </div>,
      okText: "확인",
      cancelText: "취소",
      onOk() {
        httpPost(httpUrl.updateRider, [], {
          idx: row.idx,
          withdrawPassword: null,
        })
          .then((result) => {
            console.log(row);
            if (result.result === "SUCCESS" && result.data === "SUCCESS") {
              customAlert("완료", "출금비밀번호가 초기화되었습니다.");
            } else if (result.data === "NOT_ADMIN") updateError();
            else updateError();
            self.getList();
          })
          .catch((error) => {
            updateError();
          });
      },
    });
  };

  onSearchRiderDetail = (data) => {
    console.log("### get fran list data : " + data);
    // this.setState({ results: data });
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
    this.getList();
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
        className: "table-column-center desk",
      },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center mobile",
        render: (data, row) => (
          <div>
            {row.riderName} {row.id}
          </div>
        ),
      },
      {
        title: "아이디",
        dataIndex: "id",
        className: "table-column-center desk",
        width: "200px",
      },
      {
        title: "직급",
        dataIndex: "riderLevel",
        className: "table-column-center",
        width: "200px",
        render: (data) => <div>{riderLevelText[data]}</div>,
      },
      // {
      //   title: "기사그룹",
      //   dataIndex: "riderSettingGroup",
      //   className: "table-column-center",
      //   render: (data) => <div>{data.settingGroupName}</div>,
      // },
      {
        title: "면허정보",
        dataIndex: "driverLicenseNumber",
        className: "table-column-center",
        render: (data, row) => {
          // 면허정보 컬럼 확정후 확인 필요
          const content = (
            <div>
              <Image
                src={imageUrl(row.driverLicenseFileIdx)}
                style={{ width: 400, height: 300 }}
                alt="면허증 사진"
              />
            </div>
          );
          return (
            <Popover content={content} title="면허증 사진">
              <div>{data}</div>
            </Popover>
          );
        },
      },
      {
        title: "출금비밀번호",
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => this.onResetPW(row)}
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
        dataIndex: "createDate",
        className: "table-column-center",
        render: (data) => <div>{formatDateToDay(data)}</div>,
        // render: (data, row) => <div>
        //   <DatePicker
        //     defaultValue={moment(today, dateFormat)}
        //     format={dateFormat}
        //     onChange={date => this.setState({ selected: date })} />
        // </div>
      },
      {
        title: "퇴사일",
        dataIndex: "deleteDate",
        className: "table-column-center",
        render: (data) => <div>{formatDateToDay(data)}</div>,
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
                this.setState(
                  { riderUpdateOpen: true, dialogData: row },
                  () => {
                    console.log(row);
                  }
                )
              }
            >
              수정
            </Button>
          </div>
        ),
      },
      {
        title: "출근상태",
        dataIndex: "riderStatus",
        className: "table-column-center",
        width: "200px",
        render: (data) => <div>{riderStatusCode[data]}</div>,
      },
    ];

    const expandedRowRender = (record) => {
      const dropColumns = [
        // 컬럼 확인 필요
        {
          title: "최소보유잔액",
          dataIndex: "ncashMin",
          className: "table-column-center",
          render: (data) => <div>{data}</div>,
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
          title: "기사그룹",
          dataIndex: "riderSettingGroup",
          className: "table-column-center",
          render: (data) => <div>{data.settingGroupName}</div>,
        },

        {
          title: "수수료방식",
          dataIndex: "riderSettingGroup",
          className: "table-column-center",
          render: (data) => (
            <div>{data.deliveryPriceFeeType === 1 ? "정량" : "정율"}</div>
          ),
        },
        {
          title: "수수료",
          dataIndex: "riderSettingGroup",
          className: "table-column-center",
          render: (data) => (
            <div>
              {data.deliveryPriceFeeType === 1
                ? data.deliveryPriceFeeAmount + "원"
                : data.deliveryPriceFeeAmount + "%"}
            </div>
          ),
        },
        {
          title: "은행명",
          dataIndex: "bank",
          className: "table-column-center",
          render: (data) => <div>{data.split(",")[0]}</div>,
        },
        {
          title: "계좌번호",
          dataIndex: "bankAccount",
          className: "table-column-center",
        },
        {
          title: "예금주",
          dataIndex: "riderName",
          className: "table-column-center",
        },
        {
          title: "출금등록",
          dataIndex: "walletId",
          className: "table-column-center",
          render: (data, row) => (
            <div>
              {data ? (
                "완료"
              ) : (
                <Button
                  onClick={() => {
                    httpPost(httpUrl.createUserWallet, [row.idx], {})
                      .then((response) => {
                        console.log(response);
                        if (response.data.resultCd == "0000") {
                          this.getList();
                        } else {
                          alert(response.data.advanceMsg);
                        }
                      })
                      .catch((e) => {});
                  }}
                >
                  등록하기
                </Button>
              )}
            </div>
          ),
        },
      ];
      return (
        <Table
          className="desk"
          rowKey={(record) => `record: ${record.idx}`}
          columns={dropColumns}
          dataSource={[record]}
          pagination={false}
        />
      );
      return (
        <Table
          className="mobile"
          rowKey={(record) => `record: ${record.idx}`}
          dataSource={[record]}
          pagination={false}
        />
      );
    };

    return (
      <div className="">
        <Search
          placeholder="기사검색"
          className="searchRiderInput"
          enterButton
          allowClear
          onSearch={this.onSearchRider}
          style={{}}
        />
        <div className="selectLayout desk">
          <span className="searchRequirementText">검색조건</span>
          <br />
          <br />

          <SelectBox
            value={tableStatusString[this.state.userStatus]}
            code={Object.keys(tableStatusString)}
            codeString={tableStatusString}
            onChange={(value) => {
              if (parseInt(value) !== this.state.userStatus) {
                this.setState(
                  {
                    userStatus: parseInt(value),
                    pagination: {
                      current: 1,
                      pageSize: this.state.pagination.pageSize,
                    },
                  },
                  () => this.getList()
                );
              }
            }}
          />

          <Search
            placeholder="기사검색"
            className="searchRiderInput"
            enterButton
            allowClear
            onSearch={this.onSearchRider}
            style={{}}
          />
          {this.state.registRiderOpen && (
            <RegistRiderDialog close={this.closeRegistRiderModal} />
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
            <BatchWorkListDialog close={this.closeTaskSchedulerModal} />
          )}
          <Button
            className="riderManageBtn"
            onClick={this.openTaskSchedulerModal}
          >
            일차감
          </Button>

          {this.state.blindListOpen && (
            <BlindRiderListDialog
              close={this.closeBlindModal}
              data={this.state.blindRiderData}
            />
          )}
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
        {this.state.updatePasswordOpen && (
          <UpdatePasswordDialog
            rider={this.state.selRider}
            close={this.closeUpdatePasswordModal}
          />
        )}
      </div>
    );
  }
}

export default RiderMain;
