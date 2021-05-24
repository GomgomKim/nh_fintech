import React, {Component} from "react";
import {Form, Input, Table, Button} from "antd";
import {httpUrl, httpPost} from '../../../api/httpClient';
import '../../../css/modal.css';
import SelectBox from '../../../components/input/SelectBox';
import {
    tableStatusString
} from '../../../lib/util/codeUtil';

const Search = Input.Search;
const today = new Date();

class SearchFranchiseDialog extends Component {
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
            franStatus: 0,
            frName: "",
            franGroup: 0,
            selectedRowKeys: []
        };
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.getList()
    }

    // 가맹점 검색
    onSearchFranchisee = (value) => {
        this.setState({
            frName: value
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
        console.log(this.state.franStatus)
        httpPost(httpUrl.franchiseList, [], {
            frName: this.state.frName,
            pageNum: 1,
            pageSize: 10,
            userGroup: this.state.franGroup,
            userStatus: this.state.franStatus == 0 ? null : this.state.franStatus
        }).then((result) => {
            console.log('## result=' + JSON.stringify(result, null, 4))
            const pagination = {
                ...this.state.pagination
            };
            pagination.current = result.data.currentPage;
            pagination.total = result.data.total;
            this.setState({list: result.data.franchises, pagination});
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
            }, {
                title: "가맹점명",
                dataIndex: "frName",
                className: "table-column-center"
            }
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
                                            가맹점조회
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
                                                                value={tableStatusString[this.state.franStatus]}
                                                                code={Object.keys(tableStatusString)}
                                                                codeString={tableStatusString}
                                                                onChange={(value) => {
                                                                    if (parseInt(value) !== this.state.franStatus) {
                                                                        this.setState({franStatus: parseInt(value)}, () => this.getList());
                                                                    }
                                                                }}/>

                                                            <Search
                                                                placeholder="가맹점검색"
                                                                className="searchFranchiseInput"
                                                                enterButton
                                                                allowClear
                                                                onSearch={this.onSearchFranchisee}
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

export default(SearchFranchiseDialog);