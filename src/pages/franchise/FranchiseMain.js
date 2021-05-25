import {Modal, Table, Button, Input} from 'antd';
import React, {Component} from 'react';
import {httpUrl, httpPost} from '../../api/httpClient';
import RegistFranDialog from "../../components/dialog/franchise/RegistFranDialog";
import SearchAddressDialog from "../../components/dialog/franchise/SearchAddressDialog";
import SearchFranchiseDialog from '../../components/dialog/common/SearchFranchiseDialog';
import BlindListDialog from "../../components/dialog/BlindListDialog";
import SelectBox from '../../components/input/SelectBox';
import "../../css/franchise.css";
import {comma} from "../../lib/util/numberUtil";
import {BankOutlined} from '@ant-design/icons';
import {formatDate} from '../../lib/util/dateUtil';
import { statusString, tableStatusString, withdrawString, cardStatus} from '../../lib/util/codeUtil';
import {
    updateComplete,
    updateError,
} from '../../api/Modals'

const Search = Input.Search;

class FranchiseMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            franchisee: "",
            pagination: {
                total: 0,
                current: 1,
                pageSize: 10
            },
            // test data
            list: [],
            withdrawSet: 0,
            franStatus: 0,
            frName: "",
            franGroup: 0,
            franSelectStatus: 0,
            ResistFranchiseOpen: false,
            modifyFranOpen: false,
            coinTransferOpen: false,
            SearchAddressOpen: false,
            dialogData: [],
            blindFrData: [],
            blindListOpen: false,
            searchFranchiseOpen: false
        };
    }

    componentDidMount() {
        this.getList()
        // console.log("props tag :"+this.props)
    }

    // 가맹점 검색
    onSearchFranchisee = (value) => {
        this.setState({
            frName: value
        }, () => {
            this.getList();
        })
    }

    handleTableChange = (pagination) => {
        console.log(pagination)
        const pager = {
            ...this.state.pagination
        };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.setState({
            pagination: pager
        }, () => this.getList());
    };

    getList = () => {
        console.log(this.state.franStatus)
        httpPost(httpUrl.franchiseList, [], {
            frName: this.state.frName,
            pageNum: this.state.pagination.current,
            userGroup: this.state.franGroup,
            userStatus: this.state.franStatus === 0 ? "" : this.state.franStatus
        }).then((result) => {
            console.log('## result=' + JSON.stringify(result, null, 4))
            const pagination = {
                ...this.state.pagination
            };
            pagination.current = result.data.currentPage;
            pagination.total = result.data.totalCount;
            this.setState({list: result.data.franchises, pagination});
        })
    }

    onSearchFranchiseDetail = (data) => {
        console.log("### get fran list data : " + data)
        // this.setState({list: data});
    }

    // 가맹점조회 dialog
    openSearchFranchiseModal = () => {
        this.setState({searchFranchiseOpen: true});
    }
    closeSearchFranchiseModal = () => {
        this.setState({searchFranchiseOpen: false});
    }

    // 가맹점등록 dialog
    openRegistFranchiseModal = () => {
        this.setState({ResistFranchiseOpen: true});
    }
    closeRegistFranchiseModal = () => {
        this.setState({ResistFranchiseOpen: false});
    }
    // 코인이체 dialog
    openCoinTransferModal = () => {
        this.setState({coinTransferOpen: true});
    }
    closeCoinTransferodal = () => {
        this.setState({coinTransferOpen: false});
    }

    // 가맹점수정 dialog 
    openModifyFranModal = (row) => {   
      this.setState({
        modifyFranOpen: true, 
        dialogData: row 
      }); 
    }
    
    closeModifyFranModal = () => {
        this.setState({modifyFranOpen: false});
        this.getList()
    }
    
    // 주소검색관리 dialog
    openSearchAddressModal = () => {
      this.setState({ SearchAddressOpen: true });
    }
    closeSearchAddressModal = () => {
      this.setState({ SearchAddressOpen: false });
    }

    // 블라인드 dialog
    openBlindModal = () => {
      this.setState({ blindListOpen: true });
    }
    closeBlindModal = () => {
      this.setState({ blindListOpen: false });
  }

    // 주소검색관리 dialog
    openSearchAddressModal = () => {
        this.setState({SearchAddressOpen: true});
    }
    closeSearchAddressModal = () => {
        this.setState({SearchAddressOpen: false});
    }

    // 출금설정
    onSetting = (value) => {
        let withdrawSet = value
        this.setState({
            withdrawSet: withdrawSet
        }, () => {
            this.getList();
        })
    }

    // 상태설정
    onStatusSetting = (value) => {
        let franStatus = value
        this.setState({
            franStatus: franStatus
        }, () => {
            this.getList();
        })
    }

    // 가맹점 상태변경
    onChangeStatus = (idx, value) => {
        httpPost(httpUrl.franchiseUpdate, [], {
            idx: idx,
            userStatus: value
        })
            .then((res) => {
                if (res.result === "SUCCESS") {
                    updateComplete()
                } else {
                    updateError()
                }
                this.getList();
            })
            .catch((e) => {
                updateError()
            });
    }


    // 출금설정 변경
    onChangeWithdraw = (idx, value) => {
        httpPost(httpUrl.franchiseUpdate, [], {
            idx: idx,
            withdrawEnabled: value
        })
            .then((res) => {
                if (res.result === "SUCCESS") {
                    updateComplete()
                } else {
                    updateError()
                }
                this.getList();
            })
            .catch((e) => {
                updateError()
            });
    }

    render() {
        const columns = [
            {
                title: "상태",
                dataIndex: "userStatus",
                className: "table-column-center",
                render: (data, row) => <div>
                        <SelectBox
                            value={statusString[data]}
                            code={Object.keys(statusString)}
                            codeString={statusString}
                            onChange={(value) => {
                                if (parseInt(value) !== row.userStatus) {
                                    this.onChangeStatus(row.idx, value);
                                }
                            }}/>
                    </div>
            }, {
                title: "순번",
                dataIndex: "idx",
                className: "table-column-center"
            }, {
                title: "가맹점명",
                dataIndex: "frName",
                className: "table-column-center"
            }, {
                title: "사업자번호",
                dataIndex: "businessNumber",
                className: "table-column-center"
            }, {
                title: "전화번호",
                dataIndex: "phone",
                className: "table-column-center"
            }, {
                title: "주소",
                dataIndex: "addr1",
                className: "table-column-center",
                render: (data, row) => <div>{row.addr1 + '' + row.addr2}</div>
            }, {
                title: "코인잔액",
                dataIndex: "ncash",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            }, {
                title: "기본배달요금",
                dataIndex: "basicDeliveryPrice",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            }, {
                title: "출금설정",
                dataIndex: "withdrawEnabled",
                className: "table-column-center",
                render: (data, row) => <div>
                        <SelectBox
                            value={withdrawString[data]}
                            code={Object.keys(withdrawString)}
                            codeString={withdrawString}
                            onChange={(value) => {
                                console.log(value, row.withdrawEnabled)
                                if (value !== row.withdrawEnabled.toString()) {
                                    this.onChangeWithdraw(row.idx, value);
                                }
                            }}/>
                    </div>
            }, {
                title: "이체",
                className: "table-column-center",
                render: () => <div>
                        <RegistFranDialog
                            isOpen={this.state.addFranchiseOpen}
                            close={this.closeAddFranchiseModal}/>
                        <Button className="tabBtn surchargeTab" onClick={this.openCoinTransferModal}>코인이체</Button>
                    </div>
            }, {
                title: "블라인드",
                className: "table-column-center",
                render: (data, row) => <div>
                        {/* <BlindListDialog isOpen={this.state.blindListOpen} close={this.closeBlindModal} data={this.state.blindFrData}/> */}
                        <Button className="tabBtn surchargeTab" onClick={()=>this.setState({blindListOpen: true, blindFrData: row})}>블라인드</Button>
                    </div>
            }, {
                title: "수정",
                className: "table-column-center",
                render: (data, row) => <div>
                        <RegistFranDialog isOpen={this.state.modifyFranOpen} close={this.closeModifyFranModal} data={this.state.dialogData}/>
                        <Button className="tabBtn surchargeTab"
                        onClick={() => this.setState({modifyFranOpen: true, dialogData: row})}>수정하기</Button>
                    </div>
            }
        ]

        const expandedRowRender = (record) => {
            const dropColumns = [
                {
                    title: "월회비 최초납부일",
                    dataIndex: "chargeDate",
                    className: "table-column-center",
                    render: (data) => <div>{formatDate(data)}</div>
                }, {
                    title: "적용타입",
                    dataIndex: "applyType",
                    className: "table-column-center",
                    render: (data) => <div>{'적용'}</div>
                }, {
                    title: "월회비",
                    dataIndex: "dues",
                    className: "table-column-center",
                    render: (data) => <div>{'100,000'}</div>
                }, {
                    title: "카드가맹상태",
                    dataIndex: "cardStatus",
                    className: "table-column-center",
                    render: (data) => <div>{cardStatus[data]}</div>
                }, {
                    title: "VAN",
                    dataIndex: "van",
                    className: "table-column-center",
                    render: (data) => <div>{'1233451245'}</div>
                }, {
                    title: "PG",
                    dataIndex: "businessCard",
                    className: "table-column-center",
                    render: (data) => <div>{'1233451245'}</div>
                }, {
                    title: "PG 사용여부",
                    dataIndex: "businessCardName",
                    className: "table-column-center",
                    render: (data) => <div>{'사용'}</div>
                }, {
                    title: "메모",
                    dataIndex: "memo",
                    className: "table-column-center"
                }, {
                    title: "가입일",
                    dataIndex: "businessDate",
                    className: "table-column-center",
                    render: (data) => <div>{'2021-04-29'}</div>
                }
            ];

            return (
                <Table
                    rowKey={(record) => `record: ${record.idx}`}
                    columns={dropColumns}
                    dataSource={[record]}
                    pagination={false}/>
            );
        };

        return (
            <div className="franchiseContainer">

                <div className="selectLayout">
                    <span className="searchRequirementText">검색조건</span><br/><br/>

                    <SelectBox
                        value={tableStatusString[this.state.franStatus]}
                        code={Object.keys(tableStatusString)}
                        codeString={tableStatusString}
                        onChange={(value) => {
                            if (parseInt(value) !== this.state.franStatus) {
                                this.setState({franStatus: parseInt(value)}, () => this.getList());
                            }
                        }}/>

                    <Search
                        placeholder="가맹점검색"
                        className="searchFranchiseInput"
                        enterButton
                        allowClear
                        onSearch={this.onSearchFranchisee}
                        style={{
                            
                        }}/>

                    <SearchFranchiseDialog
                        callback={(data) => this.onSearchFranchiseDetail(data)}
                        isOpen={this.state.searchFranchiseOpen}
                        close={this.closeSearchFranchiseModal}/>
                    <Button className="tabBtn" onClick={this.openSearchFranchiseModal}>가맹점조회</Button>
                    <RegistFranDialog
                        isOpen={this.state.ResistFranchiseOpen}
                        close={this.closeRegistFranchiseModal}/>
                    <Button
                        icon={<BankOutlined />}
                        className="tabBtn addFranTab"
                        onClick={this.openRegistFranchiseModal}>가맹점등록</Button>
                    <SearchAddressDialog
                        isOpen={this.state.SearchAddressOpen}
                        close={this.closeSearchAddressModal}/>
                    <Button className="tabBtn sectionTab" onClick={this.openSearchAddressModal}>주소검색관리</Button>

                </div>

                <div className="dataTableLayout">
                    <Table
                        rowKey={(record) => record.idx}
                        dataSource={this.state.list}
                        columns={columns}
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange}
                        expandedRowRender={expandedRowRender}/>
                </div>

            </div>
        )
    }
}
export default FranchiseMain;