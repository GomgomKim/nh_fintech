import { DatePicker, Input, Select, Table, Button, Checkbox } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import TimeDelayDialog from "../../components/dialog/order/TimeDelayDialog";
import FilteringDialog from "../../components/dialog/order/FilteringDialog";
import RegistCallDialog from "../../components/dialog/order/RegistCallDialog";
import SurchargeDialog from "./../../components/dialog/order/SurchargeDialog";
import NoticeDialog from "../../components/dialog/order/NoticeDialog";
import { formatDate } from "../../lib/util/dateUtil";
import "../../css/order.css";
import "../../css/common.css";
import { comma } from "../../lib/util/numberUtil";
import {
  FieldTimeOutlined, DollarCircleOutlined, EnvironmentFilled,
  PhoneOutlined, MessageOutlined, NotificationFilled, FilterOutlined
} from '@ant-design/icons';

const Option = Select.Option;
const Search = Input.Search;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();
const rowClassName = ['', 'table-red', 'table-blue', 'table-white', 'table-gray', 'table-gray']

class ReceptionStatus extends Component {
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
      timeDelayOpen: false,
      surchargeOpen: false,
      addCallOpen: false,
      filteringOpen: false,
      noticeOpen: false,
      activeIndex: -1,
    };
  }

  componentDidMount() {
    this.getList()
    // console.log(this.props)
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

  onSearchWorker = (value) => {
    this.setState({
      rider: value,
    }, () => {
      this.getList()
    })
  }

  onSearchPhoneNum = (value) => {
    this.setState({
      phoneNum: value,
    }, () => {
      this.getList()
    })
  }


  getList = () => {
    var list = [
      {
        pickupStatus: 1,
        preparationStatus: 0,
        requestTime: '2021-04-21 12:00:00',
        preparationTime: '10분',
        elapsedTime: '15',
        pickupTime: '2021-04-21 12:00:00',
        completionTime: '2021-04-21 12:00:00',
        riderName: '김기연',
        franchiseeName: '곰곰',
        deliveryCharge: 1000,
        destination: '서울시 노원구 123동',
        charge: 60000,
        paymentMethod: 0,
        fees: -200,
        distance: 0.91,
        cardStatus: 0,
        authNum: 0,
        businessCardName: '신한',
        riderPhoneNum: '010-1234-5678',
        franchiseName: '풀러스김포',
        payAmount: 20000,
        changes: '',
        riderBelong: '플러스김포',
        receiptAmount: 192,
        franchisePhoneNum: '031-1234-5678',
      },
      {
        pickupStatus: 2,
        preparationStatus: 1,
        requestTime: '2021-04-21 12:00:00',
        preparationTime: '15분',
        elapsedTime: '6',
        pickupTime: '2021-04-21 12:00:00',
        completionTime: '2021-04-21 12:00:00',
        riderName: '김기연',
        franchiseeName: '곰곰',
        deliveryCharge: 3000,
        destination: '서울시 노원구 123동',
        charge: 30000,
        paymentMethod: 0,
        fees: -200,
        distance: 0.91,
        cardStatus: 1,
        authNum: 0,
        businessCardName: '신한',
        riderPhoneNum: '010-1234-5678',
        franchiseName: '풀러스김포',
        payAmount: 20000,
        changes: '17:19 승인완료',
        riderBelong: '플러스김포',
        receiptAmount: 192,
        franchisePhoneNum: '031-1234-5678',
      },
      {
        pickupStatus: 3,
        preparationStatus: 1,
        requestTime: '2021-04-21 12:00:00',
        preparationTime: '10분',
        elapsedTime: '7',
        pickupTime: '2021-04-21 12:00:00',
        completionTime: '2021-04-21 12:00:00',
        riderName: '김기연',
        franchiseeName: '곰곰',
        deliveryCharge: 2000,
        destination: '서울시 노원구 123동',
        charge: 20000,
        paymentMethod: 0,
        fees: -200,
        distance: 0.91,
        cardStatus: 0,
        authNum: 0,
        businessCardName: '신한',
        riderPhoneNum: '010-1234-5678',
        franchiseName: '풀러스김포',
        payAmount: 20000,
        changes: '',
        riderBelong: '플러스김포',
        receiptAmount: 192,
        franchisePhoneNum: '031-1234-5678',
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
  openTimeDelayModal = () => {
    this.setState({ timeDelayOpen: true });
  }
  closeTimeDelayModal = () => {
    this.setState({ timeDelayOpen: false });
  }

  // 할증 dialog
  openSurchargeModal = () => {
    this.setState({ surchargeOpen: true });
  }
  closeSurchargeModal = () => {
    this.setState({ surchargeOpen: false });
  }

  // 콜등록 dialog
  openAddCallModal = () => {
    this.setState({ addCallOpen: true });
  }
  closeAddCallModal = () => {
    this.setState({ addCallOpen: false });
  }

  // 필터링 dialog
  openFilteringModal = () => {
    this.setState({ filteringOpen: true });
  }
  closeFilteringModal = () => {
    this.setState({ filteringOpen: false });
  }

  // 공지사항 dialog
  closeNoticeModal = () => {
    this.setState({ noticeOpen: false });
  }

  // setClassName = (record, index) => {
  //   console.log(record, index)
  //   return index == this.state.activeIndex ? 'table-red' : "";
  // }

  render() {
    const columns = [
      {
        title: "상태",
        dataIndex: "pickupStatus",
        className: "table-column-center",
        render: (data) => <div>
          <Select defaultValue={data} 
              onChange={(value) => {
                // console.log(value)

            }}>
            <Option value={1}>대기중</Option>
            <Option value={2}>픽업중</Option>
            <Option value={3}>배달중</Option>
            <Option value={4}>완료</Option>
            <Option value={5}>취소</Option>
          </Select></div>

      },
      {
        title: "음식준비",
        dataIndex: "preparationStatus",
        className: "table-column-center",
        render: (data) => <div>{data == 0 ? "준비중" : "완료"}</div>
      },
      {
        title: "요청 시간",
        dataIndex: "requestTime",
        className: "table-column-center",
        render: (data) => <div>{formatDate(data)}</div>
      },
      {
        title: "준비 시간",
        dataIndex: "preparationTime",
        className: "table-column-center",
      },
      {
        title: "경과(분)",
        dataIndex: "elapsedTime",
        className: "table-column-center",
      },
      {
        title: "픽업시간",
        dataIndex: "pickupTime",
        className: "table-column-center",
        render: (data) => <div>{formatDate(data)}</div>
      },
      {
        title: "완료시간",
        dataIndex: "completionTime",
        className: "table-column-center",
        render: (data) => <div>{formatDate(data)}</div>
      },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center",
      },
      {
        title: "가맹점명",
        dataIndex: "franchiseeName",
        className: "table-column-center",
      },
      {
        title: "배달 요금",
        dataIndex: "deliveryCharge",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>
      },
      {
        title: "도착지",
        dataIndex: "destination",
        className: "table-column-center",
      },
      {
        title: "가격",
        dataIndex: "charge",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>
      },
      {
        title: "결제방식",
        dataIndex: "paymentMethod",
        className: "table-column-center",
        render: (data) => <div>{data == 0 ? "선결" : "카드"}</div>
      },

    ];

    const expandedRowRender = (record) => {
      const dropColumns = [
        {
          title: "수수료",
          dataIndex: "fees",
          className: "table-column-center",
          render: (data) => <div>{comma(data)}</div>
        },
        {
          title: "거리(km)",
          dataIndex: "distance",
          className: "table-column-center",
        },
        {
          title: "카드상태",
          dataIndex: "cardStatus",
          className: "table-column-center",
          render: (data) => <div>{data == 0 ? "요청" : "등록완료"}</div>
        },
        {
          title: "승인번호",
          dataIndex: "authNum",
          className: "table-column-center",
        },
        {
          title: "카드사",
          dataIndex: "businessCardName",
          className: "table-column-center",
        },
        {
          title: "기사 연락처",
          dataIndex: "riderPhoneNum",
          className: "table-column-center",
        },
        {
          title: "지사명",
          dataIndex: "franchiseName",
          className: "table-column-center",
        },
        {
          title: "카드승인금액",
          dataIndex: "payAmount",
          className: "table-column-center",
          render: (data) => <div>{comma(data)}</div>
        },
        {
          title: "변경내역",
          dataIndex: "changes",
          className: "table-column-center",
        },
        {
          title: "기사소속",
          dataIndex: "riderBelong",
          className: "table-column-center",
        },
        {
          title: "접수건수",
          dataIndex: "receiptAmount",
          className: "table-column-center",
          render: (data) => <div>{comma(data)}</div>
        },
        {
          title: "가맹점 번호",
          dataIndex: "franchisePhoneNum",
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
      <div className="reception-box">
        <div className="btnLayout">
          <TimeDelayDialog isOpen={this.state.timeDelayOpen} close={this.closeTimeDelayModal} />
          <Button
            icon={<FieldTimeOutlined />}
            className="tabBtn delayTab"
            onClick={() => { this.setState({ delayTab: 1 }, this.openTimeDelayModal) }}
          >호출설정</Button>

          <Button
            icon={<EnvironmentFilled />}
            className="tabBtn mapTab"
            onClick={() => { this.props.openMapControl() }}
          >지도관제</Button>

          <SurchargeDialog isOpen={this.state.surchargeOpen} close={this.closeSurchargeModal} />
          <Button
            icon={<DollarCircleOutlined />}
            className="tabBtn surchargeTab"
            onClick={() => { this.setState({ surchargeTab: 1 }, this.openSurchargeModal) }}
          >할증</Button>

          <RegistCallDialog isOpen={this.state.addCallOpen} close={this.closeAddCallModal} />
          <Button
            icon={<PhoneOutlined />}
            className="tabBtn registTab"
            onClick={() => { this.setState({ registTab: 1 }, this.openAddCallModal) }}
          >콜등록</Button>

          <Button
            icon={<MessageOutlined />}
            className="tabBtn messageTab"
            onClick={() => { this.setState({ messageTab: 1 }) }}
          >상담메세지</Button>

          <NoticeDialog isOpen={this.state.noticeOpen} close={this.closeNoticeModal} />
          <Button
            icon={<NotificationFilled />}
            className="tabBtn noticeTab"
            onClick={() => { this.setState({ noticeOpen: true }) }}
          >공지사항</Button>
        </div>

        <div className="selectLayout">
          <DatePicker
            defaultValue={moment(today, dateFormat)}
            format={dateFormat}
            onChange={date => this.setState({ selectedDate: date })}
          />
          <FilteringDialog isOpen={this.state.filteringOpen} close={this.closeFilteringModal} />
          <Button
            icon={<FilterOutlined />}
            className="tabBtn filterTab"
            onClick={() => { this.setState({ filterTab: 1 }, this.openFilteringModal) }}
          >필터링 설정</Button>

          <Search
            placeholder="가맹점검색"
            enterButton
            allowClear
            onSearch={this.onSearchFranchisee}
            style={{
              width: 200,
              marginLeft: 20
            }}
          />

          <Search
            placeholder="기사명검색"
            enterButton
            allowClear
            onSearch={this.onSearchFranchisee}
            style={{
              width: 200,
              marginLeft: 20
            }}
          />

          <Search
            placeholder="전화번호검색"
            enterButton
            allowClear
            onSearch={this.onSearchFranchisee}
            style={{
              width: 200,
              marginLeft: 20
            }}
          />


          <Checkbox></Checkbox><span className="span1">완료조회</span>

        </div>


        <div className="dataTableLayout">
          <Table
            rowKey={(record) => record}
            rowClassName={(record) => rowClassName[record.pickupStatus]}
            dataSource={this.state.list}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
            expandedRowRender={expandedRowRender}
            // onRow={(record, index) => ({
            //   onClick: () => {
            //     // console.log(record.pickupStatus)
            //     // console.log(record, index)
            //     // rowClassName: 'table-red'
            //     this.setState({
            //       activeIndex: index,
            //     })
            //   }
            // })}
            // rowClassName ={this.setClassName}
          />
        </div>
      </div>
    )
  }
}

export default ReceptionStatus;