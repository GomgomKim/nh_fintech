import React, { Component } from "react";
import '../../../css/modal.css';
import { Form, Input, Table, Button } from 'antd';
import { formatDate } from "../../../lib/util/dateUtil";
import "../../../css/order.css";
import { comma } from "../../../lib/util/numberUtil";
// import MapContainer from "./MapContainer";
import { httpGet, httpUrl} from '../../../api/httpClient';
import { NaverMap, Marker, Polyline } from 'react-naver-maps';



const FormItem = Form.Item;
const navermaps = window.naver.maps;
// const { Option } = Radio;
const Search = Input.Search;
const riderLevelText = ["none", "라이더", "부팀장", "팀장", "부본부장", "본부장", "부지점장", "지점장", "부센터장", "센터장"];
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
                pageSize: 5,
            },
            // test data
            list: [],
            franchisee: "",
            // rider list
            results: [],
            riderStatus: 1,
            riderLevel: [1, 2],
            userData: 1,

            riderListOpen: false,
            selectedRider: '',

            // rider locate param
            selectedRiderIdx: 0,
            riderOrderList: [],
        }
    }

    componentDidMount() {
        //this.getList()
        this.getRiderList()
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
        var riderIdx = this.state.results.find(x => x.id == value).idx;
        this.setState({
          selectedRiderIdx: riderIdx,
          riderName: value,
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
        let selectedRiderIdx = this.state.selectedRiderIdx;
        console.log(selectedRiderIdx)
        httpGet(httpUrl.riderLocate, [selectedRiderIdx], {}).then((result) => {
          // console.log('### nnbox result=' + JSON.stringify(result, null, 4))
          const pagination = { ...this.state.pagination };
          // console.log('### nnbox result=' + JSON.stringify(result.data.orders, null, 4))
          var list = [result.data.orders];
          console.log(list)
          this.setState({
            riderOrderList: list,
            pagination,
          });
        })
    
        /* var list = [
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
        ]; */
        
    }
    
    getRiderList = () => {
        let pageNum = this.state.pagination.current;
        let riderLevel = this.state.riderLevel;
        let userData = this.state.userData;
    
        httpGet(httpUrl.riderList, [10, pageNum, riderLevel, userData], {}).then((result) => {
          console.log('### nnbox result=' + JSON.stringify(result, null, 4))
          const pagination = { ...this.state.pagination };
          pagination.current = result.data.currentPage;
          pagination.total = result.data.totalCount;
          this.setState({
            results: result.data.riders,
            pagination,
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
      }, () => this.getList());
  };

      
    render() {
        const { isOpen, close } = this.props;

        const columns = [
          {
            title: "상태",
            dataIndex: 0,
            className: "table-column-center",
            render: (data) => <div>{data.orderStatus == 1 ? "대기중"
              : data.orderStatus == 2 ? "픽업중"
                : data.orderStatus == 3 ? "배달중"
                  : data.orderStatus == 4 ? "완료" : "취소"}</div>
          },
          {
            title: "주문시간",
            dataIndex: 0,
            className: "table-column-center",
            render: (data) => <div>{formatDate(data.orderDate)}</div>
          },
          {
            title: "가맹점명",
            dataIndex: 0,
            className: "table-column-center",
            render: (data) => <div>{data.frName}</div>

          },
          {
            title: "가격",
            dataIndex: 0,
            className: "table-column-center",
            render: (data) => <div>{comma(data.orderPrice)}</div>
          },
          {
            title: "배달 요금",
            dataIndex: 0,
            className: "table-column-center",
            render: (data) => <div>{comma(data.deliveryPrice)}</div>
          },
          {
            title: "도착지",
            dataIndex: 0,
            className: "table-column-center",
            render: (data) => <div>{data.destAddr1+" "+data.destAddr2+" "+data.destAddr3}</div>
          },
          {
            title: "배차시간",
            dataIndex: 0,
            className: "table-column-center",
            render: (data) => <div>{formatDate(data.assignDate)}</div>
          },
          {
            title: "완료시간",
            dataIndex: 0,
            className: "table-column-center",
            render: (data) => <div>{formatDate(data.arriveReqDate)}</div>
          },
          /* {
            title: "결제방식",
            dataIndex: 0,
            className: "table-column-center",
            render: (data, row) => <div>{data == 0 ? "선결" : "카드"}</div>
          },
          {
            title: "카드상태",
            dataIndex: "orderPayments",
            className: "table-column-center",
            // render: (data) => <div>{data == 0 ? "요청" : "결제완료"}</div>
          }, */
        ];

        const columns_riderList = [
            {
              title: "지사명",
              dataIndex: "id",
              className: "table-column-center",
            },
            {
              title: "기사명",
              dataIndex: "riderName",
              className: "table-column-center",
              render: (data) => <div style={{cursor: 'pointer'}} onClick={()=>{
                this.setState({selectedRider: 55})
                this.onSearchWorker(data)
              }}>{data}</div>
            },
            {
              title: "아이디",
              dataIndex: "id",
              className: "table-column-center",
              width: "200px",
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
              render: (data) => <div>{data == "A" ? "A"
                : data == "B" ? "B"
                  : data == "C" ? "C"
                    : data == "D" ? "D" : "-"}</div>
            },
        ];

        const testPos = [
          [37.643623625321474, 126.66509442649551],
          [37.64343886140538, 126.65834481723877],
          [37.65596523546722, 126.6787078755755],
          [37.65733896727498, 126.63144924895946],
          [37.640731270645524, 126.62466156284721],
          [37.63693239487243, 126.669317392533],
          [37.66251043552984, 126.61328070568158],
          [37.65842985383964, 126.65206748346581],
          [37.635598700929414, 126.65467028039605],
          [37.66368204625145, 126.67901408697905],
          [37.64444913118349, 126.59990947439282],
          [37.6370536385893, 126.67334917601319],
        ]
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
                                            dataSource={this.state.riderOrderList}
                                            columns={columns}
                                            onChange={this.handleTableChange}
                                            pagination={false}
                                            />
                                        </div>
                                              )}

                                        <div className="mapLayout">
                                        
                                            {/* <MapContainer/> */}
                                            {/*
                                            {navermaps &&
                                              <NaverMap
                                              className='map-navermap'
                                              defaultZoom={14}
                                              center={{ lat: lat, lng: lng }}
                                              >
                                              <Marker
                                                  position={navermaps.LatLng(testPos[0][0], testPos[0][1])}
                                                  icon={require('../../../img/login/map/marker_target.png').default}
                                                  title="강재훈"
                                                  onClick={()=>this.setState({selectedRider: 55})}
                                              />
                                              <Marker
                                                  position={navermaps.LatLng(testPos[1][0], testPos[1][1])}
                                                  icon={require('../../../img/login/map/marker_target.png').default}
                                                  title="김길동"
                                                  onClick={()=>this.setState({selectedRider: 44})}
                                              />
                                              <Marker
                                                  position={navermaps.LatLng(testPos[2][0], testPos[2][1])}
                                                  icon={require('../../../img/login/map/marker_target.png').default}
                                                  title="문재인"
                                                  onClick={()=>this.setState({selectedRider: 0})}
                                              />
                                              {this.state.selectedRider == 55 && (
                                              <>
                                              <Marker
                                                  position={navermaps.LatLng(testPos[3][0], testPos[3][1])}
                                                  icon={require('../../../img/login/map/marker_rider.png').default}
                                              />
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
                                              />
                                              </NaverMap>
                                              
                                            }
                                            */}
                                            
                                            
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
                                                    rowKey={(record) => record}
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