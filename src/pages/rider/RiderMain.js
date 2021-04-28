import { Form, DatePicker, Input, Table, Button, Descriptions, Radio } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import '../../css/rider.css'
import { formatDate } from "../../lib/util/dateUtil";
import { comma } from "../../lib/util/numberUtil";

const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class RiderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffStatus: 1,
      riderName: "",
      taskSchedulerOpen: false, // 작업 스케줄러
      riderGroupMgtOpen: false, // 기사 그룹 관리
      registRiderOpen: false, // 기사등록
      workTabOpen: false, // 작업
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      list: [],
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

  getList = () => {
    var list = [
      {
        franchiseeName: '플러스김포',
        riderName: '김기연',
        riderGroup: 'A',
        phoneNum: '010-1234-5678',
        balance: '80000',
        memo: '메모',
        carIdx: '1234',
        fees: '-200',
        bankName: '신한은행',
        accountHolder: '김기연',
        accountNumber: '110-123-123456',
        withholdingTax: 0,
      },
      {
        franchiseeName: '플러스김포',
        riderName: '김기연',
        riderGroup: 'A',
        phoneNum: '010-1234-5678',
        balance: '80000',
        memo: '메모',
        carIdx: '1234',
        fees: '-200',
        bankName: '신한은행',
        accountHolder: '김기연',
        accountNumber: '110-123-123456',
        withholdingTax: 0,
      },
      {
        franchiseeName: '플러스김포',
        riderName: '김기연',
        riderGroup: 'A',
        phoneNum: '010-1234-5678',
        balance: '80000',
        memo: '메모',
        carIdx: '1234',
        fees: '-200',
        bankName: '신한은행',
        accountHolder: '김기연',
        accountNumber: '110-123-123456',
        withholdingTax: 0,
      },
    ];
    this.setState({
      list: list,
    });

  }

  render() {
    const columns = [
      {
        title: "지사명",
        dataIndex: "franchiseeName",
        className: "table-column-center",
      },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center",
      },
      {
        title: "기사그룹",
        dataIndex: "riderGroup",
        className: "table-column-center",
        render: (data) => <div>{data == "A" ? "A"
          : data == "B" ? "B"
            : data == "C" ? "C"
              : data == "D" ? "D" : "-"}</div>
      },
      {
        title: "단말기번호",
        dataIndex: "phoneNum",
        className: "table-column-center",
      },
      {
        title: "잔액",
        dataIndex: "balance",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>
      },
      {
        title: "메모",
        dataIndex: "memo",
        className: "table-column-center",
      },
      {
        title: "차량번호",
        dataIndex: "carIdx",
        className: "table-column-center",
      },
      {
        title: "수수료",
        dataIndex: "fees",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>
      },
      {
        title: "은행명",
        dataIndex: "bankName",
        className: "table-column-center",
      },
      {
        title: "예금주",
        dataIndex: "accountHolder",
        className: "table-column-center",
      },
      {
        title: "계좌번호",
        dataIndex: "accountNumber",
        className: "table-column-center",
      },
      {
        title: "원천징수",
        dataIndex: "withholdingTax",
        className: "table-column-center",
        render: (data) => <div>{data == 0 ? "OFF" : "ON"}</div>
      },
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
      },
    ];

    return (
        <div className="">
            <div className="selectLayout">
            <span className="searchRequirementText">검색조건</span><br></br>
            <Radio.Group className="searchRequirement" onChange={this.onChange} value={this.state.staffStatus}>
              <Radio value={1}>사용</Radio>
              <Radio value={0}>중지</Radio>
              <Radio value={-1}>탈퇴</Radio>
            </Radio.Group>

            <Search placeholder="기사명" 
                    onSearch={this.onSearchRider} 
                    enterButton
                    style={{
                      width: 200,
                      marginLeft: 20
                    }} />
                    
            <Button className="riderManageBtn"
              onClick={() => { this.setState({ taskSchedulerOpen: true }) }}
            >작업 스케줄러</Button>

            <Button className="riderManageBtn"
              onClick={() => { this.setState({ riderGroupMgtOpen: true }) }}
            >기사 그룹 관리</Button>

            <Button className="riderManageBtn"
              onClick={() => { this.setState({ registRiderOpen: true }) }}
            >기사 등록</Button>
          </div>

          <div className="dataTableLayout">
            <Table
              dataSource={this.state.list}
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