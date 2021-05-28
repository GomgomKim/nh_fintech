import React, { Component } from "react";
import {
    Form, Table, Button, Tag, Modal
} from "antd";
import '../../../css/modal.css';
import SurchargAddFrDialog from "./SurchargAddFrDialog";
import SurchargeRiderGroupDialog from "./SurchargeRiderGroupDialog";
import { httpGet, httpUrl, httpPost } from '../../../api/httpClient';

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
            addRiderOpen: false,
            registRiderGroupOpen: false,
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

    getList = () => {
        httpPost(httpUrl.priceExtraGroupList, [], {
            branchIdx: 1,
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
                Modal.info({
                    title: "목록 에러",
                    content: (
                        <div>
                            에러가 발생하여 목록을 불러올수 없습니다.
                        </div>
                    ),
                });
            }
        })
    };
    // 기사추가 dialog
    openAddRiderModal = () => {
        this.setState({ addRiderOpen: true });
    }
    closeAddRiderModal = () => {
        this.setState({ addRiderOpen: false });
    }

    // 기사 그룹 등록 dialog
    openRegistRiderGroupModal = () => {
        this.setState({ registRiderGroupOpen: true });
    }
    closeRegistRiderGroupModal = () => {
        this.setState({ registRiderGroupOpen: false });
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
                render: () =>
                    <div>
                        <SurchargAddFrDialog isOpen={this.state.addRiderOpen} close={this.closeAddRiderModal} />
                        <Button
                            className="tabBtn"
                            onClick={() => { this.openAddRiderModal() }}
                        >추가</Button>
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
                                closable
                                style={{ fontSize: 15, padding: 5}}
                                onClose={() => this.setState({ visible: false })}
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
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="taskGroup-close" />
                                    <div className="surchargeGroupList-inner">

                                        <div className="surchargeGroupList-btn">
                                            <div className="surchargeGroupList-btn-01">
                                                <SurchargeRiderGroupDialog isOpen={this.state.registRiderGroupOpen} close={this.closeRegistRiderGroupModal} />
                                                <Button
                                                    className="tabBtn surchargeGroupList-btn"
                                                    onClick={() => { this.openRegistRiderGroupModal() }}
                                                >그룹등록</Button>
                                            </div>

                                        </div>
                                        <Form ref={this.formRef} onFinish={this.handleSubmit}>
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

export default (SurchargeGroupDialog);