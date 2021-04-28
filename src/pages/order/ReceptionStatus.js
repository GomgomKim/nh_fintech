import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import moment from 'moment';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import TimeDelayDialog from "../../components/dialog/TimeDelayDialog";
import FilteringDialog from "../../components/dialog/FilteringDialog";
import AddCallDialog from "../../components/dialog/AddCallDialog";
import { formatDate } from "../../lib/util/dateUtil";
import "../../css/order.css";
import "../../css/common.css";
import { comma } from "../../lib/util/numberUtil";
import SurchargeDialog from "../../components/dialog/SurchargeDialog";
import MapControl from "./MapControl"

const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();

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
      },
      {
        pickupStatus: 0,
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
      },
      {
        pickupStatus: 0,
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

  render() {
    const columns = [
      {
        title: "상태",
        dataIndex: "pickupStatus",
        className: "table-column-center",
        render: (data) => <div>{data == -1 ? "취소"
          : data == 0 ? "픽업"
            : data == 1 ? "배차"
              : data == 2 ? "완료" : "-"}</div>
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
      <div className="">
        <div className="btnLayout">
          <TimeDelayDialog isOpen={this.state.timeDelayOpen} close={this.closeTimeDelayModal} />
          <Button
            className="tabBtn delayTab"
            onClick={() => { this.setState({ delayTab: 1 }, this.openTimeDelayModal) }}
          >10분지연</Button>

          <Button
            className="tabBtn mapTab"
            onClick={() => { this.props.openMapControl() }}
          >지도관제</Button>

          <SurchargeDialog isOpen={this.state.surchargeOpen} close={this.closeSurchargeModal} />
          <Button
            className="tabBtn surchargeTab"
            onClick={() => { this.setState({ surchargeTab: 1 }, this.openSurchargeModal) }}
          >할증</Button>

          <AddCallDialog isOpen={this.state.addCallOpen} close={this.closeAddCallModal} />
          <Button
            className="tabBtn registTab"
            onClick={() => { this.setState({ registTab: 1 }, this.openAddCallModal) }}
          >콜등록</Button>

          <Button
            className="tabBtn messageTab"
            onClick={() => { this.setState({ messageTab: 1 }) }}
          >상담메세지</Button>

          <Button
            className="tabBtn noticeTab"
            onClick={() => { this.setState({ noticeTab: 1 }) }}
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

export default ReceptionStatus;