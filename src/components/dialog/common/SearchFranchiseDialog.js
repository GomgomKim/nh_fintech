import React, {Component} from "react";
import {Form, Input, Table, Button, Radio} from "antd";
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
            dataIdxs: [],
            selectedRowKeys: [],
            isMulti: false,
        };
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.getList(true)
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

    getList = (isInit) => {
        // console.log(isInit)

        console.log(this.state.franStatus)
        httpPost(httpUrl.franchiseList, [], {
            frName: this.state.frName,
            pageNum: this.state.pagination.current,
            userGroup: this.state.franGroup,
            userStatus: this.state.franStatus === 0 ? null : this.state.franStatus
        }).then((result) => {
            console.log('## result=' + JSON.stringify(result, null, 4))
            const pagination = {
                ...this.state.pagination
            };
            pagination.current = result.data.currentPage;
            pagination.total = result.data.totalCount;
            this.setState({list: result.data.franchises, pagination});

            // mount될 때 data idx 배열 초기화
            if(isInit){
                // console.log(result.data.franchises[0].idx)
                var totCnt = result.data.franchises[0].idx;
                var lists = []
                for (let i = 0; i < totCnt; i++) {
                    lists.push(false)
                    // console.log(lists)
                }
                this.setState({
                    dataIdxs : lists,
                })
            }

            // console.log(this.state.dataIdxs)
        })
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        console.log("selectedRowKeys.length :"+selectedRowKeys.length)
        var curIdxs = this.state.dataIdxs
        var idx = selectedRowKeys[selectedRowKeys.length-1]
        // console.log(selectedRowKeys[selectedRowKeys.length-1])
        if(curIdxs[idx])
            curIdxs[idx] = false;
        else
            curIdxs[idx] = true;

        selectedRowKeys = []
        for (let i = 0; i < curIdxs.length; i++) {
            if(curIdxs[i]) {
                console.log("push  :"+i)
                selectedRowKeys = [...selectedRowKeys, i]
                console.log(selectedRowKeys)

            }
        }
        console.log(selectedRowKeys)
        this.setState({
            selectedRowKeys: selectedRowKeys,
            dataIdxs: curIdxs
        });
    };

    onSubmit = () => {
        this.props.callback(this.state.dataIdxs)
        this.props.close()
    }

    onChangeMulti = (e) => {
        // console.log(e.target.value)
        this.setState({isMulti: e.target.value});
    }

    onFrSelected = (data) => {
        // console.log(data)
        var dataIdx = this.state.dataIdxs
        dataIdx[data] = true
        this.props.callback(dataIdx)
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
                className: "table-column-center",
                render: (data, row) => 
                    this.state.isMulti ? 
                        <div>{data}</div> :
                        <div className='frNameTag' onClick={()=>{
                            this.onFrSelected(row.idx)
                    }}>{data}</div>
                
            }
        ];

        const selectedRowKeys = this.state.selectedRowKeys
        console.log(selectedRowKeys)
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
                                                                />

                                                            <Radio.Group onChange={this.onChangeMulti} value={this.state.isMulti} className="selMulti">
                                                                <Radio value={false}>single</Radio>
                                                                <Radio value={true}>multi</Radio>
                                                            </Radio.Group>
                                                        </div>
                                                       

                                                        <Button type="primary" onClick={this.onSubmit} className="submitBtn">
                                                            조회
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="dataTableLayout-01">
                                                    {this.state.isMulti ?
                                                        <Table
                                                            rowKey={(record) => record.idx}
                                                            rowSelection={rowSelection}
                                                            dataSource={this.state.list}
                                                            columns={columns}
                                                            pagination={this.state.pagination}
                                                            onChange={this.handleTableChange}/>

                                                    :

                                                        <Table
                                                            rowKey={(record) => record.idx}
                                                            dataSource={this.state.list}
                                                            columns={columns}
                                                            pagination={this.state.pagination}
                                                            onChange={this.handleTableChange}/>
                                                    }
                                                    
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