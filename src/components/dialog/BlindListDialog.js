import React, { Component } from "react";
import {
    Form, Table, Checkbox, Input, Button,  Modal,
} from "antd";
import '../../css/modal.css';
import { blockString } from '../../lib/util/codeUtil';
import { httpPost, httpUrl } from "../../api/httpClient";
import SelectBox from '../../components/input/SelectBox';
import { formatDate } from "../../lib/util/dateUtil";
import { connect } from "react-redux";
const FormItem = Form.Item;

class BlindListDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            blocked: 0,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getList()
    }
    componentDidUpdate() {
        
    }

    componentDidUpdate(prevProps) {
        if(prevProps.isOpen !== this.props.isOpen) {
            this.getList()
        }
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

    onDelete = (idx) => {
        Modal.confirm({
            title: "차단 해제",
            content: "차단을 해제하시겠습니까?",
            okText: "확인",
            cancelText: "취소",
            onOk(){
                httpPost(httpUrl.deleteBlind, [], {
                    idx: idx,
                })
                .then((res) => {
                    if (res.result === "SUCCESS") {
                        console.log(res.result);
                        this.getList();
                    } else {
                        Modal.info({
                        title: "적용 오류",
                        content: "처리가 실패했습니다.",
                        });
                    }
                })
                .catch((e) => {
                    Modal.info({
                    title: "적용 오류",
                    content: "처리가 실패했습니다.",
                    });
                });
            }
        })
    }


    getList = () => {
        let {data} = this.props;
        let riderIdx = data.idx;
        httpPost(httpUrl.blindList, [], {
            riderIdx: riderIdx,
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
        })
          .then((res) => {
            if (res.result === "SUCCESS") {
              console.log(res);
              this.setState({
                list: res.data.riderFrBlocks,
              });
            } else {
              Modal.info({
                title: "적용 오류",
                content: "처리가 실패했습니다.",
              });
            }
          })
          .catch((e) => {
            Modal.info({
              title: "적용 오류",
              content: "처리가 실패했습니다.",
            });
          });
      };

    render() {
        const columns = [
            {
                title: "차단자",
                dataIndex: "direction",
                className: "table-column-center",
                render: (data, row) => <div>{data === 1 ? "기사" : "가맹점"}</div>
            },
            {
                title: "가맹점명",
                dataIndex: "frName",
                className: "table-column-center",
            },
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
            },
            {
                title: "차단메모",
                dataIndex: "memo",
                className: "table-column-center",
            },
            {
                title: "설정일",
                dataIndex: "createDate",
                className: "table-column-center",
                render: (data) => <div>{formatDate(data)}</div>,
            },
            {
                title: "상태",
                dataIndex: "blocked",
                className: "table-column-center",
                render:
                    (data, row) => (
                        <div>
                            {/* <SelectBox
                                value={blockString[data]}
                                code={Object.keys(blockString)}
                                codeString={blockString}
                                onChange={(value) => {
                                    if (parseInt(value) !== row.blocked) {
                                        this.onDelete(row.idx);
                                    }
                                }}
                            /> */}
                            <Button className="tabBtn surchargeTab" 
                            onClick={()=>this.onDelete(row.idx)}>블라인드</Button>
                        </div>
                    ),
            },
        ];

        const { isOpen, close } = this.props;
        // console.log(JSON.stringify(data))
        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="blind-Dialog">
                                <div className="blind-container">
                                    <div className="blind-title">
                                        블라인드 목록
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="surcharge-close" />

                                    <div style={{
                                        textAlign:'right', 
                                        marginTop:20,
                                        fontSize: 15
                                        }}>
                                        해제 포함
                                        <Checkbox style={{ marginLeft:6,verticalAlign: 'bottom' }}/>
                                    </div>

                                    <div className="blindLayout">
                                            <div className="listBlock">
                                                <Table
                                                    // rowKey={(record) => record.idx}
                                                    dataSource={this.state.list}
                                                    columns={columns}
                                                    pagination={this.state.pagination}
                                                    onChange={this.handleTableChange}
                                                />
                                            </div>
                                       
                                    </div>
                                    <div className="blindWrapper bot">
                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="contentBlock">
                                        <div className="subTitle">
                                                차단자
                                            </div>
                                            <FormItem
                                                name="direction"
                                                className="selectItem"
                                                // initialValue={this.props.loginInfo.id}
                                            >
                                                <Input placeholder="차단자 입력" className="override-input sub">
                                                </Input>
                                            </FormItem>
                                        <div className="subTitle">
                                                가맹점명
                                            </div>
                                            <FormItem
                                                name="frName"
                                                className="selectItem"
                                            >
                                                <Input placeholder="가맹점명 입력" className="override-input sub">
                                                </Input>
                                            </FormItem>
                                        <div className="subTitle">
                                                기사명
                                            </div>
                                            <FormItem
                                                name="riderName"
                                                className="selectItem"
                                            >
                                                <Input placeholder="기사명 입력" className="override-input sub">
                                                </Input>
                                            </FormItem>
                                            <div className="subTitle">
                                                메모
                                            </div>
                                            <FormItem
                                                name="memo"
                                                className="selectItem"
                                            >
                                                <Input placeholder="차단메모 입력" className="override-input sub">
                                                </Input>
                                            </FormItem>

                                            <Button type="primary" htmlType="submit" className="callTab">
                                                차단하기
                                            </Button>
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

const mapStateToProps = (state) => {
    return {
        loginInfo: state.login.loginInfo,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {};
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(BlindListDialog);