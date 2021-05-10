import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Radio, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import moment from 'moment';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import RegistFranDialog from "../../components/dialog/franchise/RegistFranDialog";
import CoinTransferDialog from "../../components/dialog/franchise/CoinTransferDialog";
import ModifyFranDialog from "../../components/dialog/franchise/ModifyFranDialog";
import SearchAddressDialog from "../../components/dialog/franchise/SearchAddressDialog";
import { formatDate } from "../../lib/util/dateUtil";
import string from "../../string";
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
      withdrawSet: 0,
      franStatus: 1,
      franGroup: 0,
      franSelectStatus: 0,
      addFranchiseOpen: false,
      coinTransferOpen: false,
      modifyFranOpen: false,
      SearchAddressOpen: false,
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
    httpPost(httpUrl.franchiseList, [], {
      frName: "",
      pageNum: 1,
      pageSize: 10,
      userGroup: this.state.franGroup,
      userStatus: this.state.franStatus
    }).then((result) => {
      console.log('## result=' + JSON.stringify(result, null, 4))
      const pagination = { ...this.state.pagination };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.tota;
      this.setState({
        list: result.data.franchises,
        pagination,
      });
    })
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

  // 가맹점수정 dialog
  openModifyFranModal = () => {
    this.setState({ modifyFranOpen: true });
  }
  closeModifyFranModal = () => {
    this.setState({ modifyFranOpen: false });
  }

  // 주소검색관리 dialog
  openSearchAddressModal = () => {
    this.setState({ SearchAddressOpen: true });
  }
  closeSearchAddressModal = () => {
    this.setState({ SearchAddressOpen: false });
  }

  // // 출금설정
  // onSetting = (value) => {
  //   let withdrawSet = value
  //   this.setState({
  //     withdrawSet: withdrawSet
  //   }, () => {
  //     this.getList();
  //   })
  // }

  // // 상태설정
  // onStatusSetting = (value) => {
  //   let franStatus = value
  //   this.setState({
  //     franStatus: franStatus
  //   }, () => {
  //     this.getList();
  //   })
  // }


  // 검색조건 radio

  render() {
    const columns = [
      // 0 = 중지
      // 1 = 사용
      // 2 = 탈퇴
      {
        title: "상태",
        dataIndex: "franStatus",
        className: "table-column-center",
        render:
          (data, row) => (
            <div>
              <Select defaultValue={1} onChange={onChangeStatus} style={{ width: 68 }}>
                <Option value={0}>중지</Option>
                <Option value={1}>사용</Option>
                <Option value={2}>탈퇴</Option>
              </Select>
            </div>
          ),
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
        title: "출금설정",
        dataIndex: "withdrawSet",
        className: "table-column-center",
        render:
          (data, row) => (
            <div>
              <Select defaultValue={1}>
                <Option value={0}>출금 금지</Option>
                <Option value={1}>출금 가능</Option>
              </Select>
            </div>
          ),
      },
      {
        title: "이체",
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
      {
        title: "수정",
        className: "table-column-center",
        render: () =>
          <div>
            <ModifyFranDialog isOpen={this.state.modifyFranOpen} close={this.closeModifyFranModal} />
            <Button
              className="tabBtn surchargeTab"
              onClick={this.openModifyFranModal}
            >수정하기</Button>
          </div>
      },
    ]

    const onChange = (e) => {
      console.log(e.target.value)
      this.setState({
        franStatus: e.target.value
      }, () => {
        this.getList();
      })
    }

    const onChangeGroup = (value) => {
      console.log(value)
      this.setState({
        franGroup: value
      }, () => {
        this.getList();
      })
    }
    const onChangeStatus = (value) => {
      console.log(value)
      this.setState({
        franStatus: this.state.franStatus
      }, () => {
        this.getList();
      })
    }

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

        <div className="selectLayout">
          <span className="searchRequirementText">검색조건</span><br />
          <Radio.Group className="searchRequirement" onChange={onChange} value={this.state.franStatus}>
            <Radio value={1}>사용</Radio>
            <Radio value={0}>중지</Radio>
            <Radio value={2}>탈퇴</Radio>
          </Radio.Group>
          <Search
            placeholder="가맹점검색"
            enterButton
            allowClear
            onSearch={this.onSearchFranchisee}
            style={{
              width: 200,
              marginLeft: 20,
              verticalAlign: 'bottom'
            }}
          />


          <CoinTransferDialog isOpen={this.state.coinTransferOpen} close={this.closeCoinTransferodal} />
          <Button
            icon={<BankOutlined />}
            className="tabBtn addFranTab"
            onClick={this.openAddFranchiseModal}
          >가맹점등록</Button>
          <SearchAddressDialog isOpen={this.state.SearchAddressOpen} close={this.closeSearchAddressModal} />
          <Button
            className="tabBtn sectionTab"
            onClick={this.openSearchAddressModal}
          >주소검색관리</Button>


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