import { Form, DatePicker, Input, Table, Button, Descriptions, Radio, Select } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import RiderGroupDialog from "../../components/dialog/rider/RiderGroupDialog";
import TaskSchedulerDialog from "../../components/dialog/rider/TaskSchedulerDialog";
import RegistRiderDialog from "../../components/dialog/rider/RegistRiderDialog";
import RiderCoinDialog from "../../components/dialog/rider/RiderCoinDialog";
import RiderBankDialog from "../../components/dialog/rider/RiderBankDialog";

import '../../css/modal.css'
import BlackRiderDialog from "../../components/dialog/rider/BlackRiderDialog";
import BlackListDialog from "../../components/dialog/rider/BlackListDialog";
import { formatDate } from "../../lib/util/dateUtil";
import { comma } from "../../lib/util/numberUtil";

const FormItem = Form.Item;
const Ditems = Descriptions.Item;
const Option = Select.Option;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class RiderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riderStatus: 1,
      riderLevel: [1],
      userData: 1,
      riderName: "",
      taskSchedulerOpen: false, // 작업 스케줄러
      riderGroupOpen: false, // 기사 그룹 관리
      registRiderOpen: false, // 기사등록
      blackRiderOpen: false, //기사차단
      blackListOpen: false, // 기사차단등록
      riderCoinOpen: false, // 기사코인충전
      riderBankOpen: false, //기사 입출금내역
      workTabOpen: false, // 작업
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
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

    httpGet(httpUrl.riderList, [10, pageNum, riderLevel, userData], {}).then((result) => {
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
  //작업 스케줄러
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

  //기사 차단
  openBlackRiderModal = () => {
    this.setState({ blackRiderOpen: true });
  }
  closeBlackRiderModal = () => {
    this.setState({ blackRiderOpen: false });
  }

  //기사 차단목록
  openBlackListModal = () => {
    this.setState({ blackListOpen: true });
  }
  closeBlackListModal = () => {
    this.setState({ blackListOpen: false });
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
        title: "이메일",
        dataIndex: "email",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "기사그룹",
        dataIndex: "userGroup",
        className: "table-column-center",
        render: (data) => <div>{data == "A" ? "A"
          : data == "B" ? "B"
            : data == "C" ? "C"
              : data == "D" ? "D" : "-"}</div>
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
      },
      // {
      //   title: "차량번호",
      //   dataIndex: "carIdx",
      //   className: "table-column-center",
      // },
      {
        title: "수수료",
        dataIndex: "deliveryPriceFeeAmount",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>
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
      // {
      //   title: "원천징수",
      //   dataIndex: "withholdingTax",
      //   className: "table-column-center",
      //   render: (data) => <div>{data == 0 ? "OFF" : "ON"}</div>
      // },
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
        title: "입출금내역",
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
              <Select defaultValue={data} style={{ width: 68 }}>
                <Option value={3}>탈퇴</Option>
                <Option value={2}>중지</Option>
                <Option value={1}>사용</Option>
              </Select>
            </div>
          ),
      },
      /*
      {
        title: "작업",
        className: "table-column-center",
        render: () =>
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => { this.setState({ workTabOpen: true }) }}
            >작업</Button>
          </div>
      },*/
    ];

    return (
      <div className="">
        <div className="selectLayout">
          <span className="searchRequirementText">검색조건</span><br></br>
          <Radio.Group className="searchRequirement" onChange={this.onChange} value={this.state.riderStatus}>
            <Radio value={3}>탈퇴</Radio>
            <Radio value={2}>중지</Radio>
            <Radio value={1}>사용</Radio>
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
          >작업 스케줄러</Button>

          <BlackRiderDialog isOpen={this.state.blackRiderOpen} close={this.closeBlackRiderModal} />
          <Button className="riderManageBtn"
            onClick={this.openBlackRiderModal}
          >기사 차단</Button>


          <BlackListDialog isOpen={this.state.blackListOpen} close={this.closeBlackListModal} />
          <Button className="riderManageBtn"
            onClick={this.openBlackListModal}
          >기사 차단목록</Button>

        </div>

        <div className="dataTableLayout">
          <Table
            dataSource={this.state.results}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    )
  }
}
export default RiderMain;