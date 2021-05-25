import React, { Component } from "react";
import {
    Form,
    Modal,
    Input,
    Button,
    Select,
    Radio,
    Table
} from "antd";
import { httpUrl, httpPost, httpGet } from '../../../api/httpClient';
import '../../../css/modal.css';
import { formatDate } from '../../../lib/util/dateUtil';
import SelectBox from '../../../components/input/SelectBox';
import { riderLevelText, multiChange } from '../../../lib/util/codeUtil';


const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;

class SendSnsDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            dataIdxs:[],
            selectedRowKeys: [],

            riderLevel:0,
            searchName: "",
            isMulti:false,

            background: '#fff',
             
        };
        this.formRef = React.createRef();
        this.onRiderSelected = this.onRiderSelected.bind(this);
    }

    componentDidMount() {
        this.getList(true);
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.isOpen !== this.props.isOpen) {
            this.getList();
        }
    }

    // 라이더검색

    onSearchRider = (value) => {
        this.setState({
            searchName: value
        }, () => {
            this.getList();
        })
    }

    // 라디오버튼
    
    onChangeMulti = (e) => {
        // console.log(e.target.value)
        this.setState({isMulti: e.target.value});
    }

    handleToggleCompleteCall = () => {
        this.setState({
            deleted: 1,
        });
    };


    handleTableChange = (pagination) => {
        console.log(pagination);
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.setState(
            {
                pagination: pager,
            },
            () => this.getList()
        );
    };

    getList = (isInit) => {
        let pageNum = this.state.pagination.current;
        // let userStatus = this.state.userStatus === 0 ? "" : this.state.userStatus;
        let searchName = this.state.searchName;
        let riderLevels = this.state.riderLevel;

        httpGet(httpUrl.riderList, [10, pageNum, searchName, '',riderLevels], {})
        .then((result) => {
          console.log('## nnbox result=' + JSON.stringify(result, null, 4))
          const pagination = { ...this.state.pagination };
          pagination.current = result.data.currentPage;
          pagination.total = result.data.totalCount;
          this.setState({
            list: result.data.riders,
            pagination,
          })

        //   mount될 때 data idx 배열 초기화
          if(isInit){
                // console.log(result.data.franchises[0].idx)
                var totCnt = result.data.riders[0].idx;
                var lists = []
                for (let i = 0; i < totCnt; i++) {
                    lists.push(false)
                    // console.log(lists)
                }
                this.setState({
                    dataIdxs : lists,
                })
            }
        })
        .catch((e) => {
            console.log(e);
        })
    }

    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log("selectedRowKeys.length :"+selectedRowKeys.length)

        // console.log(this.state.list)
        var cur_list = this.state.list
        var overrideData = {}
        for (let i = 0; i < cur_list.length; i++) {
            var idx = cur_list[i].idx
            if(selectedRowKeys.includes(idx)) overrideData[idx] = true
            else overrideData[idx] = false
        }
        // console.log(overrideData)


        var curIdxs = this.state.dataIdxs
        curIdxs = Object.assign(curIdxs, overrideData)

        selectedRowKeys = []
        for (let i = 0; i < curIdxs.length; i++) {
            if(curIdxs[i]) {
                console.log("push  :"+i)
                selectedRowKeys = [...selectedRowKeys, i]
                console.log(selectedRowKeys)
            }
        }
        console.log("#### :"+selectedRowKeys)
        this.setState({
            selectedRowKeys: selectedRowKeys,
            dataIdxs: curIdxs
        });
    };

    // onSubmit = () => {
    //     this.props.callback(this.state.selectedRowKeys)
    //     this.props.close()
    // }

    onChangeMulti = (e) => {
        // console.log(e.target.value)
        this.setState({isMulti: e.target.value});
    }
    
    onRiderSelected = () => {
        // post
        this.setState({ background:'#222'});
    }

    // 메세지 전송
    handleSubmit = () => {
        let self = this;
        console.log("handle submit")
        Modal.confirm({
            title: "메세지 전송",
            content: (
                <div>
                    {'메세지를 전송하시겠습니까?'}
                </div>
            ),
            okText: "확인",
            cancelText: "취소",
            onOk() {
                httpPost(httpUrl.registNotice, [], {
                    ...self.formRef.current.getFieldsValue(),
                    date: self.state.date,
                    title: self.state.title,
                    deleted: false,
                    category: self.state.category,
                    sortOrder: self.state.sortOrder,
                    important: self.state.important,
                    branchCode: self.state.branchCode,
                }).then((result) => {
                    Modal.info({
                        title: " 완료",
                        content: (
                            <div>
                                메세지가 전송되었습니다.
                            </div>
                        ),
                    });
                    self.handleClear();
                    self.getList();
                }).catch((error) => {
                    Modal.info({
                        title: " 오류",
                        content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                    });
                })
            }
        });
    }

    handleClear = () => {
        this.formRef.current.resetFields();
    };

    render() {

         const columns = [
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
                width: '40%',
                render: (data, row) => 
                    this.state.isMulti ? 
                        <div>{data}</div> :
                        <div className='riderNameTag' onClick={()=>{
                            this.onRiderSelected(row.idx)
                    }}>{data}</div>
            },
            {
                title: "직급",
                dataIndex: "riderLevel",
                className: "table-column-center",
                width: '30%',
                render: (data) => <div>{riderLevelText[data]}</div>
            },
            {
                title: "기사그룹",
                dataIndex: "userGroup",
                className: "table-column-center",
                width: '30%',
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
        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {isOpen ? (
                    <React.Fragment>
                        <div className="Dialog-overlay" onClick={close} />
                        <div className="snsDialog">
                            <div className="container">
                                <div className="sns-title">메세지 전송</div>
                                <img
                                    onClick={close}
                                    src={require("../../../img/login/close.png").default}
                                    className="surcharge-close"
                                />
                                <div className="snsLayout">

                                     <SelectBox
                                        value={riderLevelText[this.state.riderLevel]}
                                        code={Object.keys(riderLevelText)}
                                        codeString={riderLevelText}
                                        onChange={(value) => {
                                            if (parseInt(value) !== this.state.riderLevel) {
                                                this.setState({ riderLevel: parseInt(value) }, () => this.getList());
                                            }
                                     }} />
                                     
                                        <Search
                                        placeholder="기사검색"
                                        className="searchFranchiseInput"
                                        enterButton
                                        allowClear
                                        onSearch={this.onSearchRider}
                                         style={{                                                                    
                                         }}/>


                                        <Button type="primary" className="submitBtn">
                                            전송 내역
                                        </Button>


                                        <div className="dataTableLayout-01">
                                         <Table
                                            rowKey={(record) => record.idx}
                                            rowSelection={rowSelection}
                                            dataSource={this.state.list}
                                            columns={columns}
                                            pagination={this.state.pagination}
                                            onChange={this.handleTableChange}/>                                                                                                
                                        </div>

                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="snsDetailBlock">
                                            <div className="inputBox">
                                                <FormItem
                                                    className="selectItem"
                                                    name="content"
                                                    rules={[{ required: true, message: "메세지를 입력해주세요" }]}
                                                >
                                                    <Input
                                                        className="snsInputBox"
                                                        placeholder="메세지 내용"
                                                    />
                                                </FormItem>
                                            </div>
                                            <div className="btnInsert">
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    className="tabBtn insertTab snsBtn"
                                                >
                                                    전송
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ) : null
                }
            </React.Fragment>
        );
    }
}

export default (SendSnsDialog);
