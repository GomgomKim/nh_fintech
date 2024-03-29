import { Button, Checkbox, Form, Input, Modal, Table } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { httpGet, httpPost, httpUrl } from "../../../api/httpClient";
import {
    blindComplete, blindError, unBlindComplete, unBlindError,
    unBlindAgree, unBlindDeny, unBlindAgreeError
} from "../../../api/Modals";
import '../../../css/modal.css';
import '../../../css/modal_m.css';
import { blockStatusString, blockString, frRiderString } from '../../../lib/util/codeUtil';
import { formatDate } from "../../../lib/util/dateUtil";
import SelectBox from '../../input/SelectBox';
import SearchFranchiseDialog from "../common/SearchFranchiseDialog";
import SearchRiderDialog from "../common/SearchRiderDialog";
const FormItem = Form.Item;

class BlindControlDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            deletedCheck: false,
            selectedRider: null,
            selectedFr: null,
            searchRiderOpen: false,
            searchFranchiseOpen: false,
            blindDirection: 0,
            // blindStatus: [0,1,2,3],
            direction: [1, 2]
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getList()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isOpen !== this.props.isOpen) {
            this.getList()
        }
    }

    handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize
        this.setState({
            pagination: pager,
        }, () => this.getList());
    };


    getList = () => {
        let pageNum = this.state.pagination.current;
        let pageSize = this.state.pagination.pageSize;
        // let blindStatus = this.state.blindStatus
        let direction = this.state.direction
        let blindList = this.state.deletedCheck !== true ? [0] : [0, 1];
        httpGet(httpUrl.blindAllList, [blindList, direction, pageSize, pageNum], {}).then((res) => {
            console.log(res)
            const pagination = { ...this.state.pagination };
            pagination.current = res.data.currentPage;
            pagination.total = res.data.totalCount;
            this.setState({
                list: res.data.riderFrBlocks,
                //   pagination,
            });
        });
    };

    // getList = () => {
    //     httpt(httpUrl.blindAllList, [], {
    //         pageNum: this.state.pagination.current,
    //         pageSize: this.state.pagination.pageSize,
    //         deletedList: this.state.deletedCheck !== true ? [0] : [0, 1],
    //         status:1
    //     })
    //     .then((res) => {
    //         if (res.result === "SUCCESS") {
    //             this.setState({
    //                 list: res.data.riderFrBlocks,
    //             })
    //         }
    //         else {
    //             Modal.info({
    //                 title: "목록 에러",
    //                 content: (
    //                     <div>
    //                         에러가 발생하여 목록을 불러올수 없습니다.
    //                     </div>
    //                 ),
    //             });
    //         }
    //     })
    // };

    handleSubmit = () => {
        const form = this.formRef.current;
        let self = this;
        Modal.confirm({
            title: "차단 등록",
            content: "새로운 차단을 등록하시겠습니까?",
            okText: "확인",
            cancelText: "취소",
            onOk() {
                httpPost(httpUrl.registBlind, [], {
                    direction: self.state.blindDirection === 0 ? "" : self.state.blindDirection,
                    deleted: false,
                    frIdx: self.state.selectedFr.idx,
                    memo: form.getFieldValue('memo'),
                    riderIdx: self.state.selectedRider.idx
                }).then((result) => {
                    if (result.result === "SUCCESS" && result.data === "SUCCESS") {
                        blindComplete();
                        self.handleClear();
                        self.getList();
                        // self.setState({
                        //     pagination: {
                        //         current: 1,
                        //         pageSize: 5,
                        //     },
                        // }, () => self.getList());
                    } else {
                        blindError();
                    }
                })
                    .catch((e) => {
                        blindError();
                    });
            }
        })
    }

    handleClear = () => {
        this.formRef.current.resetFields();
    };

    onDeleteCheck = (e) => {
        this.setState({ deletedCheck: e.target.checked }
            , () => { this.getList() }
        );
    };

    onDelete = (idx, deleted) => {
        let self = this;
        if (deleted !== true) {
            Modal.confirm({
                title: "차단 해제",
                content: "차단을 해제하시겠습니까?",
                okText: "확인",
                cancelText: "취소",
                onOk() {
                    httpPost(httpUrl.deleteBlind, [], {
                        idx: idx,
                    })
                        .then((result) => {
                            if (result.result === "SUCCESS") {
                                unBlindComplete();
                                self.getList();
                            } else {
                                unBlindError();
                            }
                            self.getList();
                        })
                        .catch((e) => {
                            unBlindError();
                        });
                }
            })
        }
        else {
            unBlindError();
        }
    }


    // 승인대기 or 승인거부로 상태변경
    onChangeDeletedStatus = (idx, value) => {
        let self = this;
        if (parseInt(value) === 2) {
            Modal.confirm({
                title: "승인 완료",
                content: "해당 블라인드를 승인하시겠습니까?",
                okText: "확인",
                cancelText: "취소",
                onOk() {
                    httpPost(httpUrl.statusBlind, [], {
                        idx: idx,
                        status: 2
                    })
                        .then((result) => {
                            if (result.result === "SUCCESS") {
                                unBlindAgree();
                                self.getList();
                            } else {
                                unBlindAgreeError();
                            }
                            self.getList();
                        })
                        .catch((e) => {
                            unBlindAgreeError();
                        });
                }
            })
        }
        else {
            Modal.confirm({
                title: "승인 거부",
                content: "해당 블라인드 승인을 거부하시겠습니까?",
                okText: "확인",
                cancelText: "취소",
                onOk() {
                    httpPost(httpUrl.statusBlind, [], {
                        idx: idx,
                        status: 3
                    })
                        .then((result) => {
                            if (result.result === "SUCCESS") {
                                httpPost(httpUrl.deleteBlind, [], {
                                    idx: idx,
                                }).then(() => {
                                    unBlindDeny();
                                    self.getList();
                                })

                            } else {
                                unBlindAgreeError();
                            }
                            self.getList();
                        })
                        .catch((e) => {
                            unBlindAgreeError();
                        });
                }
            })
        }
    }


    // 가맹점조회 dialog
    openSearchFranchiseModal = () => {
        this.setState({ searchFranchiseOpen: true });
    };
    closeSearchFranchiseModal = () => {
        this.setState({ searchFranchiseOpen: false });
    };

    // 기사조회 dialog
    openSearchRiderModal = () => {
        this.setState({ searchRiderOpen: true });
    };
    closeSearchRiderModal = () => {
        this.setState({ searchRiderOpen: false });
    };

    render() {
        const columns = [
            {
                title: "차단자",
                dataIndex: "direction",
                className: "table-column-center",
                render: (data, row) =>
                    <div>
                        {data === 1 ?
                            <div style={{ color: 'blue', fontWeight: 'bold' }}>기사</div>
                            : <div style={{ color: 'red', fontWeight: 'bold' }}>가맹점</div>
                        }
                    </div>
            },
            {
                title: "가맹점명",
                dataIndex: "frName",
                className: "table-column-center",
                render: (data) => <div className="elipsis-table-row">{data}</div>
            },
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
            },
            {
                title: "차단메모",
                dataIndex: "memo",
                className: "table-column-center",
                render: (data) => <div className="elipsis-table-row">{data}</div>
            },
            {
                title: "설정일",
                dataIndex: "createDate",
                className: "table-column-center",
                render: (data) => <div>{formatDate(data)}</div>,
            },
            {
                title: "해제일",
                dataIndex: "deleteDate",
                className: "table-column-center",
                render: (data) => <div>{formatDate(data)}</div>,
            },
            {
                title: "상태",
                dataIndex: "deleted",
                className: "table-column-center",
                render:
                    (data, row) => (
                        <div>
                            {row.status !== 1 ?
                                data !== true ? blockString[1] : blockString[2] :
                                row.status === 1 && data == true ?
                                    blockString[4] : blockString[0]}
                        </div>
                    ),
            },
            {
                title: "처리",
                className: "table-column-center",
                render: (data, row) =>
                    <>
                        {/* {console.log(row.idx)} */}
                        {row.status === 1 &&
                            row.direction === 1 &&
                            row.deleted !== true &&
                            <div>
                                <SelectBox
                                    value={blockStatusString[data]}
                                    code={Object.keys(blockStatusString)}
                                    codeString={blockStatusString}
                                    placeholder={"승인대기"}
                                    onChange={(value) => {
                                        console.log(value, row.status);
                                        if (value !== row.status.toString()) {
                                            this.onChangeDeletedStatus(row.idx, value);
                                        }
                                    }}
                                />
                            </div>
                        }

                        {row.status === 2 &&
                            <div>
                                {row.deleted !== true ?
                                    <Button
                                        onClick={(value) => {
                                            if (parseInt(value) !== row.deleted) {
                                                this.onDelete(row.idx, row.deleted);
                                            }
                                        }}>해제</Button>
                                    :
                                    ''
                                }
                            </div>
                        }

                    </>

            },
        ];

        const { close } = this.props;
        return (

            <React.Fragment>
                <div className="Dialog-overlay" onClick={close} />
                <div className="blind-Dialog">
                    <div className="blind-container">
                        <div className="blind-title">
                            블라인드 관리
                        </div>
                        <Checkbox
                            style={{ marginRight: 5, marginLeft: 20 }}
                            defaultChecked={this.state.deletedCheck ? "checked" : ""}
                            onChange={this.onDeleteCheck} />
                        <div className="blind-check-text">
                            해제 포함
                        </div>

                        <img onClick={close} src={require('../../../img/login/close.png').default}
                            className="blind-close" alt='close' />

                        <div className="blindLayout">
                            <div className="listBlock">
                                <Table
                                    // rowKey={(record) => record.idx}
                                    dataSource={this.state.list}
                                    columns={columns}
                                    pagination={this.state.pagination}
                                    onChange={this.handleTableChange}
                                />
                            </div>

                        </div>
                        <div className="blindWrapper bot">
                            <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                <div className="contentBlock">
                                    <div className="mainTitle">
                                        차단자
                                    </div>
                                    <FormItem
                                        name="direction"
                                        className="selectItem"
                                        rules={[{ required: true, message: "차단자를 선택해주세요." }]}
                                    >
                                        <SelectBox
                                            placeholder={'선택'}
                                            style={{ marginLeft: 10 }}
                                            value={frRiderString[this.state.blindDirection]}
                                            code={Object.keys(frRiderString)}
                                            codeString={frRiderString}
                                            onChange={(value) => {
                                                if (parseInt(value) !== this.state.blindDirection) {
                                                    this.setState({ blindDirection: parseInt(value) })
                                                    // alert(value)
                                                }
                                            }}
                                        />
                                    </FormItem>
                                    <div className="subTitle">
                                        가맹점명
                                    </div>
                                    {this.state.searchFranchiseOpen &&
                                        <SearchFranchiseDialog
                                            close={this.closeSearchFranchiseModal}
                                            callback={(data) => this.setState({
                                                selectedFr: data
                                            })}
                                        />}
                                    <FormItem
                                        name="frName"
                                        className="selectItem"
                                    >
                                        <Input placeholder="가맹점명 입력" className="override-input sub" required
                                            value={this.state.selectedFr ? this.state.selectedFr.frName : ""}>
                                        </Input>
                                        <Button onClick={this.openSearchFranchiseModal}>
                                            조회
                                        </Button>
                                    </FormItem>

                                    <div className="subTitle">
                                        기사명
                                    </div>
                                    {this.state.searchRiderOpen &&
                                        <SearchRiderDialog
                                            close={this.closeSearchRiderModal}
                                            callback={(data) => this.setState({
                                                selectedRider: data
                                            })}
                                        />}
                                    <FormItem
                                        name="riderName"
                                        className="selectItem"
                                    >
                                        <Input placeholder="기사명 입력" className="override-input sub" required
                                            value={this.state.selectedRider ? this.state.selectedRider.riderName : ""}>
                                        </Input>
                                        <Button onClick={this.openSearchRiderModal}>
                                            조회
                                        </Button>
                                    </FormItem>

                                    <div className="subTitle">
                                        메모
                                    </div>
                                    <FormItem
                                        name="memo"
                                        className="selectItem"
                                        rules={[{ required: true, message: "차단 메모를 입력해주세요." }]}
                                    >
                                        <Input placeholder="차단메모 입력" className="override-input sub">
                                        </Input>
                                    </FormItem>

                                    <Button type="primary" htmlType="submit" className="callTab">
                                        차단하기
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.login.loginInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BlindControlDialog);