import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Radio, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import moment from 'moment';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import RegistFranDialog from "../../components/dialog/franchise/RegistFranDialog";
import CoinTransferDialog from "../../components/dialog/franchise/CoinTransferDialog";
import BasicDialog from "../../components/dialog/BasicDialog";
import { formatDate } from "../../lib/util/dateUtil";
import "../../css/franchise.css";
import { comma } from "../../lib/util/numberUtil";
import { BankOutlined } from '@ant-design/icons';
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
      franchisee: "",
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      // test data
      list: [],
      franStatus: 1,
      addFranchiseOpen: false,
      coinTransferOpen: false,
    };
  }

  componentDidMount() {
    this.getList()
  }

  onSearchFranchisee = (value) => {
    this.setState({
      franchisee: value,
    }, () => {
      this.getList()
    })
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
    if (this.state.franStatus == 1) {
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
          membershipUse: 1,
          applyType: '매월 1일',
          membershipFee: '110000',
          cardStatus: 0,
          van: 'IC(나이스)',
          businessCard: '2340113269',
          businessCardName: '이스나',
          businessCardFran: '계룡리슈빌)잭슨부대',
          businessEmail: 'dbrwh45@blict.co.kr',
          businessDate: '21-02-01 19:02:17'
        },
        {
          franStatus: 1,
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
          membershipUse: 0,
          applyType: '매월 1일',
          membershipFee: '110000',
          cardStatus: 1,
          van: 'IC(나이스)',
          businessCard: '2340113269',
          businessCardName: '이덕호',
          businessCardFran: '계룡리슈빌)잭슨부대',
          businessEmail: 'dbrwh45@blict.co.kr',
          businessDate: '21-02-01 19:02:17'
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
          membershipUse: 1,
          applyType: '매월 1일',
          membershipFee: '110000',
          cardStatus: 0,
          van: 'IC(나이스)',
          businessCard: '2340113269',
          businessCardName: '이라희',
          businessCardFran: '계룡리슈빌)잭슨부대',
          businessEmail: 'dbrwh45@blict.co.kr',
          businessDate: '21-02-01 19:02:17'
        },
      ];
    }
    else if (this.state.franStatus == -1) {
      var list = [
        {
          franStatus: -1,
          idx: 4,
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
          membershipUse: 1,
          applyType: '매월 1일',
          membershipFee: '110000',
          cardStatus: 0,
          van: 'IC(나이스)',
          businessCard: '2340113269',
          businessCardName: '이스나',
          businessCardFran: '계룡리슈빌)잭슨부대',
          businessEmail: 'dbrwh45@blict.co.kr',
          businessDate: '21-02-01 19:02:17'
        },
      ];
    }
    else {
      var list = [
        {
          franStatus: 0,
          idx: 5,
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
          membershipUse: 1,
          applyType: '매월 1일',
          membershipFee: '110000',
          cardStatus: 0,
          van: 'IC(나이스)',
          businessCard: '2340113269',
          businessCardName: '이스나',
          businessCardFran: '계룡리슈빌)잭슨부대',
          businessEmail: 'dbrwh45@blict.co.kr',
          businessDate: '21-02-01 19:02:17'
        },
      ];
    }
    this.setState({
      list: list,
    });

  }

  // 가맹점등록 dialog
  openAddFranchiseModal = () => {
    this.setState({ addFranchiseOpen: true });
  }
  closeAddFranchiseModal = () => {
    this.setState({ addFranchiseOpen: false });
  }
  // 코인이체 dialog
  openCoinTransferModal = () => {
    this.setState({ coinTransferOpen: true });
  }
  closeCoinTransferodal = () => {
    this.setState({ coinTransferOpen: false });
  }


  // 검색조건 radio
  onChange = (e) => {
    this.setState({
      franStatus: e.target.value,
    }, () => this.getList());
  };


  render() {
    const columns = [
      {
        title: "상태",
        dataIndex: "franStatus",
        className: "table-column-center",
        render: (data) => <div>{data == -1 ? "탈퇴"
          : data == 0 ? "중지"
            : data == 1 ? "사용"
              : "-"}</div>
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
              onClick={() => { }}
            >작업</Button>
          </div>
      },
      {
        className: "table-column-center",
        render: () =>
          <div>
            <RegistFranDialog isOpen={this.state.addFranchiseOpen} close={this.closeAddFranchiseModal} />
            <Button
              className="tabBtn surchargeTab"
              onClick={this.openCoinTransferModal}
            >코인이체</Button>
          </div>
      },
    ];
    const expandedRowRender = (record) => {
      const dropColumns = [
        {
          title: "월회비 사용여부",
          dataIndex: "membershipUse",
          className: "table-column-center",
          render: (data) => <div>{data == 0 ? "사용안함" : "사용함"}</div>
        },
        {
          title: "적용타입",
          dataIndex: "applyType",
          className: "table-column-center",
        },
        {
          title: "월회비",
          dataIndex: "membershipFee",
          className: "table-column-center",
          render: (data) => <div>{comma(data)}</div>
        },
        {
          title: "카드가맹상태",
          dataIndex: "cardStatus",
          className: "table-column-center",
          render: (data) => <div>{data == 0 ? "요청" : "등록완료"}</div>
        },
        {
          title: "VAN",
          dataIndex: "van",
          className: "table-column-center",
        },
        {
          title: "카드_사업자번호",
          dataIndex: "businessCard",
          className: "table-column-center",
        },
        {
          title: "카드_사업주",
          dataIndex: "businessCardName",
          className: "table-column-center",
        },
        {
          title: "카드_가맹점명",
          dataIndex: "businessCardFran",
          className: "table-column-center",
        },
        {
          title: "이메일",
          dataIndex: "businessEmail",
          className: "table-column-center",
        },
        {
          title: "메모",
          dataIndex: "memo",
          className: "table-column-center",
        },
        {
          title: "시작일자",
          dataIndex: "businessDate",
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
      <div className="franchiseContainer">
        <div className="btnLayout">
          <CoinTransferDialog isOpen={this.state.coinTransferOpen} close={this.closeCoinTransferodal} />
          <Button
            icon={<BankOutlined />}
            className="tabBtn addFranTab"
            onClick={this.openAddFranchiseModal}
          >가맹점등록</Button>

          <Button
            className="tabBtn sectionTab"
          >구간 요금 설정</Button>

          <Button
            className="tabBtn priceTab"
          >요금설정</Button>

          <Button
            className="tabBtn placeTab"
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
          <span className="searchRequirementText">검색조건</span><br />
          <Radio.Group className="searchRequirement" onChange={this.onChange} value={this.state.franStatus}>
            <Radio value={1}>사용</Radio>
            <Radio value={0}>중지</Radio>
            <Radio value={-1}>탈퇴</Radio>
          </Radio.Group>
          <Search
            placeholder="가맹점검색"
            enterButton
            allowClear
            onSearch={this.onSearchFranchisee}
            style={{
              width: 246,
              marginLeft: 20
            }}
          />
        </div>

        <div className="dataTableLayout">
          <Table
            rowKey={(record) => record.idx}
            dataSource={this.state.list}
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
export default FranchiseMain;