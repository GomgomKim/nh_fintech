import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text,
} from "antd";
import '../../../css/modal.css';
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

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
                noticeDate: '21-03-01',
                noticeContent: '냠냠박스는 24시간 운영합니다.',
            },
            {
                noticeDate: '21-03-02',
                noticeContent: '많은 비가 오고있습니다. 조심하세요',
            },
            {
                noticeDate: '21-03-02',
                noticeContent: '많은 비가 오고있습니다. 조심하세요',
            },
            {
                noticeDate: '21-03-02',
                noticeContent: '많은 비가 오고있습니다. 조심하세요',
            },
            {
                noticeDate: '21-03-02',
                noticeContent: '많은 비가 오고있습니다. 조심하세요',
            },
            {
                noticeDate: '21-03-02',
                noticeContent: '많은 비가 오고있습니다. 조심하세요',
            },
            {
                noticeDate: '21-03-02',
                noticeContent: '많은 비가 오고있습니다. 조심하세요',
            },
        ];
        this.setState({
            list: list,
        });
    }

    render() {

        const columns = [
            {
                className: "table-column-center",
                render: () =>
                    <div>
                        <Button
                            className="tabBtn surchargeTab"
                            onClick={() => { }}
                        >삭제</Button>
                    </div>
            },
            {
                title: "날짜",
                dataIndex: "noticeDate",
                className: "table-column-center",
            },
            {
                title: "내용",
                dataIndex: "noticeContent",
                className: "table-column-center",
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
                                    <div className="title">
                                        공지사항
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <div className="noticeLayout">
                                        <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                            <div className="noticelistBlock">
                                                <Table
                                                    // rowKey={(record) => record.idx}
                                                    dataSource={this.state.list}
                                                    columns={columns}
                                                    pagination={this.state.pagination}
                                                    onChange={this.handleTableChange}
                                                />
                                            </div>
                                        </Form>
                                        <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                            <div className="noticeDetailBlock">
                                                <div className="inputBox">
                                                    <FormItem
                                                        className="noticeInputBox"
                                                        name="surchargeName"
                                                    >
                                                        <Input className="noticeInputBox" />
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

export default (NoticeDialog);