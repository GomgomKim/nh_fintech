import {
  DatePicker,
  Input,
  Select,
  Button,
  Checkbox,
  Modal,
  Table,
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import TimeDelayDialog from "../../components/dialog/order/TimeDelayDialog";
import FilteringDialog from "../../components/dialog/order/FilteringDialog";
import RegistCallDialog from "../../components/dialog/order/RegistCallDialog";
import SurchargeDialog from "./../../components/dialog/order/SurchargeDialog";
import NoticeDialog from "../../components/dialog/order/NoticeDialog";
import ForceAllocateDialog from "../../components/dialog/order/ForceAllocateDialog";
import MapControlDialog from "../../components/dialog/order/MapControlDialog";
import {
  formatDate,
  formatDateSecond,
  monthFormat,
} from "../../lib/util/dateUtil";
import "../../css/order.css";
import "../../css/common.css";
import { comma } from "../../lib/util/numberUtil";
import {
  deliveryStatusCode,
  modifyType,
  rowColorName,
  paymentMethod,
  cardStatus,
  arriveReqTime,
} from "../../lib/util/codeUtil";
import {
  FieldTimeOutlined,
  DollarCircleOutlined,
  EnvironmentFilled,
  PhoneOutlined,
  MessageOutlined,
  NotificationFilled,
  FilterOutlined,
} from "@ant-design/icons";
import { httpGet, httpPost, httpUrl } from "../../api/httpClient";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import PaymentDialog from "../../components/dialog/order/PaymentDialog";
import SearchRiderDialog from "../../components/dialog/common/SearchRiderDialog";
import ChattingDialog from "../../components/dialog/common/ChattingDialog";
import { customError } from "../../api/Modals";

const Option = Select.Option;
const Search = Input.Search;
const dateFormat = "YYYY/MM/DD";
const today = new Date();

class ReceptionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // paging
      pagination: {
        total: 0,
        current: 1,
        pageSize: 100,
      },
      data: null,

      // modal open / close
      timeDelayOpen: false,
      surchargeOpen: false,
      addCallOpen: false,
      filteringOpen: false,
      noticeOpen: false,
      forceOpen: false,
      MessageOpen: false,
      activeIndex: -1,
      mapControlOpen: false,
      modifyOrder: false,
      paymentOpen: false,
      editable: false,
      orderData: null,
      paymentData: null,

      // data
      list: [],
      totalList: [],
      // api param
      franchisee: "",
      rider: "",
      selectedDate: new Date(1990, 1, 1),
      selectedOrderStatus: [1, 2, 3],
      selectedPaymentMethods: [1, 2, 3],
      checkedCompleteCall: false,

      // 호출설정 branch 정보
      branchInfo: null,
    };
  }

  componentDidMount() {
    this.getList();
    this.getBranch();
  }

  getBranch = () => {
    httpGet(httpUrl.getBranch, [this.props.branchIdx], {})
      .then((res) => {
        if (res.result === "SUCCESS" && res.data) {
          this.setState({ branchInfo: res.data });
        } else {
          console.log("branchInfo error");
        }
      })
      .catch((e) => {
        console.log(e);
      });

    // dummy data (테스트용)
    // this.setState({
    //   branchInfo: {
    //     branchCode: 0,
    //     branchName: "복정1",
    //     deliveryEnabled: false,
    //     pickupAvTime10: true,
    //     pickupAvTime10After: true,
    //     pickupAvTime15: true,
    //     pickupAvTime20: true,
    //     pickupAvTime30: true,
    //     pickupAvTime40: true,
    //     pickupAvTime5: true,
    //     pickupAvTime50: true,
    //     pickupAvTime5After: true,
    //     pickupAvTime60: true,
    //     pickupAvTime70: true,
    //     startDate: "2021-03-03",
    //   },
    // });
  };

  handleToggleCompleteCall = (e) => {
    this.setState(
      {
        checkedCompleteCall: e.target.checked,
      },
      () => {
        if (!this.state.checkedCompleteCall) {
          this.setState(
            {
              selectedDate: new Date(1900, 1, 1),
            },
            () => this.getList()
          );
        } else {
          this.setState(
            {
              selectedDate: today,
            },
            () => this.getCompleteList()
          );
        }
      }
    );
  };

  setDate = (date) => {
    console.log(date);
  };

  onSearch = () => {
    this.getList();
  };

  getList = () => {
    const startDate = this.state.selectedDate;
    const endDate = new moment();
    var data = {
      orderStatuses: this.state.selectedOrderStatus,
      pageNum: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      paymentMethods: this.state.selectedPaymentMethods,
      startDate: formatDate(startDate).split(" ")[0],
      endDate: formatDate(endDate.add("1", "d")).split(" ")[0],
    };
    if (this.state.franchisee) {
      data.frName = this.state.franchisee;
    }
    if (this.state.rider) {
      data.riderName = this.state.rider;
    }
    httpPost(httpUrl.orderList, [], data)
      .then((res) => {
        if (res.result === "SUCCESS") {
          this.setState({
            list: res.data.orders,
          });
        } else {
          Modal.info({
            title: "적용 오류",
            content: "처리가 실패했습니다.",
          });
        }
      })
      .catch((e) => {
        Modal.info({
          title: "적용 오류",
          content: "처리가 실패했습니다.",
        });
      });
  };
  getCompleteList = () => {
    const startDate = this.state.selectedDate;
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 1
    );
    const data = {
      orderStatuses: [4],
      pageNum: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      paymentMethods: [1, 2, 3],
      startDate: formatDate(this.state.selectedDate).split(" ")[0],
      endDate: formatDate(endDate).split(" ")[0],
    };

    if (this.state.franchisee) {
      data.frName = this.state.franchisee;
    }
    if (this.state.rider) {
      data.riderName = this.state.rider;
    }

    console.log(data);

    httpPost(httpUrl.orderList, [], data)
      .then((res) => {
        if (res.result === "SUCCESS") {
          console.log(res);
          this.setState({
            totalList: res.data.orders,
          });
        } else {
          Modal.info({
            title: "적용 오류",
            content: "처리가 실패했습니다.",
          });
        }
      })
      .catch((e) => {
        Modal.info({
          title: "적용 오류",
          content: "처리가 실패했습니다.",
        });
      });
  };

  assignRider = (data, orderIdx) => {
    var self = this;
    Modal.confirm({
      title: "강제배차",
      content: data.riderName + " 라이더 에게 강제배차 하시겠습니까?",
      okText: "확인",
      cancelText: "취소",
      onOk() {
        httpPost(httpUrl.assignRiderAdmin, [], {
          orderIdx: orderIdx,
          userIdx: data.idx,
        }).then((res) => {
          console.log(res);
          if (res.result === "SUCCESS") {
            switch (res.data) {
              case "SUCCESS":
                // console.log(res.result);
                self.getList();
                break;
              case "ALREADY_ASSIGNED":
                customError("배차 오류", "이미 배차된 주문입니다.");
                break;
              case "ORDER_NOT_EXISTS":
                customError("배차 오류", "존재하지 않은 주문입니다.");
                break;
              case "NCASH_MINUS":
                customError("배차 오류", "NCash 잔액이 부족합니다.");
                break;
              case "ASSIGN_LIMIT_EXCEEDED":
                customError("배차 오류", "배차 목록이 가득 찼습니다.");
                break;
              case "NOT_ADMIN":
                customError("배차 오류", "관리자만 강제배차할 수 있습니다.");
                break;
              default:
                customError(
                  "배차 오류",
                  "배차에 실패했습니다. 관리자에게 문의하세요."
                );
                break;
            }
          } else
            customError(
              "배차 오류",
              "배차에 실패했습니다. 관리자에게 문의하세요."
            );
        });
      },
    });
  };

  handleTableChange = (pagination) => {
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

  // handleInfiniteOnLoad = () => {
  //   this.setState(
  //     {
  //       pagination: {
  //         ...this.state.pagination,
  //         pageSize: this.state.pagination.pageSize + 30,
  //       },
  //     },
  //     () => this.getList()
  //   );
  // };

  // 시간지연 dialog
  openTimeDelayModal = () => {
    this.setState({ timeDelayOpen: true });
  };
  closeTimeDelayModal = (value) => {
    this.setState({ timeDelayOpen: false, branchInfo: value });
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
    this.getList();
  };

  // 지도관제
  openMapControlModal = () => {
    this.setState({ mapControlOpen: true });
  };
  closeMapControlModal = () => {
    this.setState({ mapControlOpen: false });
    this.getList();
  };

  // 필터링 dialog
  openFilteringModal = () => {
    this.setState({ filteringOpen: true });
  };
  closeFilteringModal = (selectedOrderStatus, selectedPaymentMethods) => {
    this.setState(
      {
        filteringOpen: false,
        selectedOrderStatus: selectedOrderStatus,
        selectedPaymentMethods: selectedPaymentMethods,
      },
      () => this.getList()
    );
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

  // 주문수정 dialog
  openModifyOrderModal = (order) => {
    this.setState({ data: order, modifyOrder: true });
  };
  closeModifyOrderModal = () => {
    this.setState({ modifyOrder: false });
    this.getList();
  };

  // 주문수정 dialog
  openPaymentModal = (data) => {
    this.setState({ paymentData: data, paymentOpen: true });
  };
  closePaymentModal = () => {
    this.setState({ paymentOpen: false });
    this.getList();
  };

  getStatusVal = (idx) => {
    // console.log("idx : "+idx)
  };

  render() {
    const columns = [
      {
        title: "상태",
        dataIndex: "orderStatus",
        className: "table-column-center",
        render: (data, row) => (
          <div className="table-column-sub">
            <Select
              defaultValue={data}
              value={row.orderStatus}
              onChange={(value) => {
                // 제약조건 미성립
                // console.log([row.pickupStatus, value]+" / "+modifyType[row.pickupStatus])
                if (!modifyType[row.orderStatus].includes(value)) {
                  Modal.info({
                    content: <div>상태를 바꿀 수 없습니다.</div>,
                  });
                  return;
                }
                // 대기중 -> 픽업중 변경 시 강제배차 알림
                if (row.orderStatus === 1 && value === 2) {
                  Modal.info({
                    content: <div>강제배차를 사용하세요.</div>,
                  });
                  return;
                }
                // 제약조건 성립 시 상태 변경
                // const list = this.state.list;
                // list.find((x) => x.idx === row.idx).orderStatus = value;
                row.orderStatus = value;
                if (value === 3) {
                  console.log("#############################################");
                  console.log(row);
                  const now = new moment();
                  row.pickupDate = formatDateSecond(now);
                } else if (value === 4) {
                  console.log("#############################################");
                  console.log(row);
                  const now = new moment();
                  row.completeDate = formatDateSecond(now);
                }
                httpPost(httpUrl.orderUpdate, [], row)
                  .then((res) => {
                    if (res.result === "SUCCESS") this.getList();
                  })
                  .catch((e) => {});
              }}
            >
              {deliveryStatusCode.map((value, index) => {
                if (index === 0) return <></>;
                else return <Option value={index}>{value}</Option>;
              })}
            </Select>
          </div>
        ),
      },
      {
        title: "요청시간",
        dataIndex: "arriveReqTime",
        className: "table-column-center",
        render: (data) => <div>{arriveReqTime[data]}</div>,
      },
      {
        title: "음식준비",
        dataIndex: "itemPrepared",
        className: "table-column-center",
        render: (data) => <div>{data ? "완료" : "준비중"}</div>,
      },
      // {
      //   title: "경과(분)",
      //   dataIndex: "elapsedTime",
      //   className: "table-column-center",
      // },
      {
        title: "픽업시간",
        dataIndex: "pickupDate",
        className: "table-column-center",
        render: (data, row) => (
          <div>{row.orderStatus >= 3 ? formatDate(data) : "-"}</div>
        ),
      },
      // {
      //   title: "완료시간",
      //   dataIndex: "completeDate",
      //   className: "table-column-center",
      //   render: (data, row) => (
      //     <div>{row.orderStatus === 4 ? formatDate(data) : "-"}</div>
      //   ),
      // },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center",
        render: (data, row) => <div>{row.orderStatus >= 2 ? data : "-"}</div>,
      },
      {
        title: "기사 연락처",
        dataIndex: "riderPhone",
        className: "table-column-center",
        render: (data, row) => <div>{row.orderStatus >= 2 ? data : "-"}</div>,
      },
      {
        title: "도착지",
        // dataIndex: "destAddr1",
        className: "table-column-center",
        render: (data, row) => (
          <div className="arriveArea">
            {row.destAddr1 + " " + row.destAddr2}
          </div>
        ),
      },
      {
        title: "거리(km)",
        dataIndex: "distance",
        className: "table-column-center",
      },
      // antd 찾아봐야 될 듯
      // orderPayments - paymentMethod 라서 dataIndex 설정 필요
      {
        title: "가맹점명",
        dataIndex: "frName",
        className: "table-column-center",
      },
      {
        title: "가맹점 번호",
        dataIndex: "frPhone",
        className: "table-column-center",
      },
      {
        title: "가격",
        dataIndex: "orderPrice",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: "총배달요금",
        dataIndex: "deliveryPrice",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: "기본배달요금",
        dataIndex: "basicDeliveryPrice",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>,
      },

      {
        title: "할증배달요금",
        dataIndex: "extraDeliveryPrice",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>,
      },

      {
        title: "결제방식",
        dataIndex: "orderPayments",
        className: "table-column-center",
        render: (data, row) =>
          data.length > 1 ? (
            <Button
              onClick={() => this.openPaymentModal(data)}
              close={this.closePaymentModal}
            >
              보기
            </Button>
          ) : (
            <div>{paymentMethod[data[0]["paymentMethod"]]}</div>
          ),
      },
    ];

    const expandedRowRender = (record) => {
      const dropColumns = [
        // {
        //   title: "수수료",
        //   dataIndex: "deliveryPriceFee",
        //   className: "table-column-center",
        //   render: (data) => <div>{comma(data)}</div>,
        // },
        // 내용 확인 필요
        // {
        //   title: "카드상태",
        //   dataIndex: "cardStatus",
        //   className: "table-column-center",
        //   render: (data) => <div>{cardStatus[data]}</div>,
        // },
        // // 내용 확인 필요
        // {
        //   title: "승인번호",
        //   dataIndex: "authNum",
        //   className: "table-column-center",
        // },
        // {
        //   title: "카드사",
        //   dataIndex: "businessCardName",
        //   className: "table-column-center",
        // },
        // {
        //   title: "지사명",
        //   dataIndex: "frName",
        //   className: "table-column-center",
        // },
        // orderPayments - paymentAmount
        // {
        //   title: "카드승인금액",
        //   dataIndex: "orderPayments",
        //   className: "table-column-center",
        //   render: (data) => <div>{comma(data[0]["paymentAmount"])}</div>,
        // },
        // 내용 확인 필요
        // {
        //   title: "변경내역",
        //   dataIndex: "cancelReason",
        //   className: "table-column-center",
        // },
        // 내용 확인 필요
        // 내용 확인 필요
        // {
        //   title: "접수건수",
        //   dataIndex: "receiptAmount",
        //   className: "table-column-center",
        //   render: (data) => <div>{comma(data)}</div>,
        // },
        // 아마도 중복컬럼?

        // 모양 맞추기
        {
          title: "",
          render: () => <div style={{ width: "800px" }}></div>,
        },
        {
          title: "배차",
          dataIndex: "forceLocate",
          className: "table-column-center",
          render: (data, row) => (
            <span>
              {/* <ForceAllocateDialog */}
              {this.state.forceOpen && (
                <SearchRiderDialog
                  close={this.closeForceingModal}
                  callback={(data) => this.assignRider(data, row.idx)}
                />
              )}
              <Button className="tabBtn" onClick={this.openForceModal}>
                강제배차
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
              <Button className="tabBtn" onClick={this.openMessageModal}>
                라이더
              </Button>
              <Button className="tabBtn" onClick={this.openMessageModal}>
                가맹점
              </Button>
            </span>
          ),
        },
        {
          title: "주문수정",
          dataIndex: "updateOrder",
          className: "table-column-center",
          render: (data, row) => (
            <Button
              onClick={() => {
                this.openModifyOrderModal(row);
              }}
            >
              수정
            </Button>
          ),
        },

        // {
        //   title: "가맹점명",
        //   dataIndex: "frName",
        //   className: "table-column-center",
        // },
        // {
        //   title: "가맹점 번호",
        //   dataIndex: "frPhone",
        //   className: "table-column-center",
        // },
        // {
        //   title: "가격",
        //   dataIndex: "orderPrice",
        //   className: "table-column-center",
        //   render: (data) => <div>{comma(data)}</div>,
        // },
        // {
        //   title: "배달요금",
        //   dataIndex: "deliveryPrice",
        //   className: "table-column-center",
        //   render: (data) => <div>{comma(data)}</div>,
        // },
        // {
        //   title: "결제방식",
        //   dataIndex: "orderPayments",
        //   className: "table-column-center",
        //   render: (data, row) =>
        //     data.length > 1 ? (
        //       <>
        //         <PaymentDialog
        //           isOpen={this.state.paymentOpen}
        //           close={this.closePaymentModal}
        //           orderPayments={data}
        //         />
        //         <Button onClick={this.openPaymentModal} close={this.clos}>
        //           보기
        //         </Button>
        //       </>
        //     ) : (
        //       <div>{paymentMethod[data[0]["paymentMethod"]]}</div>
        //     ),
        // },
        // {
        //   title: "배차",
        //   dataIndex: "forceLocate",
        //   className: "table-column-center",
        //   render: (data, row) => (
        //     <span>
        //       {/* <ForceAllocateDialog */}
        //       {this.state.forceOpen && (
        //         <SearchRiderDialog
        //           close={this.closeForceingModal}
        //           callback={(data) => this.assignRider(data, row.idx)}
        //         />
        //       )}
        //       <Button className="tabBtn" onClick={this.openForceModal}>
        //         강제배차
        //       </Button>
        //     </span>
        //   ),
        // },
        // {
        //   title: "메세지",
        //   dataIndex: "franchisePhoneNum",
        //   className: "table-column-center",
        //   render: (data) => (
        //     <span>
        //       <Button className="tabBtn" onClick={this.openMessageModal}>
        //         라이더
        //       </Button>
        //       <Button className="tabBtn" onClick={this.openMessageModal}>
        //         가맹점
        //       </Button>
        //     </span>
        //   ),
        // },
      ];
      return (
        <Table
          rowKey={(record) => `record: ${record.idx}`}
          columns={dropColumns}
          dataSource={[record]}
          pagination={false}
          scroll
        />
      );
    };

    return (
      <div className="reception-box">
        {this.state.paymentOpen && (
          <PaymentDialog
            close={this.closePaymentModal}
            orderPayments={this.state.paymentData}
          />
        )}
        {this.state.MessageOpen && (
          <ChattingDialog close={this.closeMessageModal} />
        )}

        {this.state.addCallOpen && (
          <RegistCallDialog close={this.closeAddCallModal} />
        )}

        {this.state.modifyOrder && (
          <RegistCallDialog
            close={this.closeModifyOrderModal}
            editable={this.state.editable}
            data={this.state.data}
            getList={this.getList}
          />
        )}

        <div className="btnLayout">
          {this.state.timeDelayOpen && (
            <TimeDelayDialog
              branchInfo={this.state.branchInfo}
              close={this.closeTimeDelayModal}
            />
          )}
          <Button
            icon={<FieldTimeOutlined />}
            className="tabBtn delayTab"
            onClick={this.openTimeDelayModal}
          >
            호출설정
          </Button>
          {this.state.mapControlOpen && (
            <MapControlDialog
              getList={this.getList}
              callData={this.state.list}
              close={this.closeMapControlModal}
            />
          )}
          <Button
            icon={<EnvironmentFilled />}
            className="tabBtn mapTab"
            onClick={this.openMapControlModal}
            // onClick={() => { this.props.openMapControl() }}
          >
            지도관제
          </Button>
          {this.state.surchargeOpen && (
            <SurchargeDialog close={this.closeSurchargeModal} />
          )}
          <Button
            icon={<DollarCircleOutlined />}
            className="tabBtn surchargeTab"
            onClick={this.openSurchargeModal}
          >
            할증
          </Button>
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
          {this.state.noticeOpen && (
            <NoticeDialog close={this.closeNoticeModal} />
          )}
          <Button
            icon={<NotificationFilled />}
            className="tabBtn noticeTab"
            onClick={this.openNoticeModal}
          >
            공지사항
          </Button>
        </div>

        <div className="selectLayout">
          <Search
            placeholder="가맹점검색"
            enterButton
            allowClear
            onChange={(e) => this.setState({ franchisee: e.target.value })}
            onSearch={this.onSearch}
            style={{
              width: 200,
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
          <FilteringDialog
            isOpen={this.state.filteringOpen}
            close={this.closeFilteringModal}
            selectedOrderStatus={this.state.selectedOrderStatus}
            selectedPaymentMethods={this.state.selectedPaymentMethods}
          />
          {!this.state.checkedCompleteCall && (
            <Button
              icon={<FilterOutlined />}
              className="tabBtn filterTab"
              onClick={this.openFilteringModal}
            >
              필터링 설정
            </Button>
          )}
          {this.state.checkedCompleteCall && (
            <DatePicker
              style={{ marginLeft: 20 }}
              defaultValue={moment(today, dateFormat)}
              format={dateFormat}
              onChange={(date) => {
                if (date) {
                  const newDate = new Date(
                    date.get("year"),
                    date.get("month"),
                    date.get("date")
                  );

                  this.setState(
                    { selectedDate: newDate },
                    () => {
                      this.getCompleteList();
                    },
                    () => console.log(this.state.selectedDate)
                  );
                }
              }}
            />
          )}
          <Checkbox
            defaultChecked={this.state.checkedCompleteCall ? "checked" : ""}
            onChange={this.handleToggleCompleteCall}
          ></Checkbox>
          <span className="span1">완료조회</span>
        </div>
        {/* <InfiniteScroll
          dataLength={this.state.pagination.pageSize}
          next={this.handleInfiniteOnLoad}
          inverse={true}
          // hasMore={!this.chatMessageEnd}
          scrollableTarget="reception-table"
        > */}
        <div className="dataTableLayout">
          <Table
            rowKey={(record) => record.idx}
            id="reception-table"
            rowClassName={(record) => rowColorName[record.orderStatus]}
            dataSource={
              this.state.checkedCompleteCall
                ? this.state.totalList
                : this.state.list
            }
            columns={columns}
            pagination={false}
            onChange={this.handleTableChange}
            expandedRowRender={expandedRowRender}
            scroll
          />
        </div>
        {/* </InfiniteScroll> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <Button
            onClick={() => {
              this.setState(
                {
                  pagination: {
                    ...this.state.pagination,
                    pageSize: this.state.pagination.pageSize + 30,
                  },
                },
                () => this.getList()
              );
            }}
          >
            더 보기
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  branchIdx: state.login.loginInfo.branchIdx,
  info: state,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceptionStatus);
