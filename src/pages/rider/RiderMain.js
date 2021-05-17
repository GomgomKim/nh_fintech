import { Form, DatePicker, Input, Table, Button, Descriptions, Radio, Select } from 'antd';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import RiderGroupDialog from "../../components/dialog/rider/RiderGroupDialog";
import TaskSchedulerDialog from "../../components/dialog/rider/TaskSchedulerDialog";
import RegistRiderDialog from "../../components/dialog/rider/RegistRiderDialog";
import RiderCoinDialog from "../../components/dialog/rider/RiderCoinDialog";
import RiderBankDialog from "../../components/dialog/rider/RiderBankDialog";
import UpdatePasswordDialog from "../../components/dialog/rider/UpdatePasswordDialog";
import '../../css/modal.css'
import BlackRiderDialog from "../../components/dialog/rider/BlackRiderDialog";
import BlackListDialog from "../../components/dialog/rider/BlackListDialog";
import { comma } from "../../lib/util/numberUtil";
import UpdateRiderDialog from '../../components/dialog/rider/UpdateRiderDialog';

const FormItem = Form.Item;
const Ditems = Descriptions.Item;
const Option = Select.Option;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

const riderLevelText = ["none", "라이더", "부팀장", "팀장", "부본부장", "본부장", "부지점장", "지점장", "부센터장", "센터장"];

class RiderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riderStatus: 1,
      riderLevel: [1],
      userData: 1,
      riderName: "",
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

  onSearchRider = (value) => {
    this.setState({
      riderName: value,
    }, () => {
      this.getList()
    })
  }

  onChange = e => {
    // console.log('radio checked', e.target.value);
    this.setState({
      riderStatus: e.target.value,
    }, () => this.getList());
  };

  getList = () => {
    let pageNum = this.state.pagination.current;
    let riderLevel = this.state.riderLevel;
    let userData = this.state.userData;
    let riderName = this.state.riderName;

    httpGet(httpUrl.riderList, [10, pageNum, riderLevel, riderName, userData], {}).then((result) => {
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

  modifyHandleChange = (value) => {
    httpPost(httpUrl.updateRider, [], {
      riderStatus: value
    }).then((result) => {
      alert(JSON.stringify(result))
    });
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
    this.setState({ registRiderOpen: true});
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
  /* openBlackListModal = () => {
    this.setState({ blackListOpen: true });
  }
  closeBlackListModal = () => {
    this.setState({ blackListOpen: false });
  } */

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
        dataIndex: "riderStatus",
        className: "table-column-center",
        render:
          (data, row) => (
            <div>
              <Select onChange={
                value => { this.modifyHandleChange(value); }}
                defaultValue={data} style={{ width: 68 }}>
                <Option value={3}>탈퇴</Option>
                <Option value={2}>중지</Option>
                <Option value={1}>사용</Option>
              </Select>
            </div>
          ),
      },
      {
        title: "수정",
        className: "table-column-center",
        render: (data, row) =>
          <div>
            <RegistRiderDialog isOpen={this.state.riderUpdateOpen} close={this.closeUpdateRiderModal} data={this.state.dialogData} />
            <Button
              className="tabBtn surchargeTab"
              onClick={()=>this.setState({riderUpdateOpen: true, dialogData: row})}
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
          <span className="searchRequirementText">검색조건</span><br></br>
          <Radio.Group className="searchRequirement" onChange={this.onChange} value={this.state.riderStatus}>
            <Radio value={1}>사용</Radio>
            <Radio value={2}>중지</Radio>
            <Radio value={3}>탈퇴</Radio>
          </Radio.Group>

          <Search placeholder="기사명"
            onSearch={this.onSearchRider}
            enterButton
            style={{
              width: 200,
              marginLeft: 20,
              verticalAlign: 'bottom'
            }} />

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