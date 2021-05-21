import React, { Component } from "react";
import {
    Form,
    Modal,
    Input,
    Table,
    Button,
    Select,
    Checkbox,
} from "antd";
import { httpUrl, httpPost, httpGet } from '../../../api/httpClient';
import '../../../css/modal.css';
import { formatDate, formatDateSecond } from '../../../lib/util/dateUtil';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const today = new Date();

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
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getList();
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
        });
    };

    //공지 전송
    handleSubmit = () => {
        let self = this;

        Modal.confirm({
            title: "공지사항 등록",
            content: (
                <div>
                    {self.formRef.current.getFieldsValue().content + '을 등록하시겠습니까?'}
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
                                {self.formRef.current.getFieldsValue().content}이(가) 등록되었습니다.
                            </div>
                        ),
                    });
                    self.handleClear();
                    self.getList();
                }).catch((error) => {
                    Modal.info({
                        title: "등록 오류",
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
                title: "내용",
                dataIndex: "content",
                className: "table-column-center",
                render: (data) => (
                    <div
                        style={{ display: "inline-block", cursor: "pointer" }}
                        onClick={() => { }}
                    >
                        {data}
                    </div>
                ),
            },
            {
                title: "날짜",
                dataIndex: "createDate",
                className: "table-column-center",
                render: (data) => <div>{formatDate(data)}</div>,
            },
        ];

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
                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="snslistBlock">

                                            <Table
                                                // rowKey={(record) => record.idx}
                                                dataSource={this.state.list}
                                                columns={columns}
                                                pagination={this.state.pagination}
                                                onChange={this.handleTableChange}
                                            />
                                        </div>
                                    </Form>

                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="snsDetailBlock">
                                            <div className="mainTitle">sns</div>
                                            <div className="inputBox">
                                                <FormItem
                                                    className="snsInputBox"
                                                    name="content"
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
                ) : null}
            </React.Fragment>
        );
    }
}

export default (SendSnsDialog);
