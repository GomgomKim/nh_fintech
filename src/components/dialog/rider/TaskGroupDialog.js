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
                groupName: 'A',
                data: [
                    {
                        branchName: '플러스김포',
                        riderName: '김기연',
                    },
                    {
                        branchName: '플러스김포',
                        riderName: '김종국',
                    },
                    {
                        branchName: '플러스김포',
                        riderName: '성시경',
                    },
                    {
                        branchName: '플러스김포',
                        riderName: '김기연',
                    },
                    {
                        branchName: '플러스김포',
                        riderName: '김종국',
                    },
                    {
                        branchName: '플러스김포',
                        riderName: '성시경',
                    }
                ]
            },
            {
                groupName: '기타',
                data: [
                    {
                        branchName: '플러스김포',
                        riderName: '김기연',
                    },
                ]
            },
            {
                groupName: 'C',
                data: [
                    {
                        branchName: '플러스김포',
                        riderName: '박재범',
                    },
                    {
                        branchName: '플러스김포',
                        riderName: '정기석',
                    },
                ]
            },
            {
                groupName: 'D',
            },
            {
                groupName: 'E',
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
                        <SearchRiderDialog 
                            isOpen={this.state.searchRiderOpen} 
                            close={this.closeSearchRiderModal}
                            multi={true}
                            callback={(data) => this.setState({
                                selectedRider: data
                            }, () => {this.getList()} 
                        )}/>
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


        const { isOpen, close, multi } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
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
                                            <div className="taskGroup-btn-01">
                                                <RegistRiderGroupDialog isOpen={this.state.registRiderGroupOpen} close={this.closeRegistRiderGroupModal} />
                                                <Button
                                                    className="tabBtn taskGroup-btn"
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
                        :
                        null
                }
            </React.Fragment>
        )
    }
}

export default (TaskGroupDialog);