import {
  DollarCircleOutlined,
  EnvironmentFilled,
  FieldTimeOutlined,
  MessageOutlined,
  NotificationFilled,
  PhoneOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Popover,
  Select,
  Table,
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  httpGet,
  httpPost,
  httpPostWithNoLoading,
  httpUrl,
} from "../../api/httpClient";
import { customError } from "../../api/Modals";
import ChattingCurrentRoom from "../../components/dialog/common/ChattingCurrentRoom";
import ChattingDialog from "../../components/dialog/common/ChattingDialog";
import SearchRiderDialog from "../../components/dialog/common/SearchRiderDialog";
import BlindControlDialog from "../../components/dialog/franchise/BlindControlDialog";
import DeliveryZoneDialog from "../../components/dialog/order/DeliveryZoneDialog";
import MapControlDialog from "../../components/dialog/order/MapControlDialog";
import NoticeDialog from "../../components/dialog/order/NoticeDialog";
import PaymentDialog from "../../components/dialog/order/PaymentDialog";
import RegistCallDialog from "../../components/dialog/order/RegistCallDialog";
import TimeDelayDialog from "../../components/dialog/order/TimeDelayDialog";
import SendSnsDialog from "../../components/dialog/rider/SendSnsDialog";
import "../../css/common.css";
import "../../css/common_m.css";
import "../../css/order.css";
import "../../css/order_m.css";
import {
  arriveReqTime,
  deliveryStatusCode,
  modifyType,
  paymentMethod,
  rowColorName,
} from "../../lib/util/codeUtil";
import { formatDate, formatDateToDay } from "../../lib/util/dateUtil";
import { comma, remainTime } from "../../lib/util/numberUtil";
import SurchargeDialog from "./../../components/dialog/order/SurchargeDialog";

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
      totalPagination: {
        total: 0,
        current: 1,
        pageSize: 10000,
      },
      newPagination: {
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
      directMessageOpen: false,
      sendSnsOpen: false,
      activeIndex: -1,
      mapControlOpen: false,
      modifyOrder: false,
      paymentOpen: false,
      editable: false,
      orderData: null,
      paymentData: null,
      deliveryZone: false,

      // data
      list: [],
      totalList: [],
      // api param
      franchisee: "",
      rider: "",
      selectedDate: new Date(1990, 1, 1),
      selectedOrderStatus: [1, 2, 3],
      selectedCompleteStatus: [4, 5],
      selectedPaymentMethods: [1, 2, 3],
      checkedCompleteCall: false,

      // 호출설정 branch 정보
      branchInfo: null,
      pullingInterval: 5000,

      messageTarget: null,
      messageTargetName: null,
      messageTargetLevel: null,

      totalCancel: 0,
      totalComplete: 0,

      orderStatus: [
        {
          key: "orderStatus-1",
          value: 1,
          text: "접수",
        },
        {
          key: "orderStatus-2",
          value: 2,
          text: "배차",
        },
        {
          key: "orderStatus-3",
          value: 3,
          text: "픽업",
        },
      ],
      completeStatus: [
        {
          key: "orderStatus-4",
          value: 4,
          text: "완료",
        },
        {
          key: "orderStatus-5",
          value: 5,
          text: "취소",
        },
      ],
      paymentMethod: [
        {
          key: "paymentMethod-1",
          value: 1,
          text: "카드",
        },
        {
          key: "paymentMethod-2",
          value: 2,
          text: "현금",
        },
        {
          key: "paymentMethod-3",
          value: 3,
          text: "선결",
        },
      ],
      selectedOrderStatus: [1, 2, 3],
      selectedPaymentMethods: [1, 2, 3],

      // 강제배차 주문 지정
      forceAllocateOrder: {},
    };
  }

  componentDidMount() {
    this.getList();
    this.pollingList = setInterval(
      this.pollingFunction,
      this.state.pullingInterval
    );
  }

  componentWillUnmount() {
    if (this.pollingList) clearInterval(this.pollingList);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedOrderStatus !== prevState.selectedOrderStatus ||
      this.state.selectedPaymentMethods !== prevState.selectedPaymentMethods ||
      this.state.selectedCompleteStatus !== prevState.selectedCompleteStatus
    ) {
      this.getList();
      this.getCompleteList();
    }
  }

  // pollingList = setInterval(this.getList, 5000);

  pollingFunction = () => {
    this.state.checkedCompleteCall ? this.getCompleteList() : this.getList();
  };

  getList = () => {
    // console.log("getlist");
    try {
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
      // console.log(data);
      httpPostWithNoLoading(httpUrl.orderList, [], data)
        .then((res) => {
          if (res.result === "SUCCESS") {
            // console.log(res);
            this.setState({
              list: res.data.orders,
              pagination: {
                ...this.state.pagination,
                total: res.data.totalCount,
              },
            });
          } else {
            console.log("polling Error");
            return;
          }
        })
        .catch((e) => {
          console.log("polling Error");
          console.log(e);
          throw e;
        });
    } catch (e) {}
  };
  getCompleteList = () => {
    console.log("getcompletelist");

    const startDate = this.state.selectedDate;
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 1
    );
    var data = {
      orderStatuses: this.state.selectedCompleteStatus,
      pageNum: this.state.totalPagination.current,
      pageSize: this.state.totalPagination.pageSize,
      paymentMethods: this.state.selectedPaymentMethods,
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
    httpPostWithNoLoading(httpUrl.orderList, [], data)
      .then((res) => {
        if (res.result === "SUCCESS") {
          console.log(res);
          this.setState({
            totalList: res.data.orders,
            totalPagination: {
              ...this.state.totalPagination,
              total: res.data.totalCount,
            },
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
            () => {
              this.getCompleteList();
              this.completedTotal();
              this.canceledTotal();
            }
          );
        }
      }
    );
  };

  setDate = (date) => {
    console.log(date);
  };

  onSearch = () => {
    if (this.state.checkedCompleteCall) {
      this.getCompleteList();
    } else {
      this.getList();
    }
  };

  canceledTotal = () => {
    httpGet(
      httpUrl.canceledCount,
      [moment(this.state.selectedDate).format("YYYY-MM-DD")],
      {}
    )
      .then((res) => {
        this.setState({ totalCancel: res.data });
      })
      .catch((e) => {
        customError(
          "취소건수 에러",
          "에러가 발생하여 취소건수를 불러올수 없습니다."
        );
      });
  };

  completedTotal = () => {
    console.log("QQQ " + this.state.selectedDate);
    httpGet(
      httpUrl.completedCount,
      [moment(this.state.selectedDate).format("YYYY-MM-DD")],
      {}
    )
      .then((res) => {
        this.setState({ totalComplete: res.data });
      })
      .catch((e) => {
        customError(
          "완료건수 에러",
          "에러가 발생하여 완료건수를 불러올수 없습니다."
        );
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
        console.log({
          orderIdx: self.state.forceAllocateOrder.idx,
          userIdx: data.idx,
        });
        httpPost(httpUrl.assignRiderAdmin, [], {
          orderIdx: self.state.forceAllocateOrder.idx,
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

  handleTableChange = (newPagination, sorter) => {
    console.log("various parameters", newPagination, sorter);
    const pager = { ...this.state.newPagination };
    pager.current = newPagination.current;
    pager.pageSize = newPagination.pageSize;
    this.setState(
      {
        newPagination: pager,
      },
      () => this.getCompleteList()
    );
  };

  // 호출지역 dialog
  openDeliveryZoneModal = () => {
    this.setState({ deliveryZone: true });
  };
  closeDeliveryZoneModal = () => {
    this.setState({ deliveryZone: false });
  };

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

  // 블라인드관리 dialog
  openBlindControlModal = () => {
    this.setState({ blindControlOpen: true });
  };
  closeBlindControlModal = () => {
    this.setState({ blindControlOpen: false });
  };

  // 강제배차 dialog
  openForceModal = (forceAllocateOrder) => {
    this.setState({ forceOpen: true, forceAllocateOrder }, () => {
      console.log("this.state.forceAllocateOrder");
      console.log(this.state.forceAllocateOrder);
    });
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

  // 개인 메세지 dialog
  openDirectMessageModal = (idx, name, riderLevel) => {
    this.setState(
      {
        messageTarget: idx,
        messageTargetName: name,
        messageTargetLevel: riderLevel,
      },
      () => this.setState({ directMessageOpen: true })
    );
  };
  closeDirectMessageModal = () => {
    this.setState({
      directMessageOpen: false,
      messageTarget: null,
      messageTargetLevel: null,
    });
  };

  // sns dialog
  openSendSnsModal = () => {
    this.setState({ sendSnsOpen: true });
  };
  closeSendSnsModal = () => {
    this.setState({ sendSnsOpen: false });
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
  openPaymentModal = (data, row) => {
    this.setState({
      paymentData: data,
      orderPrice: row.orderPrice,
      paymentOpen: true,
    });
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
        title: "주문번호",
        dataIndex: "idx",
        className: "table-column-center desk",
        // key: (row) => `idx:${row.idx}`,
        sorter: (a, b) => a.idx - b.idx,
        render: (data) => <div>{data}</div>,
      },

      {
        title: "주문내용",
        dataIndex: "idx",
        className: "table-column-center mobile",
        render: (data, row) => {
          let remainTimeString = "";

          if (row.orderStatus == 5) remainTimeString = "";
          //취소는 남은시간 없음
          else if (row.orderStatus == 4) {
            //완료는 요청시간에서 완료시간까지 계산
            if (row.arriveReqTime > 1000) {
              //배차후 주문 처리
              const arriveReqDate = moment(row.assignDate).add(
                row.arriveReqTime % 1000,
                "minutes"
              );
              const time = arriveReqDate.diff(
                moment(row.completeDate),
                "minutes"
              );
              return (remainTimeString = time + "분");
            } else {
              const arriveReqDate = moment(row.orderDate).add(
                row.arriveReqTime,
                "minutes"
              );
              const time = arriveReqDate.diff(
                moment(row.completeDate),
                "minutes"
              );
              return (remainTimeString = time + "분");
            }
          } else {
            //진행중
            if (row.arriveReqTime > 1000) {
              if (row.orderStatus == 1) remainTimeString = "";
              else
                remainTimeString =
                  remainTime(row.assignDate, row.arriveReqTime % 1000) + "분";
            } else
              remainTimeString =
                remainTime(row.orderDate, row.arriveReqTime) + "분";
          }

          return (
            <div className="status-box">
              <p>
                No.{row.idx} / {row.frName} / {arriveReqTime[row.arriveReqTime]}{" "}
                / {remainTimeString}{" "}
                {/* {row.itemPrepared ? "완료" : "준비중"} <br />{" "} */}
              </p>
              {row.destAddr1 + " " + row.destAddr2} <br />
              {row.riderName} / {comma(row.distance)}m /{" "}
              {
                paymentMethod[
                  row.orderPayments[0]
                    ? row.orderPayments[0]["paymentMethod"]
                    : 0
                ]
              }
              <br />
              <div className="table-column-sub">
                상태 :{" "}
                <Select
                  style={{ marginRight: 5 }}
                  defaultValue={data}
                  value={row.orderStatus}
                  onChange={(value) => {
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
                    // 픽업 -> 접수 변경 시 배차상태로 변경 알림
                    if (row.orderStatus === 3 && value === 1) {
                      Modal.info({
                        content: (
                          <div>
                            배차상태로 먼저 변경한 후 접수로 변경해주세요.
                          </div>
                        ),
                      });
                      return;
                    }

                    //완료를 복원시키는 경우
                    if (row.orderStatus === 4 && value === 3) {
                      const self = this;
                      Modal.confirm({
                        title: "주문복구",
                        content:
                          "주문을 복구하는 경우 라이더에게 지급된 가맹점 배달료도 북구됩니다. 정말 복구하시겠습니까?",
                        okText: "확인",
                        cancelText: "취소",
                        onOk() {
                          httpPost(httpUrl.orderCompleteRestore, [], {
                            orderIdx: row.idx,
                          }).then((res) => {
                            if (
                              res.result === "SUCCESS" &&
                              res.data === "SUCCESS"
                            ) {
                              // Modal.info({
                              //   title: "변경 성공",
                              //   content: "주문상태가 변경되었습니다.",
                              // });
                              self.getList();
                            } else {
                              Modal.info({
                                title: "변경 실패",
                                content: "주문상태 변경에 실패했습니다.",
                              });
                            }
                          });
                        },
                      });
                      return;
                    }

                    const orderStatuseChangeApiCode = [
                      "",
                      httpUrl.orderAssignCancel,
                      httpUrl.orderPickupCancel,
                      httpUrl.orderPickup,
                      httpUrl.orderComplete,
                      httpUrl.orderCancel,
                    ];

                    httpPost(orderStatuseChangeApiCode[value], [], {
                      orderIdx: row.idx,
                    })
                      .then((res) => {
                        if (
                          res.result === "SUCCESS" &&
                          res.data === "SUCCESS"
                        ) {
                          // Modal.info({
                          //   title: "변경 성공",
                          //   content: "주문상태가 변경되었습니다.",
                          // });
                          this.getList();
                        } else {
                          Modal.info({
                            title: "변경 실패",
                            content: "주문상태 변경에 실패했습니다.",
                          });
                        }
                      })
                      .catch((e) => {
                        Modal.info({
                          title: "변경 실패",
                          content: "주문상태 변경에 실패했습니다.",
                        });

                        throw e;
                      });
                  }}
                >
                  {deliveryStatusCode.map((value, index) => {
                    if (index === 0) return <></>;
                    else
                      return (
                        <Option key={index} value={index}>
                          {value}
                        </Option>
                      );
                  })}
                </Select>
              </div>
              {""}
              <div className="table-column-sub">
                {/* <ForceAllocateDialog */}
                <Button
                  style={{ marginLeft: 5 }}
                  className="tabBtn"
                  onClick={() => this.openForceModal(row)}
                >
                  강제배차
                </Button>
              </div>
              <div className="table-column-sub">
                <Button
                  style={{ marginLeft: 10 }}
                  className="tabBtn"
                  onClick={() => {
                    this.openModifyOrderModal(row);
                  }}
                >
                  주문수정
                </Button>
              </div>
            </div>
          );
        },
      },
      {
        title: "상태",
        dataIndex: "orderStatus",
        className: "table-column-center desk",
        key: (row) => `orderStatus:${row.orderStatus}`,
        // filters: [
        //   {
        //     text: "접수",
        //     value: 1,
        //   },
        //   {
        //     text: "배차",
        //     value: 2,
        //   },
        //   {
        //     text: "픽업",
        //     value: 3,
        //   },

        //   {
        //     text: "완료",
        //     value: 4,
        //   },

        //   {
        //     text: "취소",
        //     value: 5,
        //   },
        // ],
        // onFilter: (value, record) => value === record.orderStatus,
        render: (data, row) => (
          <div className="table-column-sub">
            <Select
              defaultValue={data}
              value={row.orderStatus}
              onChange={(value) => {
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
                // 픽업 -> 접수 변경 시 배차상태로 변경 알림
                if (row.orderStatus === 3 && value === 1) {
                  Modal.info({
                    content: (
                      <div>배차상태로 먼저 변경한 후 접수로 변경해주세요.</div>
                    ),
                  });
                  return;
                }

                //완료를 복원시키는 경우
                if (row.orderStatus === 4 && value === 3) {
                  const self = this;
                  Modal.confirm({
                    title: "주문복구",
                    content:
                      "주문을 복구하는 경우 라이더에게 지급된 가맹점 배달료도 북구됩니다. 정말 복구하시겠습니까?",
                    okText: "확인",
                    cancelText: "취소",
                    onOk() {
                      httpPost(httpUrl.orderCompleteRestore, [], {
                        orderIdx: row.idx,
                      }).then((res) => {
                        if (
                          res.result === "SUCCESS" &&
                          res.data === "SUCCESS"
                        ) {
                          // Modal.info({
                          //   title: "변경 성공",
                          //   content: "주문상태가 변경되었습니다.",
                          // });
                          self.getList();
                        } else {
                          Modal.info({
                            title: "변경 실패",
                            content: "주문상태 변경에 실패했습니다.",
                          });
                        }
                      });
                    },
                  });
                  return;
                }
                const orderStatuseChangeApiCode = [
                  "",
                  httpUrl.orderAssignCancel,
                  httpUrl.orderPickupCancel,
                  httpUrl.orderPickup,
                  httpUrl.orderComplete,
                  httpUrl.orderCancel,
                ];

                httpPost(orderStatuseChangeApiCode[value], [], {
                  orderIdx: row.idx,
                })
                  .then((res) => {
                    if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                      // Modal.info({
                      //   title: "변경 성공",
                      //   content: "주문상태가 변경되었습니다.",
                      // });
                      this.getList();
                    } else {
                      Modal.info({
                        title: "변경 실패",
                        content: "주문상태 변경에 실패했습니다.",
                      });
                    }
                  })
                  .catch((e) => {
                    Modal.info({
                      title: "변경 실패",
                      content: "주문상태 변경에 실패했습니다.",
                    });

                    throw e;
                  });
              }}
            >
              {deliveryStatusCode.map((value, index) => {
                if (index === 0) return <></>;
                else
                  return (
                    <Option key={index} value={index}>
                      {value}
                    </Option>
                  );
              })}
            </Select>
          </div>
        ),
      },
      {
        title: "요청시간",
        dataIndex: "arriveReqTime",
        className: "table-column-center desk",
        // key: (row) => `arriveReqTime:${row.arriveReqTime}`,
        sorter: (a, b) => a.arriveReqTime - b.arriveReqTime,
        render: (data) => <div>{arriveReqTime[data]}</div>,
      },
      {
        title: "남은시간",
        dataIndex: "arriveReqTime",
        className: "table-column-center desk",
        key: (row) => `remainTime:${row.idx}`,
        sorter: (a, b) =>
          remainTime(a.orderDate, a.arriveReqTime) -
          remainTime(b.orderDate, b.arriveReqTime),
        render: (data, row) => {
          if (row.orderStatus == 5) return <div></div>;
          //취소는 남은시간 없음
          else if (row.orderStatus == 4) {
            //완료는 요청시간에서 완료시간까지 계산
            if (row.arriveReqTime > 1000) {
              //배차후 주문 처리
              const arriveReqDate = moment(row.assignDate).add(
                row.arriveReqTime % 1000,
                "minutes"
              );
              const time = arriveReqDate.diff(
                moment(row.completeDate),
                "minutes"
              );
              return <div>{time}분</div>;
            } else {
              const arriveReqDate = moment(row.orderDate).add(
                row.arriveReqTime,
                "minutes"
              );
              const time = arriveReqDate.diff(
                moment(row.completeDate),
                "minutes"
              );
              return <div>{time}분</div>;
            }
          } else {
            //진행중
            if (row.arriveReqTime > 1000) {
              //배차후 주문 처리
              if (row.orderStatus == 1) return <div></div>;
              else
                return (
                  <div>
                    {remainTime(row.assignDate, row.arriveReqTime % 1000)}분
                  </div>
                );
            } else
              return (
                <div>{remainTime(row.orderDate, row.arriveReqTime)}분</div>
              );
          }
        },
      },
      {
        title: "음식준비",
        dataIndex: "itemPrepared",
        className: "table-column-center desk",
        // key: (row) => `itemPrepared:${row.itemPrepared}`,
        sorter: (a, b) => a.itemPrepared - b.itemPrepared,
        // filters: [
        //   {
        //     text: "준비중",
        //     value: false,
        //   },
        //   {
        //     text: "완료",
        //     value: true,
        //   },
        // ],
        // onFilter: (value, record) => value === record.itemPrepared,
        render: (data) => <div>{data ? "완료" : "준비중"}</div>,
      },
      // {
      //   title: "경과(분)",
      //   dataIndex: "elapsedTime",
      //   className: "table-column-center",
      // },

      {
        title: "가맹점명",
        dataIndex: "frName",
        className: "table-column-center desk",
        // key: (row) => `frName:${row.frName}`,
        sorter: (a, b) => a.frName.localeCompare(b.frName),

        render: (data, row) => {
          const content = (
            <div>
              <p>{row.frPhone}</p>
            </div>
          );
          return (
            <Popover content={content} title="가맹점연락처">
              <div>{data} </div>
            </Popover>
          );
        },
      },
      {
        title: "접수시간",
        dataIndex: "orderDate",
        className: "table-column-center desk",
        // key: (row) => `orderDate:${row.orderDate}`,
        sorter: (a, b) => moment(a.orderDate) - moment(b.orderDate),
        render: (data, row) => <div>{data}</div>,
      },
      // {
      //   title: "완료시간",
      //   dataIndex: "completeDate",
      //   className: "table-column-center",
      //   render: (data, row) => (
      //     <div>{row.orderStatus === 4 ? formatDate(data) : "-"}</div>
      //   ),
      // },
      // {
      //   title: "기사 연락처",
      //   dataIndex: "riderPhone",
      //   className: "table-column-center",
      //   render: (data, row) => <div>{row.orderStatus >= 2 ? data : "-"}</div>,
      // },
      {
        title: "도착지",
        // dataIndex: "destAddr1",
        className: "table-column-center desk",
        // key: (row) => `destAddr1:${row.destAddr1}`,
        sorter: (a, b) =>
          (a.destAddr1 + a.destAddr2).localeCompare(b.destAddr1 + b.destAddr2),
        render: (data, row) => (
          <div className="arriveArea">
            {row.destAddr1 + " " + row.destAddr2}
          </div>
        ),
      },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center desk",
        // key: (row) => `riderName:${row.riderName}`,
        // sorter: (a, b) => {
        //   console.log(a);
        //   console.log(b);
        //   a.riderName.localeCompare(b.riderName);
        // },
        sorter: (a, b) => {
          const dataA = (a.riderName || "").trim();
          const dataB = (b.riderName || "").trim();
          return dataA.localeCompare(dataB);
        },
        render: (data, row) => {
          const content = (
            <div>
              <p>{row.riderPhone}</p>
            </div>
          );
          return (
            <Popover content={content} title="기사연락처">
              <div>{row.orderStatus >= 2 ? data : "-"} </div>
            </Popover>
          );
        },
      },

      // antd 찾아봐야 될 듯
      // orderPayments - paymentMethod 라서 dataIndex 설정 필요
      // {
      //   title: "가맹점명",
      //   dataIndex: "frName",
      //   className: "table-column-center",
      // },
      {
        title: "가격",
        dataIndex: "orderPrice",
        className: "table-column-center desk",
        // key: (row) => `orderPrice:${row.orderPrice}`,
        sorter: (a, b) => a.orderPrice - b.orderPrice,
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: "배달요금",
        dataIndex: "deliveryPrice",
        className: "table-column-center desk",
        // key: (row) => `deliveryPrice:${row.deliveryPrice}`,
        sorter: (a, b) => a.deliveryPrice - b.deliveryPrice,
        render: (data, row) => (
          <div>
            {comma(data)}
            <br />({comma(row.basicDeliveryPrice)} +{" "}
            {comma(row.extraDeliveryPrice)})
          </div>
        ),
      },

      {
        title: "결제방식",
        dataIndex: "orderPayments",
        className: "table-column-center desk",
        key: (row) => `orderPayments:${row.orderPayments}`,
        render: (data, row) =>
          data.length > 1 ? (
            <Button
              onClick={() => this.openPaymentModal(data, row)}
              // close={this.closePaymentModal}
            >
              보기
            </Button>
          ) : (
            <div>{paymentMethod[data[0] ? data[0]["paymentMethod"] : 0]}</div>
          ),
      },
      {
        title: "배차시간",
        dataIndex: "assignDate",
        className: "table-column-center desk",
        // key: (row) => `assignDate:${row.assignDate}`,
        sorter: (a, b) => moment(a.assignDate) - moment(b.assignDate),
        render: (data, row) => <div>{data}</div>,
      },
      {
        title: "픽업시간",
        dataIndex: "pickupDate",
        className: "table-column-center desk",
        // key: (row) => `pickupDate:${row.pickupDate}`,
        sorter: (a, b) => moment(a.pickupDate) - moment(b.pickupDate),
        render: (data, row) => (
          <div>{row.orderStatus >= 3 ? formatDate(data) : "-"}</div>
        ),
      },
      {
        title: "완료시간",
        dataIndex: "completeDate",
        className: "table-column-center desk",
        // key: (row) => `completeDate:${row.completeDate}`,
        sorter: (a, b) => moment(a.completeDate) - moment(b.completeDate),
        render: (data, row) => (
          <div>{row.orderStatus >= 4 ? formatDate(data) : "-"}</div>
        ),
      },
    ];

    const expandedRowRender = (record) => {
      const dropColumns = [
        {
          title: "세부내용",
          dataIndex: "distance",
          className: "table-column-center mobile",
          render: (data, row) => (
            <div className="status-box">
              접수시간 :{row.orderDate}
              <br />
              배차시간 :{row.assignDate}
              <br />
              픽업시간 :
              {row.orderStatus >= 3 ? formatDate(row.pickupDate) : "-"}
              <br />
              완료시간 :
              {row.orderStatus >= 4 ? formatDate(row.completeDate) : "-"}
              <br />
              <hr className="light-hr" />
              가격 : {comma(row.orderPrice)} / 총요금 :{" "}
              {comma(row.deliveryPrice)}
              <br />
              기본요금 : {comma(row.basicDeliveryPrice)} / 할증요금 :{" "}
              {comma(row.extraDeliveryPrice)}
            </div>
          ),
        },
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
        // 대표님 요청으로 임시로 원복
        // @todo 시연후 확인하자 by riverstyx
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
        {
          title: "거리(m)",
          dataIndex: "distance",
          className: "table-column-center desk",
          key: (row) => `distance:${row.distance}`,
          render: (data, row) => <div>{comma(data)}</div>,
        },
        {
          title: "결제방식",
          dataIndex: "orderPayments",
          className: "table-column-center desk",
          key: (row) => `orderPayments:${row.idx}`,
          render: (data, row) =>
            data.length > 1 ? (
              <>
                <Button
                  onClick={() => {
                    this.openPaymentModal(data, row);
                  }}
                  close={this.clos}
                >
                  보기
                </Button>
              </>
            ) : (
              <div>{paymentMethod[data[0] ? data[0]["paymentMethod"] : 0]}</div>
            ),
        },

        {
          title: "배차",
          dataIndex: "forceLocate",
          className: "table-column-center desk",
          key: (row) => `forceLocate:${row.idx}`,
          render: (data, row) => (
            <span>
              {/* <ForceAllocateDialog */}
              {/* {this.state.forceOpen && (
                <SearchRiderDialog
                  close={this.closeForceingModal}
                  callback={(data) => this.assignRider(data, row.idx)}
                />
              )} */}
              <Button
                className="tabBtn"
                onClick={() => this.openForceModal(row)}
              >
                강제배차
              </Button>
            </span>
          ),
        },
        {
          title: "메세지",
          dataIndex: "franchisePhoneNum",
          className: "table-column-center desk",
          key: (row) => `franchisePhoneNum:${row.franchisePhoneNum}`,
          render: (data, row) => (
            <span>
              <Button
                className="tabBtn"
                onClick={() => {
                  console.log(row);
                  this.openDirectMessageModal(
                    row.userIdx,
                    row.riderName,
                    row.riderLevel
                  );
                }}
              >
                라이더
              </Button>
              <Button
                className="tabBtn"
                onClick={() =>
                  this.openDirectMessageModal(row.frIdx, row.frName)
                }
              >
                가맹점
              </Button>
            </span>
          ),
        },
        {
          title: "주문수정",
          dataIndex: "updateOrder",
          className: "table-column-center desk",
          key: (row) => `updateOrder:${row.updateOrder}`,
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
        />
      );
    };

    return (
      <>
        {this.state.mapControlOpen && (
          <MapControlDialog
            getList={this.getList}
            callData={this.state.list}
            close={this.closeMapControlModal}
          />
        )}
        {this.state.forceOpen && (
          <SearchRiderDialog
            close={this.closeForceingModal}
            callback={(rider) => this.assignRider(rider, rider)}
            availableOnly={true}
          />
        )}
        <div className="reception-box">
          {this.state.paymentOpen && (
            <PaymentDialog
              close={this.closePaymentModal}
              orderPayments={this.state.paymentData}
              orderPrice={this.state.orderPrice}
            />
          )}
          {this.state.MessageOpen && (
            <ChattingDialog close={this.closeMessageModal} />
          )}
          {this.state.directMessageOpen && (
            <ChattingCurrentRoom
              targetIdx={this.state.messageTarget}
              targetName={this.state.messageTargetName}
              targetLevel={this.state.messageTargetLevel}
              close={this.closeDirectMessageModal}
            />
          )}

          {this.state.addCallOpen && (
            <RegistCallDialog close={this.closeAddCallModal} />
          )}

          {this.state.modifyOrder && (
            <RegistCallDialog
              close={this.closeModifyOrderModal}
              editable={this.state.editable}
              data={this.state.data}
            />
          )}

          <div className="btnLayout desk">
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
            {this.state.deliveryZone && (
              <DeliveryZoneDialog close={this.closeDeliveryZoneModal} />
            )}
            <Button
              icon={<PushpinOutlined />}
              className="tabBtn"
              onClick={this.openDeliveryZoneModal}
            >
              배송가능지역
            </Button>
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
              주문등록
            </Button>
            <Button
              icon={<MessageOutlined />}
              className="tabBtn messageTab"
              onClick={this.openMessageModal}
            >
              상담메세지
            </Button>

            {this.state.sendSnsOpen && (
              <SendSnsDialog
                close={this.closeSendSnsModal}
                callback={this.onSearchRiderDetail}
              />
            )}
            <Button className="riderManageBtn" onClick={this.openSendSnsModal}>
              전체메세지
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
            {this.state.blindControlOpen && (
              <BlindControlDialog
                isOpen={this.state.blindControlOpen}
                close={this.closeBlindControlModal}
              />
            )}
            <Button
              className="tabBtn sectionTab"
              onClick={this.openBlindControlModal}
            >
              블라인드관리
            </Button>
          </div>

          <div className="btnLayout mobile">
            <Button
              icon={<EnvironmentFilled />}
              className="tabBtn mapTab"
              onClick={this.openMapControlModal}
              // onClick={() => { this.props.openMapControl() }}
            >
              지도관제
            </Button>
            <Button
              icon={<PhoneOutlined />}
              className="tabBtn registTab"
              onClick={this.openAddCallModal}
            >
              주문등록
            </Button>
          </div>

          <div className="selectLayout desk">
            <Search
              placeholder="가맹점검색"
              enterButton
              allowClear
              onChange={(e) => {
                this.setState({ franchisee: e.target.value }, () => {
                  if (e.target.value === "") {
                    this.pollingFunction();
                  }
                });
              }}
              onSearch={this.onSearch}
              style={{
                width: 200,
              }}
            />
            <Search
              placeholder="기사명검색"
              enterButton
              allowClear
              onChange={(e) => {
                this.setState({ rider: e.target.value }, () => {
                  if (e.target.value === "") {
                    this.pollingFunction();
                  }
                });
              }}
              onSearch={this.onSearch}
              style={{
                width: 200,
                marginLeft: 10,
              }}
            />
            {/* <Search
            placeholder="바이크검색"
            enterButton
            allowClear
            onChange={(e) => this.setState({ rider: e.target.value })}
            onSearch={this.onSearch}
            style={{
              width: 200,
              marginLeft: 20,
            }}
          /> */}
            {/* <FilteringDialog
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
            )} */}
            {this.state.checkedCompleteCall && (
              <DatePicker
                style={{ marginLeft: 20, verticalAlign: "top" }}
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
                        this.completedTotal();
                        this.canceledTotal();
                        console.log(
                          "BBB " +
                            moment(this.state.selectedDate).format("YYYY-MM-DD")
                        );
                      },
                      () => console.log("aaa" + this.state.selectedDate)
                    );
                  }
                }}
              />
            )}
            <Checkbox
              defaultChecked={this.state.checkedCompleteCall ? "checked" : ""}
              onChange={this.handleToggleCompleteCall}
            >
              <span className="span1">이력조회</span>
            </Checkbox>

            <div className="filtering-box-wrapper">
              {!this.state.checkedCompleteCall ? (
                <div className="filtering-box">
                  <div className="filtering-name">주문상태</div>

                  {this.state.orderStatus.map((o) => {
                    return (
                      <div className="filtering-btn">
                        <Checkbox
                          key={o.key}
                          value={o.value}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const result =
                                this.state.selectedOrderStatus.concat(
                                  e.target.value
                                );
                              this.setState({
                                selectedOrderStatus: result,
                              });
                            } else {
                              const result =
                                this.state.selectedOrderStatus.filter(
                                  (el) => el !== e.target.value
                                );
                              this.setState({
                                selectedOrderStatus: result,
                              });
                            }
                          }}
                          defaultChecked={
                            this.state.selectedOrderStatus.includes(o.value)
                              ? "checked"
                              : ""
                          }
                        >
                          {o.text}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="filtering-box">
                  <div className="filtering-name">주문상태</div>

                  {this.state.completeStatus.map((o) => {
                    return (
                      <div className="filtering-btn">
                        <Checkbox
                          key={o.key}
                          value={o.value}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const resultComplete =
                                this.state.selectedCompleteStatus.concat(
                                  e.target.value
                                );
                              this.setState({
                                selectedCompleteStatus: resultComplete,
                              });
                            } else {
                              const resultComplete =
                                this.state.selectedCompleteStatus.filter(
                                  (el) => el !== e.target.value
                                );
                              this.setState({
                                selectedCompleteStatus: resultComplete,
                              });
                            }
                          }}
                          defaultChecked={
                            this.state.selectedCompleteStatus.includes(o.value)
                              ? "checked"
                              : ""
                          }
                        >
                          {o.text}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="filtering-box">
                <div className="filtering-name">결제방식</div>

                {this.state.paymentMethod.map((o) => {
                  return (
                    <div className="filtering-btn">
                      <Checkbox
                        key={o.key}
                        value={o.value}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const result =
                              this.state.selectedPaymentMethods.concat(
                                e.target.value
                              );
                            this.setState({
                              selectedPaymentMethods: result,
                            });
                          } else {
                            const result =
                              this.state.selectedPaymentMethods.filter(
                                (el) => el !== e.target.value
                              );
                            this.setState({
                              selectedPaymentMethods: result,
                            });
                          }
                        }}
                        defaultChecked={
                          this.state.selectedPaymentMethods.includes(o.value)
                            ? "checked"
                            : ""
                        }
                      >
                        {o.text}
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mobile">
            <Search
              placeholder="가맹점검색"
              enterButton
              allowClear
              onChange={(e) =>
                this.setState({ franchisee: e.target.value }, () => {
                  if (e.target.value === "") {
                    this.pollingFunction();
                  }
                })
              }
              onSearch={this.onSearch}
              style={{
                width: 308,
                marginTop: 15,
                marginBottom: 10,
              }}
            />
            <Search
              placeholder="기사명검색"
              enterButton
              allowClear
              onChange={(e) =>
                this.setState({ rider: e.target.value }, () => {
                  if (e.target.value === "") {
                    this.pollingFunction();
                  }
                })
              }
              onSearch={this.onSearch}
              style={{
                width: 308,
                marginBottom: 20,
              }}
            />
          </div>
          {!this.state.checkedCompleteCall ? (
            <div className="delivery-status-box desk">
              <div style={{ background: "rgb(255, 204, 204)" }}>
                접수 :{" "}
                {
                  this.state.list.filter((item) => item.orderStatus === 1)
                    .length
                }{" "}
                건
              </div>
              <div style={{ background: "#d6edfe" }}>
                배차 :{" "}
                {
                  this.state.list.filter((item) => item.orderStatus === 2)
                    .length
                }{" "}
                건
              </div>
              <div style={{ background: "white" }}>
                픽업 :{" "}
                {
                  this.state.list.filter((item) => item.orderStatus === 3)
                    .length
                }{" "}
                건
              </div>
            </div>
          ) : (
            <div className="delivery-status-box desk">
              <div style={{ background: "#ffffbf" }}>
                완료 : {this.state.totalComplete} 건
              </div>
              <div style={{ background: "#a9a9a9" }}>
                취소 : {this.state.totalCancel} 건
              </div>
            </div>
          )}
          <div className="mobile">
            <div
              className="delivery-status-mobile"
              style={{ background: "rgb(255, 204, 204)" }}
            >
              접수 :{" "}
              {this.state.list.filter((item) => item.orderStatus === 1).length}{" "}
              건
            </div>
            <div
              className="delivery-status-mobile"
              style={{ background: "#d6edfe" }}
            >
              배차 :{" "}
              {this.state.list.filter((item) => item.orderStatus === 2).length}{" "}
              건
            </div>
            <div
              className="delivery-status-mobile"
              style={{ background: "white" }}
            >
              픽업 :{" "}
              {this.state.list.filter((item) => item.orderStatus === 3).length}{" "}
              건
            </div>
            {/* <div
              className="delivery-status-mobile"
              style={{ background: "#ffffbf" }}
            >
              완료 : {this.state.totalComplete} 건
            </div>
            <div
              className="delivery-status-mobile"
              style={{ background: "#a9a9a9" }}
            >
              취소 : {this.state.totalCancel} 건
            </div> */}
          </div>

          <div id="reception-table" className="desk">
            <Table
              rowKey={(record) => record.idx}
              rowClassName={(record) =>
                record.deliveryPrice == 0
                  ? "table-redalert"
                  : rowColorName[record.orderStatus]
              }
              dataSource={
                this.state.checkedCompleteCall
                  ? this.state.totalList
                  : this.state.list
              }
              columns={columns}
              pagination={
                this.state.checkedCompleteCall
                  ? this.state.newPagination
                  : false
              }
              onChange={
                this.state.checkedCompleteCall && this.handleTableChange
              }
              expandedRowRender={expandedRowRender}
              // scroll={{ y: "50vh" }}
            />
          </div>
          <div id="reception-table" className="mobile">
            <Table
              rowKey={(record) => record.idx}
              rowClassName={(record) =>
                record.deliveryPrice == 0
                  ? "table-redalert"
                  : rowColorName[record.orderStatus]
              }
              dataSource={
                this.state.checkedCompleteCall
                  ? this.state.totalList
                  : this.state.list
              }
              columns={columns}
              pagination={
                this.state.checkedCompleteCall
                  ? this.state.newPagination
                  : false
              }
              // onChange={this.handleTableChange}
              expandedRowRender={expandedRowRender}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            {!this.state.checkedCompleteCall && (
              <Button
                onClick={() => {
                  if (this.state.checkedCompleteCall) {
                    if (
                      this.state.totalPagination.pageSize >=
                      this.state.totalPagination.total
                    ) {
                      Modal.info({
                        title: "주문정보 오류",
                        content: "더 이상 주문정보가 존재하지 않습니다.",
                      });
                      return;
                    }
                    this.setState(
                      {
                        totalPagination: {
                          ...this.state.totalPagination,
                          pageSize: this.state.totalPagination.pageSize + 100,
                        },
                      },
                      () => {
                        this.getCompleteList();
                      }
                    );
                  } else {
                    if (
                      this.state.pagination.pageSize >=
                      this.state.pagination.total
                    ) {
                      Modal.info({
                        title: "주문정보 오류",
                        content: "더 이상 주문정보가 존재하지 않습니다.",
                      });
                      return;
                    }
                    this.setState(
                      {
                        pagination: {
                          ...this.state.pagination,
                          pageSize: this.state.pagination.pageSize + 100,
                        },
                      },
                      () => {
                        this.getList();
                      }
                    );
                  }
                }}
              >
                더 보기
              </Button>
            )}
          </div>
        </div>
      </>
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
