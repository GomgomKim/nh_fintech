import {
  Form,
  DatePicker,
  Input,
  Checkbox,
  Select,
  Table,
  Button,
  Descriptions,
} from 'antd';
import Icon from '@ant-design/icons';
import moment from 'moment';
import React, { Component } from 'react';
import {
  httpGet,
  httpUrl,
  httpDownload,
  httpPost,
  httpPut,
} from '../../api/httpClient';
import { formatDate } from '../../lib/util/dateUtil';
import '../../css/order.css';
import { comma } from '../../lib/util/numberUtil';
import MapContainer from '../../components/dialog/order/MapContainer';
const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();

class MapControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riderName: '',
      phoneNum: '',
      workTab: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      // test data
      list: [],
      franchisee: '',
    };
  }

  componentDidMount() {
    this.getList();
  }

  setDate = date => {
    console.log(date);
  };

  onSearchFranchisee = value => {
    this.setState(
      {
        franchisee: value,
      },
      () => {
        this.getList();
      },
    );
  };

  onSearchWorker = value => {
    this.setState(
      {
        riderName: value,
      },
      () => {
        this.getList();
      },
    );
  };

  onSearchPhoneNum = value => {
    this.setState(
      {
        phoneNum: value,
      },
      () => {
        this.getList();
      },
    );
  };

  getList = () => {
    var list = [
      {
        pickupStatus: 1,
        preparationStatus: 0,
        requestTime: '2021-04-21 12:00:00',
        preparationTime: '10분',
        elapsedTime: '15',
        orderTime: '2021-04-21 12:00:00',
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
        orderTime: '2021-04-21 12:00:00',
        pickupTime: '2021-04-21 12:00:00',
        completionTime: '2021-04-21 12:00:00',
        riderName: '김기연',
        franchiseeName: '곰곰',
        deliveryCharge: 3000,
        destination: '서울시 노원구 123동',
        charge: 30000,
        paymentMethod: 0,
      },
    ];
    this.setState({
      list: list,
    });
  };

  handleTableChange = pagination => {
    console.log(pagination);
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState(
      {
        pagination: pager,
      },
      () => this.getList(),
    );
  };

  render() {
    const columns = [
      {
        title: '상태',
        dataIndex: 'pickupStatus',
        className: 'table-column-center',
        render: data => (
          <div>
            {data == -1
              ? '취소'
              : data == 0
              ? '픽업'
              : data == 1
              ? '배차'
              : data == 2
              ? '완료'
              : '-'}
          </div>
        ),
      },
      {
        title: '도착지',
        dataIndex: 'destination',
        className: 'table-column-center',
      },
      {
        title: '주문시간',
        dataIndex: 'orderTime',
        className: 'table-column-center',
        render: data => <div>{formatDate(data)}</div>,
      },
      {
        title: '배차시간',
        dataIndex: 'completionTime',
        className: 'table-column-center',
        render: data => <div>{formatDate(data)}</div>,
      },
      {
        title: '픽업시간',
        dataIndex: 'pickupTime',
        className: 'table-column-center',
        render: data => <div>{formatDate(data)}</div>,
      },
      {
        title: '경과(분)',
        dataIndex: 'elapsedTime',
        className: 'table-column-center',
      },
      {
        title: '기사명',
        dataIndex: 'riderName',
        className: 'table-column-center',
      },
      {
        title: '가맹점명',
        dataIndex: 'franchiseeName',
        className: 'table-column-center',
      },
      {
        title: '가격',
        dataIndex: 'charge',
        className: 'table-column-center',
        render: data => <div>{comma(data)}</div>,
      },
      {
        title: '배달 요금',
        dataIndex: 'deliveryCharge',
        className: 'table-column-center',
        render: data => <div>{comma(data)}</div>,
      },
      {
        title: '결제방식',
        dataIndex: 'paymentMethod',
        className: 'table-column-center',
        render: data => <div>{data == 0 ? '선결' : '카드'}</div>,
      },
      {
        title: '카드상태',
        dataIndex: 'preparationStatus',
        className: 'table-column-center',
        render: data => <div>{data == 0 ? '요청' : '결제완료'}</div>,
      },
      {
        title: '작업',
        className: 'table-column-center',
        render: () => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => {
                this.setState({ workTab: 1 });
              }}
            >
              작업
            </Button>
          </div>
        ),
      },
    ];

    return (
      <div className="">
        <div className="selectLayout">
          <Button
            className="tabBtn orderTab"
            onClick={() => {
              this.props.closeMapControl();
            }}
          >
            접수현황
          </Button>

          <Search
            placeholder="지사명검색"
            enterButton
            allowClear
            onSearch={this.onSearchFranchisee}
            style={{
              width: 200,
            }}
          />

          <Search
            placeholder="기사명검색"
            enterButton
            allowClear
            onSearch={this.onSearchWorker}
            style={{
              width: 200,
              marginLeft: 20,
            }}
          />
        </div>

        <div className="textLayout">
          <span className="riderText">
            {this.state.riderName}의 배차 목록 &lt;{this.state.franchisee}&gt;{' '}
          </span>
        </div>

        <div className="riderTableLayout">
          <Table
            dataSource={this.state.list}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
        </div>

        <div className="mapLayout">
          <MapContainer />
        </div>
      </div>
    );
  }
}
export default MapControl;
