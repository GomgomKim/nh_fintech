import React, { Component } from "react";
import {
    Form, Input, Table, Button, Modal,
} from "antd";
import { httpUrl, httpPost, httpGet } from '../../../api/httpClient';
import '../../../css/modal.css';
import { connect } from "react-redux";
import { formatDate } from '../../../lib/util/dateUtil';
import moment from 'moment';
const FormItem = Form.Item;

class NoticeDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            date: "",
            title: "",
            content: "",
            category: 0,
            sortOrder: 0,
            important: 0,
            branchCode: 1,
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
        let pageNum = this.state.pagination.current;
        let pageSize = this.state.pagination.pageSize;
        httpGet(httpUrl.noticeList, [pageNum, pageSize], {}).then((res) => {
            const pagination = { ...this.state.pagination };
            pagination.current = res.data.currentPage;
            pagination.total = res.data.totalCount;
            this.setState({
                list: res.data.notices,
                pagination,
            });
        }).catch(e => {
            Modal.info({
                title: "시스템 에러",
                content: "시스템 에러가 발생하였습니다. 다시 시도해 주십시오."
            });
        });
    }
    //공지 전송
    handleIdSubmit = () => {
        let self = this;
        Modal.confirm({
            title: "공지사항 등록",
            content: (
                <div>
                    {self.formRef.current.getFieldsValue().memo + '을 등록하시겠습니까?'}
                </div>
            ),
            okText: "확인",
            cancelText: "취소",
            onOk() {
                httpPost(httpUrl.registNotice, [], {
                    ...self.formRef.current.getFieldsValue(),
                    // idx: self.state.idx,
                    date: self.state.date,
                    title: self.state.title,
                    // content: self.state.content,
                    category: self.state.category,
                    sortOrder: self.state.sortOrder,
                    important: self.state.important,
                    branchCode: self.state.branchCode,
                    // deleted: false,
                }).then((result) => {
                    Modal.info({
                        title: "전송 완료",
                        content: (
                            <div>
                                {self.formRef.current.getFieldsValue().memo}이(가) 등록되었습니다.
                            </div>
                        ),
                    });
                    self.handleClear();
                    self.getList();
                }).catch((error) => {
                    Modal.info({
                        title: "전송 오류",
                        content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                    });
                });
            },
        });
    }

    handleClear = () => {
        this.formRef.current.resetFields()
    };

    onDelete = (row) => {
        let idx = row.idx;
        let deleted = row.deleted;
        httpGet(httpUrl.registNotice, [idx, deleted], {})
            .then((result) => {
                // console.log('## delete result=' + JSON.stringify(result, null, 4))
                Modal.info({
                    title: "공지사항 삭제",
                    content: (
                        <div>
                            해당 공지사항이 삭제되었습니다.
                        </div>
                    ),
                });

                this.setState({ deleted: true });
                this.getList();
            })
            .catch((error) => {
                Modal.info({
                    title: "삭제 오류",
                    content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                });
            });
    };

    updateData = () => {

    }

    render() {

        const columns = [
            {
                className: "table-column-center",
                render: (data, row) =>
                    <div>
                        <Button
                            className="tabBtn surchargeTab"
                            onClick={() => { this.onDelete(row) }}
                        >삭제</Button>
                    </div>
            },
            {
                title: "날짜",
                dataIndex: "createDate",
                className: "table-column-center",
                render: (data) => <div>{formatDate(data)}</div>
            },
            {
                title: "내용",
                dataIndex: "content",
                className: "table-column-center",
                render: (data) =>
                    <div
                        style={{ display: "inline-block", cursor: "pointer" }}
                        onClick={() => { }}>
                        {data}
                    </div>
            },
        ];

        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="noticeDialog">
                                <div className="container">
                                    <div className="notice-title">
                                        공지사항
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <div className="noticeLayout">
                                        <div className="noticelistBlock">
                                            <Table
                                                // rowKey={(record) => record.idx}
                                                dataSource={this.state.list}
                                                columns={columns}
                                                pagination={this.state.pagination}
                                                onChange={this.handleTableChange}
                                            />
                                        </div>



                                        <Form ref={this.formRef} onFinish={this.handleIdSubmit}>
                                            <div className="noticeDetailBlock">
                                                <div className="mainTitle">
                                                    공지사항 추가 및 수정
                                            </div>
                                                <div className="inputBox">
                                                    <FormItem
                                                        className="noticeInputBox"
                                                        name="content"
                                                    >
                                                        <Input className="noticeInputBox" placeholder="공지 내용" />
                                                    </FormItem>
                                                </div>
                                                <div className="btnInsert">
                                                    <Button type="primary" htmlType="submit" className="tabBtn insertTab noticeBtn">
                                                        전송
                                                    </Button>
                                                </div>
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
        branchIdx: state.login.branch,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NoticeDialog);