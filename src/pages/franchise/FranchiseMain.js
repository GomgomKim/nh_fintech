import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Radio, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import moment from 'moment';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import AddFranchiseDialog from "../../components/dialog/AddFranchiseDialog";
import { formatDate } from "../../lib/util/dateUtil";
import "../../css/franchise.css";
import { comma } from "../../lib/util/numberUtil";
const Option = Select.Option;
const FormItem = Form.Item;
const Ditems = Descriptions.Item;
const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();

class FranchiseMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delayTab: 0,
      mapTab: 0,
      surchargeTab: 0,
      registTab: 0,
      messageTab: 0,
      noticeTab: 0,
      selectedDate: today,
      filterTab: 0,
      franchisee: "",
      rider: "",
      phoneNum: "",
      workTab: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      // test data
      list: [],
      addFranchiseOpen: false,
    };
  }

  componentDidMount() {
    this.getList()
  }

  setDate = (date) => {
    console.log(date)
  }

  onSearchFranchisee = (value) => {
    this.setState({
      franchisee: value,
    }, () => {
      this.getList()
    })
  }


  getList = () => {
    var list = [
      {
        franStatus: 1,
        idx: 3,
        branchName: '플러스김포',
        franchiseName: '계룡리슈빌)잭슨부대',
        businessNum: '234013269',
        ceoName: '이스나',
        callNum: '031-995-4555',
        phoneNum: '010-1234-5896',
        ceoBirth: '19960404',
        memo: 'dbrwh45@blict.co.kr',
        address: '경기도 김포시 양촌읍 구래리 271-4',
        balanceCoin: '60000',
        delPayType: 1,
        delPrice: '3000',
      },
      {
        franStatus: 0,
        idx: 2,
        branchName: '플러스김포',
        franchiseName: '계룡리슈빌)잭슨부대',
        businessNum: '234013269',
        ceoName: '이덕호',
        callNum: '031-995-4555',
        phoneNum: '010-1234-5896',
        ceoBirth: '19960404',
        memo: 'dbrwh45@blict.co.kr',
        address: '경기도 김포시 양촌읍 구래리 271-4',
        balanceCoin: '60000',
        delPayType: 0,
        delPrice: '3000',
      },
      {
        franStatus: 1,
        idx: 1,
        branchName: '플러스김포',
        franchiseName: '계룡리슈빌)잭슨부대',
        businessNum: '234013269',
        ceoName: '이라희',
        callNum: '031-995-4555',
        phoneNum: '010-1234-5896',
        ceoBirth: '19960404',
        memo: 'dbrwh45@blict.co.kr',
        address: '경기도 김포시 양촌읍 구래리 271-4',
        balanceCoin: '60000',
        delPayType: 0,
        delPrice: '3000',
      },
    ];
    this.setState({
      list: list,
    });

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


  // 시간지연 dialog
  openAddFranchiseModal = () => {
    this.setState({ addFranchiseOpen: true });
  }
  closeAddFranchiseModal = () => {
    this.setState({ addFranchiseOpen: false });
  }


  render() {
    const columns = [
      {
        title: "상태",
        dataIndex: "franStatus",
        className: "table-column-center",
        render: (data) => <div>{
          data == 0 ? "미사용"
            : data == 1 ? "사용" : "-"}</div>
      },
      {
        title: "순번",
        dataIndex: "idx",
        className: "table-column-center",
      },
      {
        title: "지사명",
        dataIndex: "branchName",
        className: "table-column-center",
      },
      {
        title: "가맹점명",
        dataIndex: "franchiseName",
        className: "table-column-center",
      },
      {
        title: "사업자번호",
        dataIndex: "businessNum",
        className: "table-column-center",
      },
      {
        title: "대표자명",
        dataIndex: "ceoName",
        className: "table-column-center",
      },
      {
        title: "전화번호",
        dataIndex: "callNum",
        className: "table-column-center",
      },
      {
        title: "휴대전화",
        dataIndex: "phoneNum",
        className: "table-column-center",
      },
      {
        title: "생년월일",
        dataIndex: "ceoBirth",
        className: "table-column-center",
      },
      {
        title: "메모",
        dataIndex: "memo",
        className: "table-column-center",
      },
      {
        title: "주소",
        dataIndex: "address",
        className: "table-column-center",
      },
      {
        title: "코인잔액",
        dataIndex: "balanceCoin",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>
      },
      {
        title: "배달료 지급방법",
        dataIndex: "delPayType",
        className: "table-column-center",
        render: (data) => <div>{data == 0 ? "코인" : "코인(VAT)"}</div>
      },
      {
        title: "기본배달요금",
        dataIndex: "delPrice",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>
      },
      {
        title: "작업",
        className: "table-column-center",
        render: () =>
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => { this.setState({ workTab: 1 }) }}
            >작업</Button>
          </div>
      },
    ];

    return (
      <div className="franchiseContainer">
        <div className="btnLayout">
          <AddFranchiseDialog isOpen={this.state.addFranchiseOpen} close={this.closeAddFranchiseModal} />
          <Button
            className="tabBtn delayTab"
            onClick={() => { this.setState({ delayTab: 1 }, this.openAddFranchiseModal) }}
          >가맹점등록</Button>

          <Button
            className="tabBtn mapTab"
            onClick={() => { this.setState({ mapTab: 1 }) }}
          >구간 요금 설정</Button>

          <Button
            className="tabBtn surchargeTab"
            onClick={() => { this.setState({ surchargeTab: 1 }) }}
          >요금설정</Button>

          <Button
            className="tabBtn registTab"
            onClick={() => { this.setState({ registTab: 1 }) }}
          >배달 지역 설정</Button>

          <FormItem
            name="franMainName"
            className="selectFran"
          >
            <Select placeholder="지사를 선택해 주세요." className="override-select fran">
              <Option value={0}>플러스김포 / 플러스김포</Option>
              <Option value={1}>김포1지점 / 플러스김포</Option>
              <Option value={2}>김포2지점 / 플러스김포</Option>
            </Select>
          </FormItem>
        </div>
        <div className="m-t-m13">
          <FormItem
            style={{
              marginBottom: 0,
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
            name="searchType"
            initialValue={0}
          >
            <Radio.Group>
              <Radio style={{ fontSize: 14 }} value={0}>사용</Radio>
              <Radio style={{ fontSize: 14 }} value={1}>중지</Radio>
              <Radio style={{ fontSize: 14 }} value={2}>탈퇴</Radio>
            </Radio.Group>
          </FormItem>
          <Search
            placeholder="가맹점검색"
            enterButton
            allowClear
            onSearch={this.onSearchFranchisee}
            style={{
              width: 224,
              marginLeft: 20
            }}
          />
        </div>

        <div className="dataTableLayout">
          <Table
            // rowKey={(record) => record.idx}
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
export default FranchiseMain;