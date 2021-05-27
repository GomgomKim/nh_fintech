import React, { Component } from "react";
import {
    Form, Table, Button, Select
} from "antd";
import '../../../css/modal.css';
const Option = Select.Option;
const FormItem = Form.Item;

class SurchargAddFrDialog extends Component {
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
                frName: '테스트가맹점1',
            },
            {
                frName: '테스트가맹점2',
            },
            {
                frName: '테스트가맹점3',
            },
            {
                frName: '테스트가맹점4',
            },
            {
                frName: '테스트가맹점5',
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
                title: "가맹점명",
                dataIndex: "frName",
                className: "table-column-center",
            },
        ];

        const rowSelection = {
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
                            <div className="surchargeFr-Dialog-overlay" onClick={close} />
                            <div className="surchargeFr-Dialog">
                                <div className="surchargeFr-content">
                                    <div className="surchargeFr-title">
                                        가맹점을 그룹에 추가
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="addRider-close" />

                                    <Form ref={this.formRef} onFinish={this.handleIdSubmit}>
                                        <div className="surchargeFrlayout">
                                            <div className="surchargeFrWrapper">
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

export default (SurchargAddFrDialog);