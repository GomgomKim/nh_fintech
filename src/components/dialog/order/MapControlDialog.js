import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Select, Space, Table } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { Marker, NaverMap, Polyline } from "react-naver-maps";
import { connect } from "react-redux";
import {
  httpGet,
  httpGetWithNoLoading,
  httpPost,
  httpUrl
} from "../../../api/httpClient";
import { customAlert, customError, deleteError } from "../../../api/Modals";
import RegistCallDialog from "../../../components/dialog/order/RegistCallDialog";
import SelectBox from "../../../components/input/SelectBox";
import "../../../css/modal.css";
import "../../../css/order.css";
import {
  arriveReqTime,
  deliveryStatusCode,
  modifyType,
  orderCnt,
  riderLevelText,
  rowColorName
} from "../../../lib/util/codeUtil";
import { formatDate, formatHM } from "../../../lib/util/dateUtil";
import { comma, remainTime } from "../../../lib/util/numberUtil";

const Option = Select.Option;
const navermaps = window.naver.maps;
const Search = Input.Search;

class MapControlDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riderName: "",
      phoneNum: "",
      workTab: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 100000,
      },
      paginationList: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      paginationCallList: {
        total: 0,
        current: 1,
        pageSize: 10,
      },

      // test data
      list: [],
      franchisee: "",

      // 라이더 리스트
      riderListSave: [],
      results: [],
      riderStatus: 1,
      riderLevel: [1, 2],
      userData: 1,
      searchName: "",

      riderListOpen: false,
      selectedRider: "",

      // 라이더 위치
      selectedRiderIdx: 0,
      riderLocates: [],

      // 라이더 배차된 주문
      riderOrderList: [],

      // 선택된 라이더
      selRider: {},
      selectedRiderLatitude: 37.643623625321474,
      selectedRiderLongitude: 126.66509442649551,
      selectedRiderAssignedOrderCnt: 0,

      // 선택된 라이더 이동경로
      selRiderPath: [],

      modifyOrder: false,

      // 주문 테이블 다중선택
      orderListOpen: false,
      selectedRowKeys: [],
      dataIdxs: [],

      isAssignRider: false,

      waitingList: [],

      searchText: "",
      searchedColumn: "",

      selOrderCnt: 99,
      allResults: [],
      allResultsSave: [],

      // 가맹점, 라이더 위치 리스트
      frLocates: [],
      riderAllLocates: [],

      // 지도 좌표 경계
      mapBounds: null,
      mapCenter: {
        lat: 37.643623625321474,
        lng: 126.66509442649551,
      },
    };
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.getRiderList();
    this.getRiderLocateList();
    this.getBounds();
    this.setMapCenter();

    this.riderLocateListInterval = setInterval(this.getRiderLocateList, 7033);
    this.riderListInterval = setInterval(this.getRiderList, 7033);

    console.log("this.props.loginInfo");
    console.log(this.props.loginInfo);
  }

  componentWillUnmount() {
    if (this.riderLocateListInterval)
      clearInterval(this.riderLocateListInterval);
    if (this.riderListInterval) clearInterval(this.riderListInterval);
  }
  getBounds = () => {
    console.log("지도 경계");
    const bounds = this.mapRef.getBounds();
    this.setState({ mapBounds: bounds }, () => {});
  };

  handleBoundChange = (bounds) => {
    this.setState({ mapBounds: bounds });
  };

  // 기사명 검색
  onSearchWorker = (value) => {
    this.setState({ searchName: value }, () => {
      this.getRiderList();
    });
  };

  setMapCenter = () => {
    this.setState({
      mapCenter: {
        lat: this.props.loginInfo.branchLatitude
          ? this.props.loginInfo.branchLatitude
          : 37.643623625321474,
        lng: this.props.loginInfo.branchLongitude
          ? this.props.loginInfo.branchLongitude
          : 126.66509442649551,
      },
    });
  };

  assignRiderApi = (orderIdx, rider, failedIdx) => {
    httpPost(httpUrl.assignRiderAdmin, [], {
      orderIdx: orderIdx,
      userIdx: this.state.selectedRiderIdx,
    })
      .then((res) => {
        this.getList(rider.idx ? rider.idx : rider.userIdx);
        this.getOrderList();
        this.setState({
          selectedRowKeys: [],
        });
        if (res.result !== "SUCCESS" && res.data !== "SUCCESS") {
          failedIdx.push(orderIdx);
        }
      })
      .catch((e) => {
        console.log(e);
        failedIdx.push(orderIdx);
      });
  };

  // 기사 테이블에서 아이디 클릭했을 때
  // rider : 선택된 라이더 정보
  onSearchWorkerSelected = async (rider) => {
    var self = this;
    const flag = await this.getRiderLocate(
      rider.userIdx ? rider.userIdx : rider.idx
    );
    if (!flag) return;

    this.setState(
      {
        selectedRiderIdx: rider.userIdx ? rider.userIdx : rider.idx,
        riderName: rider.riderName,
      },
      () => {
        let failedIdx = [];
        if (self.state.selectedRowKeys.length > 0) {
          if (rider.riderStatus === 1) {
            Modal.confirm({
              title: "배차 설정",
              content: `${self.state.selectedRowKeys} 번의 주문을 ${rider.riderName} 기사에게 배정하시겠습니까?`,
              onOk: () => {
                if (
                  this.state.allResultsSave.find(
                    (x) =>
                      x.userIdx === rider.idx || x.userIdx === rider.userIdx
                  ).orders.length +
                    self.state.selectedRowKeys.length >
                  rider.riderSettingGroup.amountPerOneTime
                ) {
                  customError(
                    "배차 오류",
                    `${rider.riderSettingGroup.settingGroupName}그룹 배차는 ${rider.riderSettingGroup.amountPerOneTime}개의 주문까지 가능합니다.`
                  );
                } else {
                  self.state.selectedRowKeys.forEach(
                    async (orderIdx) =>
                      await self.assignRiderApi(orderIdx, rider, failedIdx)
                  );
                  if (failedIdx.length === 0) {
                    customAlert("배차 성공", "배차에 성공했습니다.");
                  } else {
                    customError(
                      "배차 실패",
                      `${failedIdx} 번의 주문 배차에 실패했습니다.`
                    );
                  }
                }
              },
              onCancel: () => {},
            });
          } else {
            customError("배차 실패", "근무중인 라이더가 아닙니다.");
          }
        } else {
          this.getList(rider.idx);
        }
      }
    );
  };

  setRiderOrderData = (result) => {
    var list = result.data.orders;
    var addPaths = [];
    var addRiderLocates = [];
    var addFrLocates = [];
    for (let i = 0; i < list.length; i++) {
      var addPath = [];
      addPath[0] = navermaps.LatLng(
        this.state.selectedRiderLatitude,
        this.state.selectedRiderLongitude
      );
      addPath[1] = navermaps.LatLng(list[i].frLatitude, list[i].frLongitude);
      addPath[2] = navermaps.LatLng(list[i].latitude, list[i].longitude);
      addPaths[i] = addPath;
      addRiderLocates.push(
        navermaps.LatLng(list[i].latitude, list[i].longitude)
      );
      addFrLocates.push(
        navermaps.LatLng(list[i].frLatitude, list[i].frLongitude)
      );
    }
    const pagination = { ...this.state.pagination };
    pagination.current = result.data.currentPage;
    // pagination.total = result.data.totalCount;

    console.log("addPaths :" + addPaths);

    this.setState({
      selRider: result.data,
      selRiderPath: addPaths,
      frLocates: addFrLocates,
      riderAllLocates: addRiderLocates,
      riderOrderList: list,
      pagination,
    });
  };

  getList = (riderIdx) => {
    let selectedRiderIdx;
    if (riderIdx) selectedRiderIdx = riderIdx;
    else selectedRiderIdx = this.state.selectedRiderIdx;
    var p = { ...this.state.pagination };
    httpPost(httpUrl.getAssignedRider, [], {
      pageNum: p.current,
      pageSize: p.pageSize,
      userIdx: parseInt(selectedRiderIdx),
    }).then((result) => {
      console.log("### nnbox result=" + JSON.stringify(result, null, 4));
      console.log(result);
      if (result.result === "SUCCESS") {
        if (result.data !== null) {
          this.setRiderOrderData(result);
        } else {
          this.setState({
            riderOrderList: [],
          });
          // 표시 안해도 될것 같음!!
          // customError(
          //   "배차 목록 오류",
          //   "해당 라이더의 배차가 존재하지 않습니다."
          // );
        }
      } else
        customError(
          "배차 목록 오류",
          "배차목록을 불러오는 데 실패했습니다. 관리자에게 문의하세요."
        );
    });
  };

  getOrderList = () => {
    // console.log("order in")
    const startDate = new Date(1990, 1, 1);
    const endDate = new moment();
    var data = {
      orderStatuses: [1],
      pageNum: this.state.paginationCallList.current,
      pageSize: this.state.paginationCallList.pageSize,
      paymentMethods: [1, 2, 3],
      startDate: formatDate(startDate).split(" ")[0],
      endDate: formatDate(endDate.add("1", "d")).split(" ")[0],
    };
    httpPost(httpUrl.orderList, [], data)
      .then((res) => {
        console.log(
          "### new order result=" + JSON.stringify(res.data, null, 4)
        );
        if (res.result === "SUCCESS") {
          const paginationCallList = { ...this.state.paginationCallList };
          paginationCallList.current = res.data.currentPage;
          paginationCallList.total = res.data.totalCount;
          this.setState({
            waitingList: res.data.orders,
            paginationCallList,
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

  getRiderLocateList = () => {
    httpGetWithNoLoading(httpUrl.riderLocateList, [], {}).then((result) => {
      console.log("getRiderLocateList result");
      console.log(result);
      this.setState({
        riderLocates: result.data.riderLocations,
        allResults: result.data.riderLocations,
        allResultsSave: result.data.riderLocations,
      });
    });
  };

  getRiderLocate = (riderIdx) => {
    return new Promise((resolve, reject) => {
      httpGet(httpUrl.riderLocate, [riderIdx], {}).then((result) => {
        console.log("getRiderLocate result");
        console.log(result);
        if (result.data !== null) {
          this.setState(
            {
              selectedRiderAssignedOrderCnt: result.data.assignedOrderCnt,
              mapCenter: {
                lat: result.data.latitude,
                lng: result.data.longitude,
              },
              selectedRiderLatitude: result.data.latitude,
              selectedRiderLongitude: result.data.longitude,
              selectedRiderIdx: result.data.userIdx,
              riderName: result.data.riderName,
            },
            () => {
              this.getList();
            }
          );
          resolve(true);
        } else {
          Modal.info({
            title: "위치정보 조회 오류",
            content: "라이더의 위치정보가 존재하지 않습니다.",
          });
          reject(false);
        }
      });
    });
  };

  getRiderList = () => {
    const pageNum = this.state.paginationList.current;
    const userStatus = 1;
    const searchName = this.state.searchName;
    const riderStatus = 1;

    httpGetWithNoLoading(
      httpUrl.riderList,
      [10, pageNum, searchName, userStatus, "", riderStatus],
      {}
    ).then((result) => {
      console.log("getRiderList result");
      console.log(result);
      // console.log('## nnbox result=' + JSON.stringify(result, null, 4))
      const pagination = { ...this.state.paginationList };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      // console.log(result.data.riders)
      this.setState({
        results: result.data.riders,
        paginationList: pagination,
      });
    });
  };

  // 라이더 전체 리스트 (최대 1000명)
  getRiderAllList = () => {
    let pageNum = this.state.paginationList.current;
    let userStatus = 1;
    let searchName = this.state.searchName;

    httpGet(
      httpUrl.riderList,
      [1000, pageNum, searchName, userStatus],
      {}
    ).then((result) => {
      console.log("getRiderAllList result");
      console.log(result);

      const pagination = { ...this.state.paginationList };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      console.log(result.data.riders);
      this.setState({
        allResultsSave: result.data.riders,
        allResults: result.data.riders,
        paginationList: pagination,
      });
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

  handleListTableChange = (pagination) => {
    const pager = { ...this.state.paginationList };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState(
      {
        paginationList: pager,
      },
      () => this.getRiderList()
    );
  };

  handleCallListTableChange = (pagination) => {
    this.setState(
      {
        paginationCallList: pagination,
      },
      () => {
        this.getRiderList();
        this.getOrderList();
      }
    );
  };

  // 주문수정 dialog
  openModifyOrderModal = (order) => {
    this.setState({ data: order, modifyOrder: true });
  };
  closeModifyOrderModal = () => {
    this.setState({ modifyOrder: false });
  };

  // 주문 삭제 API
  deleteAssign = (orderIdx) => {
    let self = this;
    Modal.confirm({
      title: "배차 삭제",
      content: <div> 배차목록을 삭제하시겠습니까?</div>,
      okText: "확인",
      cancelText: "취소",
      onOk() {
        httpPost(httpUrl.assignRiderCancel, [], { orderIdx: orderIdx })
          .then((res) => {
            if (res.result === "SUCCESS") {
              switch (res.data) {
                case "SUCCESS":
                  self.getList();
                  self.getOrderList();
                  break;
                case "ALREADY_CANCELED":
                  customError("배차 오류", "이미 취소된 배차입니다.");
                  break;
                case "ORDER_NOT_EXISTS":
                  customError("배차 오류", "존재하지 않은 주문입니다.");
                  break;
                case "PICKUPED_ORDER":
                  customError("배차 오류", "이미 픽업된 배차입니다.");
                  break;
                case "COMPLETED_ORDER":
                  customError("배차 오류", "이미 주문 완료된 배차입니다.");
                  break;
                case "NOT_ADMIN":
                  customError(
                    "배차 오류",
                    "관리자만 강제배차를 해제할 수 있습니다."
                  );
                  break;
                default:
                  customError(
                    "배차 오류",
                    "배차에 실패했습니다. 관리자에게 문의하세요."
                  );
                  break;
              }
            } else deleteError();
          })
          .catch(() => {
            deleteError();
          });
      },
    });
  };

  onSelectChange = (selectedRowKeys) => {
    var curList = this.props.callData;
    var overrideData = {};
    for (let i = 0; i < curList.length; i++) {
      var idx = curList[i].idx;
      if (selectedRowKeys.includes(idx)) overrideData[idx] = true;
      else overrideData[idx] = false;
    }

    var curIdxs = this.state.dataIdxs;
    curIdxs = Object.assign(curIdxs, overrideData);

    selectedRowKeys = [];
    for (let i = 0; i < curIdxs.length; i++) {
      if (curIdxs[i]) selectedRowKeys = [...selectedRowKeys, i];
    }
    this.setState({
      selectedRowKeys: selectedRowKeys,
      dataIdxs: curIdxs,
    });
  };

  assignRider = () => {
    this.setState({
      riderListOpen: true,
      isAssignRider: true,
    });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
  });

  setAssignCnt = (cnt) => {
    var list = [];
    if (cnt >= 0 && cnt < 5)
      list = this.state.allResultsSave.filter((x) => x.orders.length === cnt);
    else if (cnt === 5)
      list = this.state.allResultsSave.filter((x) => x.orders.length >= cnt);
    else if (cnt === 99) list = this.state.allResultsSave;
    var addPaths = this.clearPath();

    // console.log("############## :"+JSON.stringify(list, null, 4))
    this.setState({
      frLocates: [],
      riderAllLocates: [],
      selRiderPath: addPaths,
      selOrderCnt: cnt,
      allResults: list,
      selectedRiderIdx: 0,
    });
  };

  clearPath = () => {
    var addPaths = [];
    var addPath = [];
    addPath[0] = navermaps.LatLng(0, 0);
    addPath[1] = navermaps.LatLng(0, 0);
    addPaths[0] = addPath;
    return addPaths;
  };

  clearSelected = () => {
    this.setState({
      riderName: "",
      selectedRiderIdx: "",
      selRiderPath: [],
      riderAllLocates: [],
      frLocates: [],
    });
  };

  render() {
    const { close } = this.props;

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
                var flag = true;

                // 제약조건 미성립
                if (!modifyType[row.orderStatus].includes(value)) {
                  Modal.info({
                    content: <div>상태를 바꿀 수 없습니다.</div>,
                  });
                  flag = false;
                }

                // 대기중 -> 픽업중 변경 시 강제배차 알림
                if (row.orderStatus === 1 && value === 2) {
                  Modal.info({
                    content: <div>강제배차를 사용하세요.</div>,
                  });
                }

                // 제약조건 성립 시 상태 변경
                if (flag) {
                  row.orderStatus = value;
                  httpPost(httpUrl.orderUpdate, [], row)
                    .then((res) => {
                      // console.log(res);
                    })
                    .catch((e) => {});
                  this.getList();
                }
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
        title: "가맹점명",
        dataIndex: "frName",
        className: "table-column-center",
        render: (data) => <div>{data}</div>,
      },

      {
        title: "음식준비",
        dataIndex: "itemPrepared",
        className: "table-column-center",
        render: (data) => <div>{data ? "완료" : "준비중"}</div>,
      },
      {
        title: "픽업시간",
        dataIndex: "pickupDate",
        className: "table-column-center",
        render: (data) => <div>{data ? formatDate(data) : "대기중"}</div>,
      },
      {
        title: "완료시간",
        dataIndex: "completeDate",
        className: "table-column-center",
        render: (data) => <div>{data ? formatDate(data) : "배달중"}</div>,
      },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center",
        render: (data) => <div>{this.state.riderName}</div>,
      },
      {
        title: "기사 연락처",
        dataIndex: "riderPhone",
        className: "table-column-center",
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
        title: "거리(m)",
        dataIndex: "distance",
        className: "table-column-center",
        render: (data, row) => <div>{comma(data)}</div>,
      },
      {
        title: "주문수정",
        dataIndex: "updateOrder",
        className: "table-column-center",
        render: (data, row) => (
          <Button
            onClick={() => {
              // console.log(row);
              this.openModifyOrderModal(row);
            }}
          >
            수정
          </Button>
        ),
      },
      {
        title: "주문삭제",
        dataIndex: "updateOrder",
        className: "table-column-center",
        render: (data, row) => (
          <Button
            onClick={() => {
              // console.log(row);
              this.deleteAssign(row.idx);
            }}
          >
            삭제
          </Button>
        ),
      },
    ];

    const columns_riderList = [
      {
        title: "아이디",
        dataIndex: "id",
        className: "table-column-center",
        render: (data, row) => (
          <div
            className="riderName"
            onClick={() => {
              console.log(row);
              this.onSearchWorkerSelected(row);
            }}
          >
            {data}
          </div>
        ),
      },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center",
      },
      {
        title: "직급",
        dataIndex: "riderLevel",
        className: "table-column-center",
        render: (data) => <div>{riderLevelText[data]}</div>,
      },
      {
        title: "배차갯수",
        dataIndex: "assignedOrderCnt",
        className: "table-column-center",
        render: (data) => <div>{data + "건"}</div>,
      },
    ];

    const columns_callList = [
      {
        title: "가맹점명",
        dataIndex: "frName",
        className: "table-column-center",
      },
      {
        title: "접수시간",
        dataIndex: "orderDate",
        className: "table-column-center",
        width: 70,
        render: (data, row) => <div>{formatHM(data)}</div>,
      },
      {
        title: "남은시간(분)",
        dataIndex: "orderDate",
        className: "table-column-center",
        width: 100,
        render: (data, row) => (
          <div>
            {row.arriveReqTime > 1000
              ? 0
              : remainTime(row.orderDate, row.arriveReqTime)}
            분
          </div>
        ),
      },
      {
        title: "도착지",
        className: "table-column-center arrive",
        ...this.getColumnSearchProps("destAddr1"),
        render: (data, row) => (
          <div className="arriveArea">
            {row.destAddr1 === "" ? "-" : row.destAddr1 + " " + row.destAddr2}
          </div>
        ),
      },
    ];

    const selectedRowKeys = this.state.selectedRowKeys;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <React.Fragment>
        {this.state.modifyOrder && (
          <RegistCallDialog
            close={this.closeModifyOrderModal}
            editable={this.state.editable}
            data={this.state.data}
            getList={this.getList}
          />
        )}
        <div className="Dialog-overlay" onClick={close} />
        <div className="map-Dialog">
          <div className="map-menu-bar">
            <div className="select-rider-orderCnt">
              <SelectBox
                value={orderCnt[this.state.selOrderCnt]}
                code={Object.keys(orderCnt)}
                codeString={orderCnt}
                onChange={(value) => {
                  if (parseInt(value) !== this.state.selOrderCnt) {
                    this.setAssignCnt(parseInt(value));
                  }
                }}
              />
            </div>

            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="map-close"
              alt="닫기"
            />
          </div>
          <div className="map-content">
            <div className="map-inner">
              {this.state.riderName && (
                <div className="riderTableLayout">
                  <div className="textLayout">
                    <span className="riderText">
                      {this.state.riderName}의 배차 목록
                    </span>
                    <Button
                      style={{
                        marginLeft: 10,
                        backgroundColor: "black",
                        color: "white",
                      }}
                      onClick={() => this.clearSelected()}
                    >
                      X
                    </Button>
                  </div>
                  <Table
                    rowKey={(record) => record.idx}
                    dataSource={this.state.riderOrderList}
                    rowClassName={(record) => rowColorName[record.orderStatus]}
                    columns={columns}
                    // onChange={this.handleTableChange}
                    // pagination={this.state.pagination}
                    pagination={false}
                    className={"riderOderTable"}
                  />
                </div>
              )}

              <div className="mapLayout">
                {/* <MapContainer/> */}

                {navermaps && (
                  <NaverMap
                    className="map-navermap"
                    defaultZoom={14}
                    center={this.state.mapCenter}
                    naverRef={(ref) => {
                      this.mapRef = ref;
                    }}
                    bounds={this.state.bounds}
                    onBoundsChanged={this.handleBoundChange}
                  >
                    {this.state.allResults.filter(
                      (x) => x.userIdx === this.state.selectedRiderIdx
                    ).length > 0 && (
                      <>
                        <Marker
                          position={navermaps.LatLng(
                            this.state.selectedRiderLatitude,
                            this.state.selectedRiderLongitude
                          )}
                          icon={
                            require("../../../img/login/map/marker_rider_red.png")
                              .default
                          }
                          title={this.state.riderName}
                          onClick={() => {
                            this.getRiderLocate(this.state.selectedRiderIdx);
                          }}
                        />
                        <Marker
                          key={this.state.selectedRiderIdx}
                          position={navermaps.LatLng(
                            this.state.selectedRiderLatitude,
                            this.state.selectedRiderLongitude
                          )}
                          icon={{
                            content: [
                              '<div class="marker-name"><div style="transform: translateX(-50%)">' +
                                this.state.riderName +
                                " (" +
                                this.state.riderOrderList.length +
                                ")" +
                                "</div></div>",
                            ].join(""),
                          }}
                          title={this.state.riderName}
                          onClick={() =>
                            this.getRiderLocate(this.state.selectedRiderIdx)
                          }
                        />
                      </>
                    )}

                    {this.state.allResults
                      .filter((row) => {
                        return this.state.selOrderCnt === 99
                          ? true
                          : this.state.selOrderCnt === 5
                          ? row.orders.length >= 5
                          : row.orders.length === this.state.selOrderCnt;
                      })
                      .map((row, index) => {
                        if (this.state.mapBounds) {
                          const { _max, _min } = this.state.mapBounds;
                          if (
                            parseFloat(row.latitude) <= _max.y &&
                            parseFloat(row.latitude) >= _min.y &&
                            parseFloat(row.longitude) <= _max.x &&
                            parseFloat(row.longitude) >= _min.x
                          ) {
                            // const homePath = window.HOME_PATH
                            return (
                              <>
                                {this.state.selectedRiderIdx !== row.userIdx &&
                                  row.riderStatus === 1 && (
                                    <>
                                      <Marker
                                        key={row.userIdx + " " + row.riderName}
                                        position={navermaps.LatLng(
                                          row.latitude,
                                          row.longitude
                                        )}
                                        // 팀장 이상 파랑 마크
                                        icon={
                                          row.riderLevel >= 3
                                            ? require("../../../img/login/map/marker_rider_blue.png")
                                                .default
                                            : require("../../../img/login/map/marker_rider.png")
                                                .default
                                        }
                                        title={row.riderName}
                                        onClick={() => {
                                          // this.getRiderLocate(row.userIdx);
                                          console.log(row);
                                          this.onSearchWorkerSelected(row);
                                        }}
                                      />
                                      <Marker
                                        key={row.userIdx}
                                        position={navermaps.LatLng(
                                          row.latitude,
                                          row.longitude
                                        )}
                                        icon={{
                                          content: [
                                            '<div class="marker-name"><div style="transform: translateX(-50%)">' +
                                              row.riderName +
                                              " (" +
                                              row.orders.length +
                                              ")" +
                                              "</div></div>",
                                          ].join(""),
                                        }}
                                        title={row.riderName}
                                        onClick={() => {
                                          // this.getRiderLocate(row.userIdx);
                                          this.onSearchWorkerSelected(row);
                                        }}
                                      />
                                    </>
                                  )}
                              </>
                            );
                          } else return <></>;
                        } else return <></>;
                      })}

                    {this.state.riderAllLocates.map((row, index) => {
                      return (
                        <Marker
                          key={row.userIdx}
                          position={row}
                          icon={
                            require("../../../img/login/map/arrive_yellow.png")
                              .default
                          }
                        />
                      );
                    })}

                    {this.state.frLocates.map((row, index) => {
                      return (
                        <Marker
                          key={row.userIdx}
                          position={row}
                          icon={
                            require("../../../img/login/map/franchise_yellow.png")
                              .default
                          }
                        />
                      );
                    })}

                    {this.state.selRiderPath.map((row, index) => {
                      const strokeColor = [
                        "#ff0000",
                        "#00ff00",
                        "#0000ff",
                        "#ED7D31",
                        "#EC32E3",
                        "#AA7474",
                        "#8076A8",
                        "#8AFE20",
                        "#FAEB24",
                        "#A923FB",
                      ];
                      return (
                        <Polyline
                          key={index}
                          path={row}
                          strokeColor={strokeColor[index]}
                          strokeWeight={5}
                        />
                      );
                    })}
                    {/* <Polyline
                      path={this.state.selRiderPath}
                      strokeColor={"#ff0000"}
                      strokeWeight={5}
                    /> */}
                  </NaverMap>
                )}
              </div>

              {/* 콜 정보 */}
              {this.props.callData && this.state.orderListOpen && (
                <>
                  <div
                    className="order-list-show-btn "
                    onClick={() => this.setState({ orderListOpen: false })}
                  >
                    닫기
                  </div>

                  <Table
                    rowKey={(record) => record.idx}
                    dataSource={this.props.callData.filter(
                      (x) => x.orderStatus === 1
                    )}
                    rowSelection={rowSelection}
                    columns={columns_callList}
                    rowClassName={(row) => {
                      const remainTimeNum =
                        row.arriveReqTime > 1000
                          ? 0
                          : remainTime(row.orderDate, row.arriveReqTime);
                      if (remainTimeNum >= 0) return "table-white";
                      else if (remainTimeNum <= -30) return "table-red";
                      else if (remainTimeNum <= -20) return "table-orange";
                      else if (remainTimeNum <= -10) return "table-yellow";
                    }}
                    pagination={false}
                    onChange={this.handleCallListTableChange}
                    className={"callDataTable"}
                  />
                </>
              )}

              {!this.state.orderListOpen && (
                <div
                  className="order-list-show-btn desk"
                  onClick={() => this.setState({ orderListOpen: true })}
                >
                  주문 목록 열기
                </div>
              )}

              {this.state.riderListOpen && (
                <>
                  <div
                    className="rider-list-show-btn"
                    onClick={() => this.setState({ riderListOpen: false })}
                  >
                    닫기
                  </div>

                  <div className="riderListInMapControl">
                    <div className="selectLayout">
                      <Search
                        placeholder="기사명검색"
                        enterButton
                        allowClear
                        onSearch={this.onSearchWorker}
                        style={{
                          width: 200,
                        }}
                      />
                    </div>
                    <Table
                      rowKey={(record) => record.idx}
                      dataSource={this.state.results}
                      columns={columns_riderList}
                      pagination={false}
                      onChange={this.handleListTableChange}
                      className={"riderListTable"}
                    />
                  </div>
                </>
              )}
              {!this.state.riderListOpen && (
                <div
                  className="rider-list-show-btn desk"
                  onClick={() => this.setState({ riderListOpen: true })}
                >
                  기사 목록 열기
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    loginInfo: state.login.loginInfo,
  };
};

export default connect(mapStateToProps, null)(MapControlDialog);
