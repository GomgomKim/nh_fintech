import React, { Component } from "react";
import '../../../css/modal.css';
import { Form, Input, Table, Button, Modal, Select } from 'antd';
import { formatDate } from "../../../lib/util/dateUtil";
import "../../../css/order.css";
import { comma } from "../../../lib/util/numberUtil";
// import MapContainer from "./MapContainer";
import { httpGet, httpUrl, httpPost} from '../../../api/httpClient';
import { NaverMap, Marker, Polyline } from 'react-naver-maps';
import {
  riderLevelText,
  riderGroupString,
  modifyType,
  deliveryStatusCode,
  rowColorName,
  arriveReqTime
} from '../../../lib/util/codeUtil';
import{
  customError
} from '../../../api/Modals'


const Option = Select.Option;
const FormItem = Form.Item;
const navermaps = window.naver.maps;
// const { Option } = Radio;
const Search = Input.Search;
const lat = 37.643623625321474;
const lng = 126.66509442649551;

class MapControlDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            riderName: "",
            phoneNum: "",
            workTab: 0,
            pagination: {
              total: 0,
              current: 1,
              pageSize: 10,
            },
            paginationRiderList: {
                total: 0,
                current: 1,
                pageSize: 10,
            },

            // test data
            list: [],
            franchisee: "",

            // rider list
            riderListSave: [],
            results: [],
            riderStatus: 1,
            riderLevel: [1, 2],
            userData: 1,
            searchName: "",

            riderListOpen: false,
            selectedRider: '',

            // rider locate param
            selectedRiderIdx: 0,
            riderOrderList: [],

            // rider locate list
            riderLocates: [],

        }
    }

    componentDidMount() {
        //this.getList()
        this.getRiderList()
        this.getRiderLocateList()
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
        searchName: value,
      }, () => {
        this.getRiderList()
      })
    }

    onSearchWorkerSelected = (value) => {
      console.log(value)
      if(this.state.results.find(x => x.id === value)){
        var riderIdx = this.state.results.find(x => x.id === value).idx;
        var name = this.state.results.find(x => x.id === value).riderName;
        this.setState({
          selectedRiderIdx: riderIdx,
          riderName: name,
        }, () => {
          this.getList()
        })
      }
    }
    
    
    getList = (riderIdx)  => {
        let selectedRiderIdx
        if(riderIdx) selectedRiderIdx = riderIdx
        else selectedRiderIdx = this.state.selectedRiderIdx;
        console.log(selectedRiderIdx)
        httpGet(httpUrl.riderLocate, [selectedRiderIdx], {}).then((result) => {
          console.log('### nnbox result=' + JSON.stringify(result, null, 4))
          if(result.result === "SUCCESS"){
            if(result.data.orders.length > 0 && result.data != null){
              // console.log('### nnbox result=' + JSON.stringify(result.data.orders, null, 4))
            const pagination = { ...this.state.pagination };
            if(result.data != null){
              var list = result.data.orders;
              // console.log(list)
              this.setState({
                riderOrderList: list,
                pagination,
              });
            }
            else{
              this.setState({
                riderOrderList: [],
              });
            }
            } else {
              this.setState({
                riderOrderList: [],
              });
              customError("배차 목록 오류", "해당 라이더의 배차가 존재하지 않습니다.")
            }
            } else customError("배차 목록 오류", "배차목록을 불러오는 데 실패했습니다. 관리자에게 문의하세요.")
          
          
          
        })
    }

    getRiderLocateList = () => {
      httpGet(httpUrl.riderLocateList, [], {}).then((result) => {
        console.log('## riderLocates result=' + JSON.stringify(result, null, 4))
        this.setState({
          riderLocates: result.data.riderLocations,
        });
      })
    };

    getRiderLocate = (riderIdx) => {
      httpGet(httpUrl.riderLocate, [riderIdx], {}).then((result) => {
        console.log('## rider personal locate result=' + JSON.stringify(result, null, 4))
        this.setState({
          selectedRiderIdx: result.data.userIdx,
          riderName: result.data.riderName,
        }, () => {
          this.getList()
        })
      })
    };

    getRiderList = () => {
      let pageNum = this.state.paginationRiderList.current;
      let userStatus = 1;
      let searchName = this.state.searchName;
  
      httpGet(httpUrl.riderList, [10, pageNum, searchName, userStatus], {}).then((result) => {
        // console.log('## nnbox result=' + JSON.stringify(result, null, 4))
        const pagination = { ...this.state.paginationRiderList };
        pagination.current = result.data.currentPage;
        pagination.total = result.data.totalCount;
        this.setState({
          results: result.data.riders,
          paginationRiderList: pagination,
        });
      })
    };
    
    handleTableChange = (pagination) => {
        console.log(pagination)
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize
        this.setState({
          pagination: pager,
        }, () => this.getList());
    };

    handleRiderListTableChange = (pagination) => {
      console.log(pagination)
      const pager = { ...this.state.paginationRiderList };
      pager.current = pagination.current;
      pager.pageSize = pagination.pageSize
      this.setState({
        paginationRiderList: pager,
      }, () => this.getRiderList());
  };

      
    render() {
        const { isOpen, close } = this.props;

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
                    // console.log([row.pickupStatus, value]+" / "+modifyType[row.pickupStatus])
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
                      // const list = this.state.list;
                      // list.find((x) => x.idx === row.idx).orderStatus = value;
                      row.orderStatus = value;
                      httpPost(httpUrl.orderUpdate, [], row)
                        .then((res) => {
                          console.log(res);
                        })
                        .catch((e) => {});
                      this.getList();
                      // this.setState({
                      //   list: list,
                      // });
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
            render: (data, row) => <div>{row.destAddr1 + " " + row.destAddr2}</div>,
          },
          {
            title: "거리(km)",
            dataIndex: "distance",
            className: "table-column-center",
          },
        ];

        const columns_riderList = [
            {
              title: "아이디",
              dataIndex: "id",
              className: "table-column-center",
              width: "200px",
              render: (data) => <div className='riderName' onClick={()=>{
                this.onSearchWorkerSelected(data)
              }}>{data}</div>
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
              render: (data) => <div>{riderLevelText[data]}</div>
            },
            {
              title: "기사그룹",
              dataIndex: "userGroup",
              className: "table-column-center",
              render: (data) => <div>{riderGroupString[data]}</div>
            },
        ];

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="map-Dialog">

                                <div className="map-content">
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="map-close" />


                                    <div className="map-inner">

                                    {this.state.riderName && (
                                        <div className="riderTableLayout">
                                          <div className="textLayout">
                                              <span className="riderText">{this.state.riderName}의 배차 목록</span>
                                          </div>
                                            <Table
                                            rowKey={(record) => record.idx}
                                            dataSource={this.state.riderOrderList}
                                            rowClassName={(record) => rowColorName[record.orderStatus]}
                                            columns={columns}
                                            onChange={this.handleTableChange}
                                            pagination={false}
                                            />
                                        </div>
                                              )}

                                        <div className="mapLayout">
                                        
                                            {/* <MapContainer/> */}
                                            
                                            {navermaps &&
                                              <NaverMap
                                              className='map-navermap'
                                              defaultZoom={14}
                                              center={{ lat: lat, lng: lng }}
                                              >

                                              {
                                                this.state.riderLocates.map(row => {
                                                  // console.log(row.latitude, row.longitude)
                                                  return (
                                                    <Marker
                                                      position={navermaps.LatLng(row.latitude, row.longitude)}
                                                      
                                                      // icon={require('../../../img/login/map/marker_rider.png').default}
                                                      icon={require('../../../img/login/map/marker_rider_blue.png').default}
                                                      title={row.riderName}
                                                      onClick={()=>this.getRiderLocate(row.userIdx)}
                                                    />
                                                  );
                                                })
                                              }
                                              <Marker
                                                  position={navermaps.LatLng(37.6363194, 126.6641331)}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
                                              {/* {this.state.selectedRider == 55 && (
                                              <>
                                              
                                              <Marker
                                                  position={navermaps.LatLng(testPos[4][0], testPos[4][1])}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
                                              <Marker
                                                  position={navermaps.LatLng(testPos[5][0], testPos[5][1])}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
                                              <Marker
                                                  position={navermaps.LatLng(testPos[6][0], testPos[6][1])}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
                                              <Polyline 
                                                path={[
                                                  navermaps.LatLng(testPos[0][0], testPos[0][1]),
                                                  navermaps.LatLng(testPos[3][0], testPos[3][1]),
                                                  navermaps.LatLng(testPos[4][0], testPos[4][1]),
                                                ]}
                                                strokeColor={'#ff0000'}
                                                strokeWeight={5}        
                                              />
                                              <Polyline 
                                                path={[
                                                  navermaps.LatLng(testPos[0][0], testPos[0][1]),
                                                  navermaps.LatLng(testPos[5][0], testPos[5][1]),
                                                  navermaps.LatLng(testPos[6][0], testPos[6][1]),
                                                ]}
                                                strokeColor={'#5347AA'}
                                                strokeWeight={5}        
                                              />
                                              </>

                                              )}
                                              {this.state.selectedRider == 44 && (
                                              <>
                                              <Marker
                                                  position={navermaps.LatLng(testPos[7][0], testPos[7][1])}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
                                              <Marker
                                                  position={navermaps.LatLng(testPos[8][0], testPos[8][1])}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
                                              <Polyline 
                                                path={[
                                                  navermaps.LatLng(testPos[1][0], testPos[1][1]),
                                                  navermaps.LatLng(testPos[7][0], testPos[7][1]),
                                                  navermaps.LatLng(testPos[8][0], testPos[8][1]),
                                                ]}
                                                strokeColor={'#ff0000'}
                                                strokeWeight={5}        
                                              />
                                              </>

                                              )}

                                              <Marker
                                                  position={navermaps.LatLng(lat, lng)}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
                                              <Marker
                                                  position={navermaps.LatLng(lat, lng)}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />

                                              <Marker
                                                  position={navermaps.LatLng(lat, lng)}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
                                              <Marker
                                                  position={navermaps.LatLng(this.props.frLat, this.props.frLng)}
                                                  icon={require('../../../img/login/map/marker_target.png').default}
                                              /> */}
                                              </NaverMap>
                                              
                                            }
                                           
                                            
                                            
                                        </div>
                                        {this.state.riderListOpen && (
                                          <>
                                          <div className="rider-list-show-btn" onClick={()=>this.setState({riderListOpen: false})}>
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
                                                    pagination={this.state.paginationRiderList}
                                                    onChange={this.handleRiderListTableChange}
                                                />
                                            </div>
                                          </>
                                        )}
                                        {!this.state.riderListOpen && (
                                            <div className="rider-list-show-btn" onClick={()=>this.setState({riderListOpen: true})}>
                                              열기
                                            </div>
                                        )}
                                    </div>


                                </div>
                            </div>
                        </React.Fragment>
                        :
                        null
                }
            </React.Fragment>
        )
    }
}

export default (MapControlDialog);