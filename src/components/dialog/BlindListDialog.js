import React, { Component } from "react";
import {
    Form, Table, Checkbox, Input, Button, Modal,
} from "antd";
import '../../css/modal.css';
import { frRiderString, blockString } from '../../lib/util/codeUtil';
import { httpPost, httpUrl } from "../../api/httpClient";
import SelectBox from '../../components/input/SelectBox';
import { formatDate } from "../../lib/util/dateUtil";
import { connect } from "react-redux";
import { blindComplete, blindError, blindNowError, unBlindComplete, unBlindError } from "../../api/Modals";
const FormItem = Form.Item;

class BlindListDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            deletedCheck: false
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getList()
    }
    componentDidUpdate() {

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

    onDelete = (idx) => {
        Modal.confirm({
            title: "차단 해제",
            content: "차단을 해제하시겠습니까?",
            okText: "확인",
            cancelText: "취소",
            onOk() {
                httpPost(httpUrl.deleteBlind, [], {
                    idx: idx,
                })
                    .then((res) => {
                        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                            console.log(res.result);
                            this.getList();
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
            }
        })
    }

    getList = () => {
        let { data } = this.props;
        let riderIdx = data.idx;
        httpPost(httpUrl.blindList, [], {
            riderIdx: riderIdx,
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            deletedList: [0],
        })
            .then((res) => {
                if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                    console.log(res);
                    this.setState({
                        list: res.data.riderFrBlocks,
                    });
                }
            })
    };

    getDeletedList = () => {
        let { data } = this.props;
        let riderIdx = data.idx;
        httpPost(httpUrl.blindList, [], {
            riderIdx: riderIdx,
            deletedList: [0, 1],
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
        })
            .then((res) => {
                this.setState({
                    list: res.data.riderFrBlocks,
                });
            })
    };


    getUserList = () => {

    }

    onDeleteCheck = (e) => {
        // alert(e)
        this.setState(
            {
                deletedCheck: e.target.checked,
            },
            () => {
                if (!this.state.deletedCheck) {
                    this.getList();
                } else {
                    this.getDeletedList();
                }
            }
        );
    };

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
                            {/* <Button className="tabBtn surchargeTab" 
                                onClick={(value)=>this.onDelete(row.idx, row.deleted)}>
                            {row.deleted === false ? "차단중" : "차단해제"}</Button> */}
                        </div>
                    ),
            },
        ];

        const { isOpen, close, data } = this.props;
        // console.log(JSON.stringify(data))
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
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="surcharge-close" />

                                    <div style={{
                                        textAlign: 'right',
                                        marginTop: 20,
                                        fontSize: 15
                                    }}>
                                        해제 포함
                                        <Checkbox
                                            defaultChecked={this.state.checkedCompleteCall ? "checked" : ""}
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
                                                // initialValue={this.props.loginInfo.id}
                                                >
                                                    <SelectBox
                                                        value={frRiderString[this.state.blindStatus]}
                                                        code={Object.keys(frRiderString)}
                                                        codeString={frRiderString}
                                                        onChange={(value) => {
                                                            if (parseInt(value) !== this.state.blindStatus) {
                                                                this.setState({ blindStatus: parseInt(value) })
                                                            }
                                                        }}
                                                    />
                                                </FormItem>
                                                <div className="subTitle">
                                                    가맹점명
                                            </div>
                                                <FormItem
                                                    name="frName"
                                                    className="selectItem"
                                                >
                                                    <Input placeholder="가맹점명 입력" className="override-input sub">
                                                    </Input>
                                                </FormItem>
                                                <div className="subTitle">
                                                    기사명
                                            </div>
                                                <FormItem
                                                    name="riderName"
                                                    className="selectItem"
                                                    initialValue={data.riderName}
                                                >
                                                    <Input placeholder="기사명 입력" className="override-input sub">
                                                    </Input>
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

export default connect(mapStateToProps, mapDispatchToProps)(BlindListDialog);