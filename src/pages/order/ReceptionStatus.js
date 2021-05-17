import { DatePicker, Input, Select, Table, Button, Checkbox, Modal } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import TimeDelayDialog from '../../components/dialog/order/TimeDelayDialog';
import FilteringDialog from '../../components/dialog/order/FilteringDialog';
import RegistCallDialog from '../../components/dialog/order/RegistCallDialog';
import SurchargeDialog from './../../components/dialog/order/SurchargeDialog';
import NoticeDialog from '../../components/dialog/order/NoticeDialog';
import ForceAllocateDialog from '../../components/dialog/order/ForceAllocateDialog';
import MapControlDialog from '../../components/dialog/order/MapControlDialog';
import MessageDialog from '../../components/dialog/order/MessageDialog';
import { formatDate } from '../../lib/util/dateUtil';
import '../../css/order.css';
import '../../css/common.css';
import { comma } from '../../lib/util/numberUtil';
import { 
  deliveryStatusCode, 
  modifyType, 
  rowColorName, 
  preparationStatus,
  paymentMethod,
  cardStatus,
} from '../../lib/util/codeUtil';
import {
  FieldTimeOutlined,
  DollarCircleOutlined,
  EnvironmentFilled,
  PhoneOutlined,
  MessageOutlined,
  NotificationFilled,
  FilterOutlined,
} from "@ant-design/icons";
import createDummyCall from "../../lib/util/createCall";
import { httpGet, httpPost, httpUrl } from "../../api/httpClient";

const Option = Select.Option;
const Search = Input.Search;
const dateFormat = "YYYY/MM/DD";
const today = new Date();
const list = createDummyCall(100);

class ReceptionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: today,
      franchisee: '',
      rider: '',
      phoneNum: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      // test data
      list: [],
      totalList: [],
      timeDelayOpen: false,
      surchargeOpen: false,
      addCallOpen: false,
      filteringOpen: false,
      noticeOpen: false,
      forceOpen: false,
      MessageOpen: false,
      activeIndex: -1,
      mapControlOpen: false,

      // table param
      selectedFrName: "냠냠푸드",
      // selectedDate: formatDate(today),
      selectedDate: "2021-01-01",
      selectedOrderStatus: [1, 2, 3, 4, 5],
      selectedPaymentMethods: [1],
      selectedRiderName: "margie5047",
    };
  }

  componentDidMount() {
    this.getList();
  }
  handleToggleCompleteCall = (e) => {
    this.setState({
      checkedCompleteCall: e.target.checked,
    });
  };

  setDate = (date) => {
    console.log(date);
  };

  onSearch = () => {
    this.getList();
  };

  // onSearchFranchisee = (value) => {
  //   this.setState(
  //     {
  //       franchisee: value,
  //     },
  //     () => {
  //       this.getList();
  //     }
  //   );
  // };

  // onSearchWorker = (value) => {
  //   this.setState(
  //     {
  //       rider: value,
  //     },
  //     () => {
  //       this.getList();
  //     }
  //   );
  // };

  // onSearchPhoneNum = (value) => {
  //   this.setState(
  //     {
  //       phoneNum: value,
  //     },
  //     () => {
  //       this.getList();
  //     }
  //   );
  // };

  getList = () => {
    httpPost(httpUrl.orderList, [], {
      frName: this.state.franchisee,
      orderDate: formatDate(this.state.selectedDate),
      orderStatuses: this.state.selectedOrderStatus,
      pageNum: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      paymentMethods: this.state.selectedPaymentMethods,
      riderName: this.state.rider,
    })
      .then((res) => {
        if (res.result === "SUCCESS") {
          console.log(res.data.orders);
          alert("성공적으로 처리되었습니다.");
        } else {
          alert("res는 왔는데 result가 SUCCESS가 아닌 경우.");
        }
      })
      .catch((e) => {
        console.log(e);
        console.log({
          frName: this.state.franchisee,
          orderDate: formatDate(this.state.selectedDate),
          orderStatuses: [1, 2, 3, 4, 5],
          pageNum: this.state.pagination.current,
          pageSize: this.state.pagination.pageSize,
          paymentMethods: this.state.selectedPaymentMethods,
          riderName: this.state.selectedRiderName,
        });    
        alert("처리가 실패했습니다.");
      });
    // console.log(list)
    this.setState({
      list: list,
    });
  };

  handleTableChange = (pagination) => {
    console.log(pagination);
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState(
      {
        pagination: pager,
      },
      () => this.getList()
    );
  };

  // 시간지연 dialog
  openTimeDelayModal = () => {
    this.setState({ timeDelayOpen: true });
  };
  closeTimeDelayModal = () => {
    this.setState({ timeDelayOpen: false });
  };

  // 할증 dialog
  openSurchargeModal = () => {
    this.setState({ surchargeOpen: true });
  };
  closeSurchargeModal = () => {
    this.setState({ surchargeOpen: false });
  };

  // 콜등록 dialog
  openAddCallModal = () => {
    this.setState({ addCallOpen: true });
  };
  closeAddCallModal = () => {
    this.setState({ addCallOpen: false });
  };

  // 지도관제
  openMapControlModal = () => {
    this.setState({ mapControlOpen: true });
  };
  closeMapControlModal = () => {
    this.setState({ mapControlOpen: false });
  };

  // 필터링 dialog
  openFilteringModal = () => {
    this.setState({ filteringOpen: true });
  };
  closeFilteringModal = () => {
    this.setState({ filteringOpen: false });
  };

  // 공지사항 dialog
  openNoticeModal = () => {
    this.setState({ noticeOpen: true });
  };
  closeNoticeModal = () => {
    this.setState({ noticeOpen: false });
  };

  // 강제배차 dialog
  openForceModal = () => {
    this.setState({ forceOpen: true });
  };
  closeForceingModal = () => {
    this.setState({ forceOpen: false });
  };

  // 메세지 dialog
  openMessageModal = () => {
    this.setState({ MessageOpen: true });
  };
  closeMessageModal = () => {
    this.setState({ MessageOpen: false });
  };

  getStatusVal = (idx) => {
    // console.log("idx : "+idx)
  };

  render() {
    const columns = [
      {
        title: "상태",
        dataIndex: "pickupStatus",
        className: "table-column-center",
        render: (data, row) => (
          <div className="table-column-sub">
            <Select
              defaultValue={data}
              value={list.find((x) => x.idx == row.idx).pickupStatus}
              onChange={(value) => {
                console.log(
                  "idx : " + row.idx + " val : " + value,
                  " row : " + row
                );

                var flag = true;

                // 제약조건 미성립
                // console.log([row.pickupStatus, value]+" / "+modifyType[row.pickupStatus])
                if(!modifyType[row.pickupStatus].includes(value)){
                  Modal.info({
                    content: (
                        <div>
                            상태를 바꿀 수 없습니다.
                        </div>
                    )
                    })
                  flag = false;
                }

                // 대기중 -> 픽업중 변경 시 강제배차 알림
                if (row.pickupStatus == 1 && value == 2){
                  Modal.info({
                    content: (
                        <div>
                            강제배차를 사용하세요.
                        </div>
                    )
                  })
                }

                // 제약조건 성립 시 상태 변경
                if (flag) {
                  list.find(x => x.idx == row.idx).pickupStatus = value;
                  this.setState({
                    list: list,
                  });
                }
              }}
            >
              {deliveryStatusCode.map((value, index) => {
                if (index == 0) return <></>;
                else return <Option value={index}>{value}</Option>;
              })}
            </Select>
          </div>
        ),
      },
      {
        title: '음식준비',
        dataIndex: 'preparationStatus',
        className: 'table-column-center',
        render: data => <div>{preparationStatus[data]}</div>,
      },
      {
        title: "요청 시간",
        dataIndex: "requestTime",
        className: "table-column-center",
        render: (data) => <div>{formatDate(data)}</div>,
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
        render: (data) => <div>{formatDate(data)}</div>,
      },
      {
        title: "완료시간",
        dataIndex: "completionTime",
        className: "table-column-center",
        render: (data) => <div>{formatDate(data)}</div>,
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
        render: (data) => <div>{comma(data)}</div>,
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
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: '결제방식',
        dataIndex: 'paymentMethod',
        className: 'table-column-center',
        render: data => <div>{paymentMethod[data]}</div>,
      },
    ];

    const expandedRowRender = (record) => {
      const dropColumns = [
        {
          title: "수수료",
          dataIndex: "fees",
          className: "table-column-center",
          render: (data) => <div>{comma(data)}</div>,
        },
        {
          title: "거리(km)",
          dataIndex: "distance",
          className: "table-column-center",
        },
        {
          title: '카드상태',
          dataIndex: 'cardStatus',
          className: 'table-column-center',
          render: data => <div>{cardStatus[data]}</div>,
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
          render: (data) => <div>{comma(data)}</div>,
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
          render: (data) => <div>{comma(data)}</div>,
        },
        {
          title: "가맹점 번호",
          dataIndex: "franchisePhoneNum",
          className: "table-column-center",
        },

        {
          title: "가맹점 번호",
          dataIndex: "franchisePhoneNum",
          className: "table-column-center",
        },
        {
          title: "배차",
          dataIndex: "forceLocate",
          className: "table-column-center",
          render: (data) => (
            <span>
              <ForceAllocateDialog
                isOpen={this.state.forceOpen}
                close={this.closeForceingModal}
              />
              <Button className="tabBtn" onClick={this.openForceModal}>
                강제배차
              </Button>
            </span>
          ),
        },
        {
          title: "주문수정",
          dataIndex: "forceLocate",
          className: "table-column-center",
          render: (data) => (
            <span>
              <Button className="tabBtn" onClick={this.openAddCallModal}>
                주문수정
              </Button>
            </span>
          ),
        },
        {
          title: "메세지",
          dataIndex: "franchisePhoneNum",
          className: "table-column-center",
          render: (data) => (
            <span>
              <MessageDialog
                isOpen={this.state.MessageOpen}
                close={this.closeMessageModal}
              />
              <Button className="tabBtn" onClick={this.openMessageModal}>
                라이더
              </Button>
              <MessageDialog
                isOpen={this.state.MessageOpen}
                close={this.closeMessageModal}
              />
              <Button className="tabBtn" onClick={this.openMessageModal}>
                가맹점
              </Button>
            </span>
          ),
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
      <div className="reception-box">
        <div className="btnLayout">
          <TimeDelayDialog
            isOpen={this.state.timeDelayOpen}
            close={this.closeTimeDelayModal}
          />
          <Button
            icon={<FieldTimeOutlined />}
            className="tabBtn delayTab"
            onClick={this.openTimeDelayModal}
          >
            호출설정
          </Button>

          <MapControlDialog
            isOpen={this.state.mapControlOpen}
            close={this.closeMapControlModal}
          />
          <Button
            icon={<EnvironmentFilled />}
            className="tabBtn mapTab"
            onClick={this.openMapControlModal}
            // onClick={() => { this.props.openMapControl() }}
          >
            지도관제
          </Button>

          <SurchargeDialog
            isOpen={this.state.surchargeOpen}
            close={this.closeSurchargeModal}
          />
          <Button
            icon={<DollarCircleOutlined />}
            className="tabBtn surchargeTab"
            onClick={this.openSurchargeModal}
          >
            할증
          </Button>

          <RegistCallDialog
            isOpen={this.state.addCallOpen}
            close={this.closeAddCallModal}
          />
          <Button
            icon={<PhoneOutlined />}
            className="tabBtn registTab"
            onClick={this.openAddCallModal}
          >
            콜등록
          </Button>

          <Button
            icon={<MessageOutlined />}
            className="tabBtn messageTab"
            onClick={this.openMessageModal}
          >
            상담메세지
          </Button>

          <NoticeDialog
            isOpen={this.state.noticeOpen}
            close={this.closeNoticeModal}
          />
          <Button
            icon={<NotificationFilled />}
            className="tabBtn noticeTab"
            onClick={this.openNoticeModal}
          >
            공지사항
          </Button>
        </div>

        <div className="selectLayout">
          <DatePicker
            defaultValue={moment(today, dateFormat)}
            format={dateFormat}
            onChange={(date) => this.setState({ selectedDate: date })}
          />
          <FilteringDialog
            isOpen={this.state.filteringOpen}
            close={this.closeFilteringModal}
          />
          <Button
            icon={<FilterOutlined />}
            className="tabBtn filterTab"
            onClick={this.openFilteringModal}
          >
            필터링 설정
          </Button>

          <Search
            placeholder="가맹점검색"
            enterButton
            allowClear
            onChange={(e) => this.setState({ franchisee: e.target.value })}
            onSearch={this.onSearch}
            style={{
              width: 200,
              marginLeft: 20,
            }}
          />

          <Search
            placeholder="기사명검색"
            enterButton
            allowClear
            onChange={(e) => this.setState({ rider: e.target.value })}
            onSearch={this.onSearch}
            style={{
              width: 200,
              marginLeft: 20,
            }}
          />

          <Search
            placeholder="전화번호검색"
            enterButton
            allowClear
            onChange={(e) => this.setState({ phoneNum: e.target.value })}
            onSearch={this.onSearch}
            style={{
              width: 200,
              marginLeft: 20,
            }}
          />

          <Checkbox onChange={this.handleToggleCompleteCall}></Checkbox>
          <span className="span1">완료조회</span>
        </div>

        <div className="dataTableLayout">
          <Table
            rowKey={record => record}
            rowClassName={record => rowColorName[record.pickupStatus]}
            dataSource={this.state.list}
            columns={columns}
            pagination={false}
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
    );
  }
}

export default ReceptionStatus;
