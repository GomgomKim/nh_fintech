import React, { Component } from "react";
import '../../../css/modal.css';
import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Descriptions } from 'antd';
import { formatDate } from "../../../lib/util/dateUtil";
import "../../../css/order.css";
import { comma } from "../../../lib/util/numberUtil";
import MapContainer from "./MapContainer";
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../../api/httpClient';


const FormItem = Form.Item;
// const { Option } = Radio;
const Search = Input.Search;
const riderLevelText = ["none", "라이더", "부팀장", "팀장", "부본부장", "본부장", "부지점장", "지점장", "부센터장", "센터장"];


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
            riderLevel: [1],
        }
    }

    componentDidMount() {
        this.getList()
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
        this.setState({
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
    
    }

    getRiderList = () => {
        let pageNum = this.state.pagination.current;
        let riderLevel = this.state.riderLevel;
        let userData = this.state.userData;
    
        httpGet(httpUrl.riderList, [10, pageNum, riderLevel, userData], {}).then((result) => {
          console.log('## nnbox result=' + JSON.stringify(result, null, 4))
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

      
    render() {
        const { isOpen, close } = this.props;
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
              title: "도착지",
              dataIndex: "destination",
              className: "table-column-center",
            },
            {
              title: "주문시간",
              dataIndex: "orderTime",
              className: "table-column-center",
              render: (data) => <div>{formatDate(data)}</div>
            },
            {
              title: "배차시간",
              dataIndex: "completionTime",
              className: "table-column-center",
              render: (data) => <div>{formatDate(data)}</div>
            },
            {
              title: "픽업시간",
              dataIndex: "pickupTime",
              className: "table-column-center",
              render: (data) => <div>{formatDate(data)}</div>
            },
            {
              title: "경과(분)",
              dataIndex: "elapsedTime",
              className: "table-column-center",
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
              title: "가격",
              dataIndex: "charge",
              className: "table-column-center",
              render: (data) => <div>{comma(data)}</div>
            },
            {
              title: "배달 요금",
              dataIndex: "deliveryCharge",
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
              title: "카드상태",
              dataIndex: "preparationStatus",
              className: "table-column-center",
              render: (data) => <div>{data == 0 ? "요청" : "결제완료"}</div>
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

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="map-Dialog">

                                <div className="map-content">
                                    <div className="timeDelay-title">
                                        지도관제
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="map-close" />


                                    <div className="map-inner">
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

                                        <div className="textLayout">
                                            <span className="riderText">{this.state.riderName}의 배차 목록 &lt;{this.state.franchisee}&gt; </span>
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
                                            <Table
                                                className="riderListInMapControl"
                                                rowKey={(record) => record}
                                                dataSource={this.state.results}
                                                columns={columns_riderList}
                                                pagination={this.state.paginationRiderList}
                                                onChange={this.handleTableChange}
                                            />
                                        </div>
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