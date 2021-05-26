import React, { Component } from "react";
import {
    Form, Table, Checkbox, Input, Button, Modal,
} from "antd";
import '../../../css/modal.css';
import { frRiderString, blockString } from '../../../lib/util/codeUtil';
import { httpPost, httpUrl } from "../../../api/httpClient";
import SelectBox from '../../../components/input/SelectBox';
import { formatDate } from "../../../lib/util/dateUtil";
import { connect } from "react-redux";
import SearchRiderDialog from "../../dialog/common/SearchRiderDialog";
import SearchFranchiseDialog from "../../dialog/common/SearchFranchiseDialog";
import { blindComplete, blindError, blindNowError, unBlindComplete, unBlindError } from "../../../api/Modals";
const FormItem = Form.Item;

class BlindFranListDialog extends Component {
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
            blindStatus: 1,
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
        console.log(pagination)
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize
        this.setState({
            pagination: pager,
        }, () => this.getList());
    };

    
    getList = () => {
        let { data } = this.props;
        let frIdx = data.idx;
        httpPost(httpUrl.blindList, [], {
            frIdx: frIdx,
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            deletedList: this.state.deletedCheck !== true ? [0] : [0, 1],
        })
        .then((res) => {
            if (res.result === "SUCCESS") {
                console.log(res);
                this.setState({
                    list: res.data.riderFrBlocks,
                });
            }
        })
    };

    onDeleteCheck = (e) => {
        this.setState({ deletedCheck: e.target.checked }
        ,() => { this.getList() }
        );
    };

    handleSubmit = (idx, deleted) =>{
        let self = this;
            Modal.confirm({
                title: "차단 등록",
                content: "새로운 차단을 등록하시겠습니까?",
                okText: "확인",
                cancelText: "취소",
                onOk() {
                    httpPost(httpUrl.registBlind, [], {
                        direction: self.state.blindStatus === 0 ? "" : self.state.blindStatus,
                        deleted: false,
                        frIdx: 10101,
                        memo: "차단 테스트 입니다asdasd",
                        riderIdx: 11357
                    }).then(
                        self.getList()
                    )
                }
            })
    }

    onDelete = (idx, deleted) => {
        let self = this;
        if (deleted == true) {
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
            blindNowError();
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
                render: (data, row) => <div>{data === 1 ? "기사" : "가맹점"}</div>
            },
            {
                title: "가맹점명",
                dataIndex: "frName",
                className: "table-column-center",
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
                            <SelectBox
                                placeholder={row.deleted !== true ? "차단중" : "차단해제"}
                                value={blockString[data]}
                                code={Object.keys(blockString)}
                                codeString={blockString}
                                onChange={(value) => {
                                    if (parseInt(value) !== row.deleted) {
                                        this.onDelete(row.idx, value);
                                    }
                                }}
                            />
                        </div>
                    ),
            },
        ];

        const { isOpen, close, data } = this.props;
        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="blind-Dialog">
                                <div className="blind-container">
                                    <div className="blind-title">
                                        블라인드 목록
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} 
                                    className="surcharge-close" alt='close'/>

                                    <div style={{
                                        textAlign: 'right',
                                        marginTop: 20,
                                        fontSize: 15
                                    }}>
                                        해제 포함
                                        <Checkbox
                                            defaultChecked={this.state.deletedCheck ? "checked" : ""}
                                            onChange={this.onDeleteCheck} />
                                    </div>

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
                                                <div className="subTitle">
                                                    차단자
                                            </div>
                                                <FormItem
                                                    name="direction"
                                                    className="selectItem"
                                                >
                                                    <SelectBox
                                                        placeholder={'선택'}
                                                        style={{ marginLeft:10 }}
                                                        value={frRiderString[this.state.blindStatus]}
                                                        code={Object.keys(frRiderString)}
                                                        codeString={frRiderString}
                                                        onChange={(value) => {
                                                            if (parseInt(value) !== this.state.blindStatus) {
                                                                this.setState({ blindStatus: parseInt(value) })
                                                                // alert(value)
                                                            }
                                                        }}
                                                    />
                                                </FormItem>
                                                <div className="subTitle">
                                                    가맹점명
                                                </div>
                                                <SearchFranchiseDialog
                                                    onSelect={(franChise) => {
                                                    this.setState({ selectedFr: franChise }
                                                    ,() => {});
                                                    }}
                                                    isOpen={this.state.searchFranchiseOpen}
                                                    close={this.closeSearchFranchiseModal}
                                                />
                                                <FormItem
                                                    name="frName"
                                                    className="selectItem"
                                                >
                                                    <Input placeholder="가맹점명 입력" className="override-input sub"
                                                        value={ this.state.selectedFr ? this.state.selectedFr.frName : ""}>
                                                    </Input>
                                                    <Button onClick={this.openSearchFranchiseModal}>
                                                    조회
                                                    </Button>
                                                </FormItem>

                                                <div className="subTitle">
                                                    기사명
                                                </div>
                                                <SearchRiderDialog
                                                    onSelect={(rider) => {
                                                    this.setState({ selectedRider: rider }
                                                    ,() => {});
                                                    }}
                                                    isOpen={this.state.searchRiderOpen}
                                                    close={this.closeSearchRiderModal}
                                                />
                                                <FormItem
                                                    name="riderName"
                                                    className="selectItem"
                                                    initialValue={data.riderName}
                                                >
                                                     <Input placeholder="기사명 입력" className="override-input sub"
                                                     value={ this.state.selectedRider ? this.state.selectedRider.riderName : data.riderName }>
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
                        :
                        null
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(BlindFranListDialog);