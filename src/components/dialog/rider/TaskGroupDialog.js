import React, { Component } from "react";
import {
    Form, Table, Button, Tag
} from "antd";
import '../../../css/modal.css';
import SearchRiderDialog from "../common/SearchRiderDialog";
import RegistRiderGroupDialog from "./RegistRiderGroupDialog";

class TaskGroupDialog extends Component {
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
            searchRiderOpen: false,
            registRiderGroupOpen: false,

            selectedRider: null,
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
        var list = [
            {
            //     groupName: '리스비',
            //     data: [
            //         {
            //             riderName: '김민준',
            //         },
            //         {
            //             riderName: '최예준',
            //         },
            //         {
            //             riderName: '박준서',
            //         },
            //         {
            //             riderName: '김현우',
            //         },
            //         {
            //             riderName: '이도현',
            //         },
            //         {
            //             riderName: '나선우',
            //         }
            //     ]
            // },
            // {
            //     groupName: '비품 대여',
            //     data: [
            //         {
            //             riderName: '이건우',
            //         },
            //         {
            //             riderName: '박준서',
            //         },
            //         {
            //             riderName: '이도현',
            //         },
            //     ]
            // },
            // {
            //     groupName: '패널티',
            //     data: [
            //         {
            //             riderName: '이지훈',
            //         },
            //         {
            //             riderName: '정현준',
            //         },
            //     ]
            // },
            // {
            //     groupName: '대출금',
            //     data: [
            //         {
            //             riderName: '지유준',
            //         },
            //         {
            //             riderName: '조승우',
            //         },
            //         {
            //             riderName: '김지환',
            //         },
            //         {
            //             riderName: '유시윤',
            //         },
            //         {
            //             riderName: '성민재',
            //         },
            //         {
            //             riderName: '이지훈',
            //         }
            //     ]
                groupName: '리스 21,000원 그룹',
                data: [
                    {
                        riderName: '김민준',
                    },
                    {
                        riderName: '최예준',
                    },
                    {
                        riderName: '박준서',
                    },
                    {
                        riderName: '김현우',
                    },
                    {
                        riderName: '이도현',
                    },
                    {
                        riderName: '나선우',
                    }
                ]
            },
            {
                groupName: '리스 23,000원 그룹',
                data: [
                    {
                        riderName: '이건우',
                    },
                    {
                        riderName: '박준서',
                    },
                    {
                        riderName: '이도현',
                    },
                ]
            },
            {
                groupName: '대출상환 31,000원 그룹',
                data: [
                    {
                        riderName: '지유준',
                    },
                    {
                        riderName: '조승우',
                    },
                    {
                        riderName: '김지환',
                    },
                    {
                        riderName: '유시윤',
                    },
                    {
                        riderName: '성민재',
                    },
                    {
                        riderName: '이지훈',
                    }
                ]
            },
            {
                groupName: '',
            },
        ];
        this.setState({
            list: list,
        });
    }

    // 기사추가 dialog
    openSearchRiderModal = () => {
        this.setState({ searchRiderOpen: true });
    };
    closeSearchRiderModal = () => {
        this.setState({ searchRiderOpen: false });
    };

    // 기사 그룹 등록 dialog
    openRegistRiderGroupModal = () => {
        this.setState({ registRiderGroupOpen: true });
    };
    closeRegistRiderGroupModal = () => {
        this.setState({ registRiderGroupOpen: false });
    };


    render() {

        const columns = [
            {
                title: "그룹명",
                dataIndex: "groupName",
                className: "table-column-center",
            },
            {
                title: "기사추가",
                className: "table-column-center",
                render: () =>
                    <div>
                        {this.state.searchRiderOpen &&
                            <SearchRiderDialog
                                close={this.closeSearchRiderModal}
                                multi={true}
                                callback={(data) => this.setState({
                                    selectedRider: data
                                }, () => { this.getList() }
                                )} />}
                        <Button
                            className="tabBtn"
                            onClick={() => { this.openSearchRiderModal() }}
                        >추가</Button>
                    </div>
            },
        ];


        const expandedRowRender = (record) => {
            const dropColumns = [
                {
                    dataIndex: "riderName",
                    className: "table-column-center",
                    render: (data) =>
                        <>
                            <Tag
                                style={{ fontSize: 14, padding: 5 }}
                                closable
                                onClose={() => this.setState({ visible: false })}
                            >
                                {data}
                            </Tag>
                        </>
                },
            ];
            return (
                <Table
                    className="subTable"
                    rowKey={(record) => `record: ${record.idx}`}
                    columns={dropColumns}
                    dataSource={record.data}
                    pagination={false}
                />
            );
        }


        const { close, multi } = this.props;

        return (

            <React.Fragment>
                <div className="Dialog-overlay" onClick={close} />
                <div className="taskGroup-Dialog">

                    <div className="taskGroup-content">
                        <div className="taskGroup-title">
                            일차감 그룹관리
                                    </div>
                        <img onClick={close} src={require('../../../img/login/close.png').default} className="taskGroup-close" />
                        <div className="taskGroup-inner">

                            <div className="taskGroup-btn">
                                <div className="taskScheduler-btn-01">
                                    {this.state.registRiderGroupOpen &&
                                        <RegistRiderGroupDialog close={this.closeRegistRiderGroupModal} />}
                                    <Button
                                        className="taskGroup-btn"
                                        onClick={() => { this.openRegistRiderGroupModal() }}
                                    >그룹등록</Button>
                                </div>

                            </div>
                            <Form ref={this.formIdRef} onFinish={this.handleSubmit}>
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

        )
    }
}

export default (TaskGroupDialog);