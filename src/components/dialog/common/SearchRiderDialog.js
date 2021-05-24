import React, {Component} from "react";
import {Form, Input, Table, Button, Radio} from "antd";
import {httpUrl, httpGet} from '../../../api/httpClient';
import '../../../css/modal.css';
import SelectBox from '../../input/SelectBox';
import {
    tableStatusString,
    riderLevelText
} from '../../../lib/util/codeUtil';

const Search = Input.Search;
const today = new Date();

class SearchRiderDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: today,
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 10
            },
            addressType: 0,
            selectedRowKeys: [],

            // data param
            riderLevel: [],
            searchName: "",
            userStatus: 0,
        };
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.getList()
    }

    setDate = (date) => {
        console.log(date)
    }

    // 라이더 검색
    onSearchRider = (value) => {
        this.setState({
            searchName: value
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
        let pageNum = this.state.pagination.current;
        let userStatus = this.state.userStatus === 0 ? "" : this.state.userStatus;
        let searchName = this.state.searchName;

        httpGet(httpUrl.riderList, [10, pageNum, searchName, userStatus], {}).then((result) => {
          console.log('## nnbox result=' + JSON.stringify(result, null, 4))
          const pagination = { ...this.state.pagination };
          pagination.current = result.data.currentPage;
          pagination.total = result.data.totalCount;
          this.setState({
            list: result.data.riders,
            pagination,
          });
        })
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys: selectedRowKeys});
    };

    onSubmit = () => {
        this.props.callback(this.state.selectedRowKeys)
        this.props.close()
    }

    render() {
        const columns = [
            {
                title: "순번",
                dataIndex: "idx",
                className: "table-column-center"
            }, 
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
            },
            {
                title: "직급",
                dataIndex: "riderLevel",
                className: "table-column-center",
                width: "200px",
                render: (data) => <div>{riderLevelText[data]}</div>
            },
            {
                title: "기사그룹",
                dataIndex: "userGroup",
                className: "table-column-center",
                // render: (data) => <div>{data == "A" ? "A"
                //   : data == "B" ? "B"
                //     : data == "C" ? "C"
                //       : data == "D" ? "D" : "-"}</div>
                render: (data) => <div>{'A'}</div>
            },
        ];

        const selectedRowKeys = this.state.selectedRowKeys
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const {isOpen, close} = this.props;

        return (
            <React.Fragment>
                {
                    isOpen
                        ? <React.Fragment>
                                <div className="Dialog-overlay" onClick={close}/>
                                <div className="searchFranchise-Dialog">
                                    <div className="searchFranchise-content">
                                        <div className="searchFranchise-title">
                                            기사조회
                                        </div>
                                        <img
                                            onClick={close}
                                            src={require('../../../img/login/close.png').default}
                                            className="surcharge-close"/>

                                        <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                            <div className="layout">
                                                <div className="searchFranchiseWrapper">
                                                    <div className="searchFranchise-list">
                                                        <div className="inputBox inputBox-searchFranchise sub">
                                                            <SelectBox
                                                                value={tableStatusString[this.state.userStatus]}
                                                                code={Object.keys(tableStatusString)}
                                                                codeString={tableStatusString}
                                                                onChange={(value) => {
                                                                    if (parseInt(value) !== this.state.userStatus) {
                                                                        this.setState({userStatus: parseInt(value)}, () => this.getList());
                                                                    }
                                                                }}/>

                                                            <Search
                                                                placeholder="기사검색"
                                                                className="searchFranchiseInput"
                                                                enterButton
                                                                allowClear
                                                                onSearch={this.onSearchRider}
                                                                style={{
                                                                    
                                                                }}/>
                                                        </div>

                                                        <Button type="primary" onClick={this.onSubmit} className="submitBtn">
                                                            조회
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="dataTableLayout-01">
                                                    <Table
                                                        rowKey={(record) => record}
                                                        rowSelection={rowSelection}
                                                        dataSource={this.state.list}
                                                        columns={columns}
                                                        pagination={this.state.pagination}
                                                        onChange={this.handleTableChange}/>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </React.Fragment>
                        : null
                }
            </React.Fragment>
        )
    }
}

export default(SearchRiderDialog);