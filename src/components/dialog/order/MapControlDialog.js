import React, { Component } from "react";
import "../../../css/modal.css";
import { Form, Input, Table, Button, Modal, Select, Space } from "antd";
import { formatDate } from "../../../lib/util/dateUtil";
import moment from "moment";
import "../../../css/order.css";
import { comma } from "../../../lib/util/numberUtil";
import RegistCallDialog from "../../../components/dialog/order/RegistCallDialog";
import SearchRiderDialog from "../../dialog/common/SearchRiderDialog";
// import MapContainer from "./MapContainer";
import { httpGet, httpUrl, httpPost } from "../../../api/httpClient";
import { NaverMap, Marker, Polyline } from "react-naver-maps";
import {
  riderLevelText,
  riderGroupString,
  modifyType,
  deliveryStatusCode,
  rowColorName,
  arriveReqTime,
  orderCnt,
} from "../../../lib/util/codeUtil";
import { customError, deleteError, customAlert } from "../../../api/Modals";

import { SearchOutlined } from "@ant-design/icons";
import SelectBox from "../../../components/input/SelectBox";

const Option = Select.Option;
const FormItem = Form.Item;
const navermaps = window.naver.maps;
// const { Option } = Radio;
const Search = Input.Search;
const lat = 37.643623625321474;
const lng = 126.66509442649551;

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
        pageSize: 3,
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
      selectedRiderLatitude: 0,
      selectedRiderLongitude: 0,

      // 선택된 라이더 이동경로
      selRiderPath: [],

      modifyOrder: false,

      // 주문 테이블 다중선택
      selectedRowKeys: [],
      dataIdxs: [],

      isAssignRider: false,

      waitingList: [],

      searchText: "",
      searchedColumn: "",

      selOrderCnt: 0,
      allResults: [],

      // 가맹점 위치 리스트
      frLocates: [],
    };
  }

  componentDidMount() {
    this.getRiderList();
    this.getRiderLocateList();
    this.getRiderAllList();
  } 

  // 기사명 검색
  onSearchWorker = (value) => {
    this.setState({searchName: value},
      () => {
        this.getRiderList();
      }
    );
  };

  // 기사 테이블에서 아이디 클릭했을 때
  // rider : 선택된 라이더 정보
  onSearchWorkerSelected = (rider) => {
    var self = this
      this.setState(
        {
          selectedRiderIdx: rider.idx,
          riderName: rider.riderName,
        },
        () => {
          let failedIdx = [];
          if (self.state.selectedRowKeys.length > 0) {
            Modal.confirm({
              title: "배차 설정",
              content: `${self.state.selectedRowKeys} 번의 주문을 ${rider.riderName} 기사에게 배정하시겠습니다?`,
              onOk: () => {
                self.state.selectedRowKeys.forEach(orderIdx => {
                  httpPost(httpUrl.assignRiderAdmin, [], {
                    orderIdx: orderIdx,
                    userIdx: self.state.selectedRiderIdx,
                  })
                    .then((res) => {
                      self.getList(rider.idx);
                      self.getOrderList();
                      this.setState({
                        selectedRowKeys: [],
                      });
                      if (res.result !== "SUCCESS") {
                        failedIdx.push(orderIdx);
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                      failedIdx.push(orderIdx);
                    });
                });

                if (failedIdx.length === 0) {
                  customAlert("배차 성공", "배차에 성공했습니다.")
                } else {
                  customError("배차 실패", `${failedIdx} 번의 주문 배차에 실패했습니다.`)
                }


              },
              onCancel: () => {},
            });
          } else {
            this.getList(rider.idx);
          }
        }
      );
  };

  getList = (riderIdx) => {
    let selectedRiderIdx;
    if (riderIdx) selectedRiderIdx = riderIdx;
    else selectedRiderIdx = this.state.selectedRiderIdx;
    var p = { ...this.state.pagination };
    console.log("selectedRiderIdx : "+selectedRiderIdx);
    httpPost(httpUrl.getAssignedRider, [], {
      pageNum: p.current, 
      pageSize: p.pageSize,
      userIdx: parseInt(selectedRiderIdx)
    }).then((result) => {
      console.log("### nnbox result=" + JSON.stringify(result, null, 4));
      if (result.result === "SUCCESS") {
        if (result.data != null && result.data.orders.length > 0) {
          console.log('### nnbox result=' + JSON.stringify(result.data, null, 4))
          if (result.data != null) {
            var list = result.data.orders;
            var addPath = [];
            var addFrLocates = [[]];
            for (let i = 0; i < list.length; i++) {
              if (list[i].latitude === 0 || list[i].longitude === 0) continue;
              if (list[i].frLatitude === 0 || list[i].frLongitude === 0) continue;
              addPath.push(
                navermaps.LatLng(list[i].frLatitude, list[i].frLongitude)
              );
              addPath.push(
                navermaps.LatLng(list[i].latitude, list[i].longitude)
              );
              addFrLocates = Object.assign(addFrLocates, [list[i].frLatitude, list[i].frLongitude])
            }
            const pagination = { ...this.state.pagination };
            pagination.current = result.data.currentPage;
            pagination.total = result.data.totalCount;

            this.setState({
              selRider: result.data,
              selRiderPath: addPath,
              frLocates: addFrLocates,
              riderOrderList: list,
              pagination,
            });
          } else {
            this.setState({
              riderOrderList: [],
            });
            customError(
              "배차 목록 오류",
              "해당 라이더의 배차가 존재하지 않습니다."
            );
          }
        } else {
          this.setState({
            riderOrderList: [],
          });
          customError(
            "배차 목록 오류",
            "해당 라이더의 배차가 존재하지 않습니다."
          );
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
          console.log('### new order result=' + JSON.stringify(res.data, null, 4))
        if (res.result === "SUCCESS") {
          const pagination = { ...this.state.pagination };
          pagination.current = res.data.currentPage;
          pagination.total = res.data.totalCount;
          this.setState({
            waitingList: res.data.orders,
            pagination
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
    httpGet(httpUrl.riderLocateList, [], {}).then((result) => {
      this.setState({
        riderLocates: result.data.riderLocations,
      });
    });
  };

  getRiderLocate = (riderIdx) => {
    httpGet(httpUrl.riderLocate, [riderIdx], {}).then((result) => {
      // console.log('################# rider personal locate result=' + JSON.stringify(result, null, 4))
      this.setState(
        {
          selectedRiderLatitude: result.data.latitude,
          selectedRiderLongitude: result.data.longitude,
          selectedRiderIdx: result.data.userIdx,
          riderName: result.data.riderName,
        },
        () => {
          this.getList();
        }
      );
    });
  };

  getRiderList = () => {
    const pageNum = this.state.paginationList.current;
    const userStatus = 1;
    const searchName = this.state.searchName;

    httpGet(httpUrl.riderList, [10, pageNum, searchName, userStatus], {}).then(
      (result) => {
        // console.log('## nnbox result=' + JSON.stringify(result, null, 4))
        const pagination = { ...this.state.paginationList };
        pagination.current = result.data.currentPage;
        pagination.total = result.data.totalCount;
        // console.log(result.data.riders)
        this.setState({
          results: result.data.riders,
          paginationList: pagination,
        });
      }
    );
  };

  getRiderAllList = () => {
    let pageNum = this.state.paginationList.current;
    let userStatus = 1;
    let searchName = this.state.searchName;

    httpGet(
      httpUrl.riderList,
      [1000, pageNum, searchName, userStatus],
      {}
    ).then((result) => {
      // console.log('## nnbox result=' + JSON.stringify(result, null, 4))
      const pagination = { ...this.state.paginationList };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      console.log(result.data.riders);
      this.setState({
        allResults: result.data.riders,
        paginationList: pagination,
      });
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

  handleListTableChange = (pagination) => {
    console.log(pagination);
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
    // console.log(pagination);
    // const pager = { ...this.state.paginationCallList};
    // pager.current = pagination.current;
    // pager.pageSize = pagination.pageSize;
    this.setState(
      {
        paginationCallList: pagination,
      },
      () => {this.getRiderList(); this.getOrderList();}
    );
  };

  // 주문수정 dialog
  openModifyOrderModal = (order) => {
    console.log(order);
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
    var cur_list = this.props.callData;
    var overrideData = {};
    for (let i = 0; i < cur_list.length; i++) {
      var idx = cur_list[i].idx;
      if (selectedRowKeys.includes(idx)) overrideData[idx] = true;
      else overrideData[idx] = false;
    }
    // console.log(overrideData);

    var curIdxs = this.state.dataIdxs;
    curIdxs = Object.assign(curIdxs, overrideData);

    selectedRowKeys = [];
    for (let i = 0; i < curIdxs.length; i++) {
      if (curIdxs[i]) {
        // console.log("push  :" + i);
        selectedRowKeys = [...selectedRowKeys, i];
        // console.log(selectedRowKeys);
      }
    }
    // console.log("#### :"+selectedRowKeys)
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
        title: "거리(km)",
        dataIndex: "distance",
        className: "table-column-center",
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
        width: "200px",
        render: (data, row) => (
          <div
            className="riderName"
            onClick={() => {
              this.onSearchWorkerSelected(row);
            }}
          >
            {data}
          </div>
        ),
      },
      {
        title: "지사명",
        dataIndex: "id",
        className: "table-column-center",
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
        width: "200px",
        render: (data) => <div>{riderLevelText[data]}</div>,
      },
      {
        title: "기사그룹",
        dataIndex: "userGroup",
        className: "table-column-center",
        render: (data) => <div>{riderGroupString[data]}</div>,
      },
    ];

    const columns_callList = [
      {
        title: "주문번호",
        dataIndex: "idx",
        className: "table-column-center",
        width: 70,
        render: (data) => <div>{data}</div>,
      },
      {
        title: "상태",
        dataIndex: "orderStatus",
        className: "table-column-center",
        width: 70,
        render: (data, row) => (
          <div className="table-column-sub">
            {deliveryStatusCode[row.orderStatus]}
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
          <div className="map-content">
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="map-close"
              alt="img"
            />
            <SelectBox
              className="select-rider-orderCnt"
              value={orderCnt[this.state.selOrderCnt]}
              code={Object.keys(orderCnt)}
              codeString={orderCnt}
              onChange={(value) => {
                if (parseInt(value) !== this.state.selOrderCnt) {
                  this.setState({ selOrderCnt: parseInt(value) }, () =>
                    this.getRiderList()
                  );
                }
              }}
            />

            <div className="map-inner">
              {this.state.riderName && (
                <div className="riderTableLayout">
                  <div className="textLayout">
                    <span className="riderText">
                      {this.state.riderName}의 배차 목록
                    </span>
                  </div>
                  <Table
                    rowKey={(record) => record.idx}
                    dataSource={this.state.riderOrderList}
                    rowClassName={(record) => rowColorName[record.orderStatus]}
                    columns={columns}
                    onChange={this.handleTableChange}
                    pagination={this.state.pagination}
                  />
                </div>
              )}

              <div className="mapLayout">
                {/* <MapContainer/> */}

                {navermaps && (
                  <NaverMap
                    className="map-navermap"
                    defaultZoom={14}
                    center={{ lat: lat, lng: lng }}
                  >
                    <Marker
                    position={navermaps.LatLng(
                      this.state.selectedRiderLatitude,
                      this.state.selectedRiderLongitude
                    )}
                    icon={
                      require("../../../img/login/map/marker_rider_red.png")
                        .default
                    }
                    title={this.state.selRider.riderName}
                    onClick={() =>
                      this.getRiderLocate(this.state.selRider.idx)
                      }
                    />
                    

                    {this.state.allResults.map((row, index) => {
                      var flag = true;

                      if (flag) {
                        // console.log(this.state.selRider.idx, row.idx);
                        if (this.state.selectedRiderIdx !== row.idx) {
                          // 팀장 이상 파랑 마크
                          if (row.riderLevel >= 3) {
                            return (
                              <Marker
                                key={index}
                                position={navermaps.LatLng(
                                  row.riderLocation.latitude,
                                  row.riderLocation.longitude
                                )}
                                icon={
                                  require("../../../img/login/map/marker_rider_blue.png")
                                    .default
                                }
                                title={row.riderName}
                                onClick={() => this.getRiderLocate(row.idx)}
                              />
                            );
                          } else {
                            return (
                              <Marker
                                key={index}
                                position={navermaps.LatLng(
                                  row.riderLocation.latitude,
                                  row.riderLocation.longitude
                                )}
                                icon={
                                  require("../../../img/login/map/marker_rider.png")
                                    .default
                                }
                                title={row.riderName}
                                onClick={() => this.getRiderLocate(row.idx)}
                              />
                            );
                          }
                        }
                      }
                    })}

                        <Marker
                          position={navermaps.LatLng(
                            // 37.6510661,
                            // 126.6532953
                            this.state.frLocates[0],
                            this.state.frLocates[1]
                          )}
                          icon={
                            require("../../../img/login/map/marker_target.png")
                              .default
                          }
                          // title={row.riderName}
                          // onClick={() => this.getRiderLocate(row.idx)}
                        />

                      {this.state.frLocates.map((row, index) => {
                        <>
                        <Marker
                          key={index}
                          position={navermaps.LatLng(
                            row[0],
                            row[1]
                          )}
                          icon={
                            require("../../../img/login/map/marker_rider.png")
                              .default
                          }
                          // title={row.riderName}
                          // onClick={() => this.getRiderLocate(row.idx)}
                        />
                        </>
                      })
                      }
                    {this.state.selRider.latitude !== 0 &&
                      this.state.selRider.longitude !== 0 && (
                        <Polyline
                          path={this.state.selRiderPath}
                          strokeColor={"#ff0000"}
                          strokeWeight={5}
                        />
                      )}
                  </NaverMap>
                )}
              </div>

              {/* 콜 정보 */}
              {this.props.callData && (
                <>
                  <Table
                    rowKey={(record) => record.idx}
                    dataSource={this.props.callData.filter(x => x.orderStatus === 1)}
                    rowSelection={rowSelection}
                    columns={columns_callList}
                    rowClassName={(record) => rowColorName[record.orderStatus]}
                    pagination={this.state.paginationCallList}
                    onChange={this.handleCallListTableChange}
                    className="callDataTable"
                  />
                </>
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
                      pagination={this.state.paginationList}
                      onChange={this.handleListTableChange}
                    />
                  </div>
                </>
              )}
              {!this.state.riderListOpen && (
                <div
                  className="rider-list-show-btn"
                  onClick={() => this.setState({ riderListOpen: true })}
                >
                  열기
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MapControlDialog;
