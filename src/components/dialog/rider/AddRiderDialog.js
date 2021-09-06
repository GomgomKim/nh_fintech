import React, { Component } from "react";
import {
    Form, Table, Button, Select
} from "antd";
import '../../../css/modal.css';
import '../../../css/modal_m.css';
const Option = Select.Option;
const FormItem = Form.Item;

class AddRiderDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            staffAuth: 1,
            selRiderList: [],
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getList()
    }

    onChange = e => {
        // console.log('radio checked', e.target.value);
        this.setState({
            staffAuth: e.target.value,
        });
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

    getList = () => {
        var list = [
            {
                branchName: '플러스김포',
                riderName: '김기연',
            },
            {
                branchName: '플러스김포',
                riderName: '박재범',
            },
            {
                branchName: '플러스김포',
                riderName: '정기석',
            },
            {
                branchName: '플러스김포',
                riderName: '로꼬',
            },
            {
                branchName: '플러스김포',
                riderName: '그레이',
            },
        ];
        this.setState({
            list: list,
        });
    }

    render() {
        const { isOpen, close } = this.props;

        const columns = [
            {
                title: "지사명",
                dataIndex: "branchName",
                className: "table-column-center",
            },
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
            },
        ];

        const rowSelection = {
            // selectedRows : 선택한 row 정보
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({
                    selRiderList: selectedRows,
                }, () => console.log(this.state.selRiderList));
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
                this.setState({
                    selRiderList: selectedRows,
                })
            },
        };

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="addRider-Dialog-overlay" onClick={close} />
                            <div className="addRider-Dialog">
                                <div className="addRider-content">
                                    <div className="addRider-title">
                                        기사 추가
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="addRider-close" />


                                    <Form ref={this.formRef} onFinish={this.handleIdSubmit}>
                                        <div className="addRiderlayout">
                                            <div className="addRiderWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        소속지점
                                                    </div>
                                                    <FormItem
                                                        name="belongBranch"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="소속지점을 선택해 주세요." className="override-select branch">
                                                            <Option value={0}>플러스김포 / 플러스김포</Option>
                                                            <Option value={1}>김포1지점 / 플러스김포</Option>
                                                            <Option value={2}>김포2지점 / 플러스김포</Option>
                                                        </Select>
                                                    </FormItem>
                                                </div>

                                                <div className="dataTableBlock">
                                                    <FormItem
                                                        name="table"
                                                        className="selectItem"
                                                    >
                                                        <Table
                                                            rowKey={(record) => record}
                                                            dataSource={this.state.list}
                                                            columns={columns}
                                                            pagination={this.state.pagination}
                                                            onChange={this.handleTableChange}
                                                            rowSelection={{ ...rowSelection }}
                                                        />
                                                    </FormItem>
                                                </div>

                                                <div className="submitBlock">
                                                    <Button type="primary">
                                                        등록하기
                                                    </Button>
                                                </div>

                                            </div>

                                        </div>
                                    </Form>
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

export default (AddRiderDialog);