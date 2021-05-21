import { Input, Table, Button, Radio, Modal } from 'antd';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpPost } from '../../api/httpClient';
import RiderGroupDialog from "../../components/dialog/rider/RiderGroupDialog";
import TaskSchedulerDialog from "../../components/dialog/rider/TaskSchedulerDialog";
import RegistRiderDialog from "../../components/dialog/rider/RegistRiderDialog";
import RiderCoinDialog from "../../components/dialog/rider/RiderCoinDialog";
import RiderBankDialog from "../../components/dialog/rider/RiderBankDialog";
import UpdatePasswordDialog from "../../components/dialog/rider/UpdatePasswordDialog";
import '../../css/modal.css'
import { comma } from "../../lib/util/numberUtil";
import SelectBox from '../../components/input/SelectBox';
import SearchRiderDialog from '../../components/dialog/common/SearchRiderDialog';
import { 
  statusString, 
  riderLevelText
} from '../../lib/util/codeUtil';

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
      // blackListOpen: false, // 블라인드
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      dialogData: [],
      userStatus: 1,
      searchRiderOpen: false,
    };
  }

  componentDidMount() {
    this.getList()
  }

  handleTableChange = (pagination) => {
    console.log(pagination)
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize
    this.setState({
      pagination: pager,
    }, () => this.getList());
  };

  getList = () => {
    let pageNum = this.state.pagination.current;
    let riderLevel = this.state.riderLevel;
    let userStatus = this.state.userStatus;
    let searchName = this.state.searchName;

    httpGet(httpUrl.riderList, [10, pageNum, riderLevel, searchName, userStatus], {}).then((result) => {
      console.log('## nnbox result=' + JSON.stringify(result, null, 4))
      const pagination = { ...this.state.pagination };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      this.setState({
        results: result.data.riders,
        pagination,
      });
    })
  };

  onChangeStatus = (index, value) => {
    let self = this;
    httpPost(httpUrl.updateRider, [], {
        idx: index,
        userStatus: value
    })
        .then((result) => {
            Modal.info(
                {title: "변경 완료", content: (<div>
                    상태가 변경되었습니다.
                </div>)}
            );
            self.getList();
        })
        .catch((error) => {
            Modal.error(
                {title: "변경 실패", content: (<div>
                    변경에 실패했습니다.
                </div>)}
            );
        });
  }

  onChange = e => {
    this.setState({
      userStatus: e.target.value,
    }, () => this.getList());
  };

  onSearchRider = (data) => {
    console.log("### get fran list data : " + data)
    this.setState({results: data});
  }

  // 기사조회 dialog
  openSearchRiderModal = () => {
    this.setState({searchRiderOpen: true});
  }
  closeSearchRiderModal = () => {
    this.setState({searchRiderOpen: false});
  }

  //일차감
  openTaskSchedulerModal = () => {
    this.setState({ taskSchedulerOpen: true });
  }
  closeTaskSchedulerModal = () => {
    this.setState({ taskSchedulerOpen: false });
  }

  //기사 그룹관리 
  openRiderGroupModal = () => {
    this.setState({ riderGroupOpen: true });
  }
  closeRiderGroupModal = () => {
    this.setState({ riderGroupOpen: false });
  }

  //기사 등록 
  openRegistRiderModal = () => {
    this.setState({ registRiderOpen: true });
  }
  closeRegistRiderModal = () => {
    this.setState({ registRiderOpen: false });
  }

  //기사 수정 
  closeUpdateRiderModal = () => {
    this.setState({ riderUpdateOpen: false });
  }

  //코인충전
  openRiderCoinModal = () => {
    this.setState({ riderCoinOpen: true });
  }
  closeRiderCoinModal = () => {
    this.setState({ riderCoinOpen: false });
  }

  //입출금내역
  openRiderBankModal = () => {
    this.setState({ riderBankOpen: true });
  }
  closeRiderBankModal = () => {
    this.setState({ riderBankOpen: false });
  }

  //출금비밀번호
  openUpdatePasswordModal = () => {
    this.setState({ updatePasswordOpen: true });
  }
  closeUpdatePasswordModal = () => {
    this.setState({ updatePasswordOpen: false });
  }

  //블라인드
  setBlackList = () => {
    alert("블라인드 처리 되었습니다.")
  }

  render() {
    const columns = [
      {
        title: "지사명",
        dataIndex: "id",
        className: "table-column-center",
      },
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
        render: (data) => <div>{riderLevelText[data]}</div>
      },
      {
        title: "기사그룹",
        dataIndex: "userGroup",
        className: "table-column-center",
        // render: (data) => <div>{data == "A" ? "A"
        //   : data == "B" ? "B"
        //     : data == "C" ? "C"
        //       : data == "D" ? "D" : "-"}</div>
        render: (data) => <div>{'A'}</div>
      },
      {
        title: "출금비밀번호",
        className: "table-column-center",
        render: () =>
          <div>
            <UpdatePasswordDialog isOpen={this.state.updatePasswordOpen} close={this.closeUpdatePasswordModal} />
            <Button
              className="tabBtn surchargeTab"
              onClick={this.openUpdatePasswordModal}
            >초기화</Button>
          </div>
      },
      {
        title: "블라인드",
        className: "table-column-center",
        render: () =>
          <div>
            {/* <BlackListDialog isOpen={this.state.blackListOpen} close={this.closeBlackListModal} /> */}
            <Button
              className="tabBtn surchargeTab"
              onClick={this.setBlackList}
            >블라인드</Button>
          </div>
      },
      {
        title: "충전",
        className: "table-column-center",
        render: () =>
          <div>
            <RiderCoinDialog isOpen={this.state.riderCoinOpen} close={this.closeRiderCoinModal} />
            <Button
              className="tabBtn surchargeTab"
              onClick={this.openRiderCoinModal}
            >코인충전</Button>
          </div>
      },
      {
        title: "출금내역",
        className: "table-column-center",
        render: () =>
          <div>
            <RiderBankDialog isOpen={this.state.riderBankOpen} close={this.closeRiderBankModal} />
            <Button
              className="tabBtn surchargeTab"
              onClick={this.openRiderBankModal}
            >내역보기</Button>
          </div>
      },
      {
        title: "상태",
        dataIndex: "userStatus",
        className: "table-column-center",
        render: (data, row) => <div>
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
      },
      {
        title: "수정",
        className: "table-column-center",
        render: (data, row) =>
          <div>
            <RegistRiderDialog isOpen={this.state.riderUpdateOpen} close={this.closeUpdateRiderModal} data={this.state.dialogData} />
            <Button
              className="tabBtn surchargeTab"
              onClick={() => this.setState({ riderUpdateOpen: true, dialogData: row })}
            >수정</Button>
          </div>
      },
    ];

    const expandedRowRender = (record) => {
      const dropColumns = [
        {
          title: "최소보유잔액",
          dataIndex: "minCashAmount",
          className: "table-column-center",
          // render: (data) => <div>{comma(data)}</div>
          render: (data) => <div>{1000}</div>
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
          render: (data) => <div>{comma(data)}</div>
        },
        {
          title: "메모",
          dataIndex: "memo",
          className: "table-column-center",
          render: (data) => <div>{'memo'}</div>
        },
        {
          title: "수수료",
          dataIndex: "deliveryPriceFeeAmount",
          className: "table-column-center",
          render: (data) => <div>{comma(data)}</div>
        },
        {
          title: "수수료방식",
          dataIndex: "feeManner",
          className: "table-column-center",
          render: (data) => <div>{data == 1 ? "정량" : "정률"}</div>
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
    }

    return (
      <div className="">
        <div className="selectLayout">
          <SearchRiderDialog
              callback={(data) => this.onSearchRider(data)}
              isOpen={this.state.searchRiderOpen}
              close={this.closeSearchRiderModal}/>
          <Button className="tabBtn searchTab" onClick={this.openSearchRiderModal}>기사조회</Button>
          <RegistRiderDialog isOpen={this.state.registRiderOpen} close={this.closeRegistRiderModal} />
          <Button className="riderManageBtn"
            onClick={this.openRegistRiderModal}
          >기사 등록</Button>

          <RiderGroupDialog isOpen={this.state.riderGroupOpen} close={this.closeRiderGroupModal} />
          <Button className="riderManageBtn"
            onClick={this.openRiderGroupModal}
          >기사 그룹 관리</Button>

          <TaskSchedulerDialog isOpen={this.state.taskSchedulerOpen} close={this.closeTaskSchedulerModal} />
          <Button className="riderManageBtn"
            onClick={this.openTaskSchedulerModal}
          >일차감</Button>


        </div>

        <div className="dataTableLayout">
          <Table
            rowKey={(record) => record}
            dataSource={this.state.results}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
            expandedRowRender={expandedRowRender}
          />
        </div>
      </div>
    )
  }
}

export default RiderMain;