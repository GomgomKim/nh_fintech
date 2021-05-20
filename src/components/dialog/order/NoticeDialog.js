import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text,
} from "antd";
import { httpUrl, httpPost, httpGet } from '../../../api/httpClient';
import '../../../css/modal.css';
import { formatDate } from '../../../lib/util/dateUtil';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const today = new Date();

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
            Idx: 1,
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
        });
    }

    handleIdSubmit = () => {
        let enabled = true;
        httpPost(httpUrl.registNotice, [], {
            ...this.formRef.current.getFieldsValue(),
            // name: this.formRef.current.getFieldsValue().surchargeName,
            // extraPrice: this.formRef.current.getFieldsValue().feeAdd,
            enabled,
            idx: this.state.idx,
            date: moment(today.format('YYYY-MM-DD')),
            deleted: false,
        }).then((result) => {
            alert('공지사항이 전송되었습니다.');
            this.handleClear();
            this.getList();
        }).catch((error) => {
            alert('에러가 발생하였습니다 다시 시도해주세요.')
        });
    }

    handleClear = () => {
        this.formRef.current.resetFieldsValue()
    };

    onDelete = (row) => {
        let idx = row.idx;
        let deleted = row.deleted;
        httpGet(httpUrl.registNotice, [idx, deleted], {})
            .then((result) => {
                // console.log('## delete result=' + JSON.stringify(result, null, 4))
                alert('해당공지사항을 삭제합니다.')

                this.setState({deleted: true});
                this.getList();
            })
            .catch((error) => {
                alert('에러가 발생하였습니다 다시 시도해주세요.')
            });
    };

    updateData = () => {

    }


    render() {

        const columns = [
            {
                className: "table-column-center",
                render: (data,row) =>
                    <div>
                        <Button
                            className="tabBtn surchargeTab"
                            onClick={() => {this.onDelete(row)}}
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
                onClick={()=>{}}>
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
                                            <div className="mainTitle">
                                                공지사항 추가 및 수정
                                            </div>
                                                <div className="inputBox">
                                                    <FormItem
                                                        className="noticeInputBox"
                                                        name="surchargeName"
                                                    >
                                                        <Input className="noticeInputBox" placeholder="공지 내용"/>
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