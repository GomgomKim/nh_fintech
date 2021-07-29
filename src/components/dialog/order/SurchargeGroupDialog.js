import React, { Component } from "react";
import { Table, Button, Tag, Modal } from "antd";
import '../../../css/modal.css';
import '../../../css/modal_m.css';
import SurchargeFrGroupDialog from "./SurchargeFrGroupDialog";
import SearchFranchiseDialog from "../../dialog/common/SearchFranchiseDialog";
import { httpUrl, httpPost } from '../../../api/httpClient';
import { connect } from "react-redux";
import { customAlert, customError } from "../../../api/Modals";

class SurchargeGroupDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            addFranchiseOpen: false,
            registGroupOpen: false,
            selectedFr: null,
            selectFrIdx: 0,
            frSettingGroupIdx: 0,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getList()
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

    // 지점에 해당된 그룹 리스트
    getList = () => {
        httpPost(httpUrl.priceExtraGroupList, [], {
            branchIdx: this.props.branchIdx,
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
        })
            .then((res) => {
                if (res.result === "SUCCESS") {
                    this.setState({
                        list: res.data.frSettingGroups,
                    })
                }
                else {
                    customAlert("목록 에러",
                        "에러가 발생하여 목록을 불러올수 없습니다.")
                }
            })
            .catch((e) => {
                customAlert("목록 에러",
                    "에러가 발생하여 목록을 불러올수 없습니다.")
            });
    };

    // 그룹삭제
    deleteGroup = (row) => {
        let self = this;
        Modal.confirm({
            title: "그룹 삭제",
            content: row.settingGroupName + " 그룹을 삭제하시겠습니까?",
            okText: "확인",
            cancelText: "취소",
            onOk() {
                let idx = row.idx
                httpPost(httpUrl.priceExtraDeleteGroup, [], {
                    idx,
                })
                    .then((res) => {
                        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                            customAlert("그룹 삭제",
                                row.settingGroupName + " 그룹을 삭제하였습니다.")
                            self.getList();
                        }
                        else {
                            customError("삭제 에러",
                                "에러가 발생하여 그룹을 삭제할수 없습니다.")
                        }
                    })
                    .catch((e) => {
                        customError("삭제 에러",
                            "그룹안에 가맹점이 존재 할 경우 삭제할수 없습니다.")
                    });
            }
        })
    }

    // 그룹에서 가맹점 삭제
    deleteFranchise = (row) => {
        let idx = row.idx
        httpPost(httpUrl.franchiseUpdate, [], {
            idx,
            frSettingGroupIdx: 0,
        })
            .then((res) => {
                if (res.result === "SUCCESS") {
                    customAlert("가맹점 삭제",
                        row.frName + " 가맹점을 삭제하였습니다.")
                    this.getList();
                }
                else {
                    customError("삭제 에러",
                        "에러가 발생하여 그룹을 삭제할수 없습니다.")
                }
            })
            .catch((e) => {
                customError("삭제 에러",
                    "에러가 발생하여 그룹을 삭제할수 없습니다.")
            });
    }

    // 그룹에 가맹점 추가
    registGroupFranchise = (data) => {
        this.setState({ selectFrIdx: data.idx }
            , () => {
                let self = this;
                let idx = this.state.selectFrIdx;
                let frSettingGroupIdx = this.state.frSettingGroupIdx;
                Modal.confirm({
                    title: "가맹점 추가",
                    content: "그룹에 가맹점을 추가하시겠습니까?",
                    okText: "확인",
                    cancelText: "취소",
                    onOk() {
                        httpPost(httpUrl.franchiseUpdate, [], {
                            idx,
                            frSettingGroupIdx,
                        })
                            .then((res) => {
                                if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                                    customAlert("가맹점 추가", " 그룹에 가맹점을 추가하였습니다.")
                                    self.getList();
                                }
                                else {
                                    customError("추가 에러", "에러가 발생하여 가맹점을 추가할수 없습니다.")
                                }
                            })
                            .catch((e) => {
                                customError("추가 에러", "에러가 발생하여 가맹점을 추가할수 없습니다.")
                            });
                    }
                })
            })

    }

    // 가맹점 그룹추가 dialog
    openAddFranchiseModal = (row) => {
        this.setState({ addFranchiseOpen: true, frSettingGroupIdx: row.idx });
    }
    closeAddFranchiseModal = () => {
        this.setState({ addFranchiseOpen: false });
    }

    // 그룹 등록 dialog
    openRegistGroupModal = () => {
        this.setState({ registGroupOpen: true });
    }
    closeRegistGroupModal = () => {
        this.setState({ registGroupOpen: false });
        this.getList()
    }


    render() {

        const columns = [
            {
                title: "그룹명",
                dataIndex: "settingGroupName",
                className: "table-column-center",
            },
            {
                title: "가맹점 추가",
                className: "table-column-center",
                width: 175,
                render: (data, row) =>
                    <div>
                        <Button
                            className="tabBtn"
                            onClick={() => { this.openAddFranchiseModal(row) }}
                        >추가</Button>
                    </div>
            },
            {
                className: "table-column-center",
                width: 175,
                render: (data, row) =>
                    <div>
                        <Button
                            className="tabBtn"
                            onClick={() => this.deleteGroup(row)}
                        >삭제</Button>
                    </div>
            },
        ];


        const expandedRowRender = (record) => {
            const dropColumns = [
                {
                    dataIndex: "frName",
                    className: "table-column-center",
                    render: (data, row) =>
                        <>
                            <Tag
                                // key={row.frIdx}
                                closable
                                style={{ fontSize: 15, padding: 5 }}
                                onClose={() => this.deleteFranchise(row)}
                            >
                                <div className="elipsis-table-row">{data}</div>
                            </Tag>
                        </>
                },
            ];
            return (
                <Table
                    className="subTable"
                    rowKey={(record) => `record: ${record.idx}`}
                    columns={dropColumns}
                    dataSource={(record.frs)}
                    pagination={false}
                />
            );
        }


        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="surchargeGroupList-Dialog">

                                <div className="surchargeGroupList-content">
                                    <div className="surchargeGroupList-title">
                                        할증 그룹관리
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default}
                                        className="taskGroup-close" alt='close' />
                                    <div className="surchargeGroupList-inner">

                                        <div className="surchargeGroupList-btn">
                                            <div className="surchargeGroupList-btn-01">
                                                <SurchargeFrGroupDialog isOpen={this.state.registGroupOpen} close={this.closeRegistGroupModal} />
                                                <Button
                                                    className="tabBtn surchargeGroupList-btn"
                                                    onClick={() => { this.openRegistGroupModal() }}
                                                >그룹등록</Button>
                                            </div>

                                        </div>
                                        <div>* 가맹점은 하나의 그룹에만 속할 수 있습니다. A그룹에 속한 가맹점을 B그룹에 추가하면 A그룹에서는 삭제됩니다.</div>
                                        <div className="listBlock">
                                            <Table
                                                rowKey={(record) => record}
                                                dataSource={this.state.list}
                                                columns={columns}
                                                pagination={this.state.pagination}
                                                onChange={this.handleTableChange}
                                                expandedRowRender={expandedRowRender}
                                            />
                                        </div>
                                    </div>
                                    {/* 가맹점 추가 모달 */}
                                    {this.state.addFranchiseOpen &&
                                        <SearchFranchiseDialog
                                            isOpen={this.state.addFranchiseOpen}
                                            close={this.closeAddFranchiseModal}
                                            callback={(data) => this.registGroupFranchise(data)}
                                        />
                                    }


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
        branchIdx: state.login.loginInfo.branchIdx,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurchargeGroupDialog);