import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text,
} from "antd";
import '../../../css/modal.css';
import { comma } from "../../../lib/util/numberUtil";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SurchargeDialog extends Component {
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
                useType: 1,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500',
            },
            {
                useType: 0,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },
            {
                useType: 1,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },
            {
                useType: 0,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },
            {
                useType: 0,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },
            {
                useType: 0,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },

        ];
        this.setState({
            list: list,
        });
    }

    render() {

        const columns = [
            {
                title: "사용여부",
                dataIndex: "useType",
                className: "table-column-center",
                render: (data) => <div>
                    <Button
                        className="tabBtn surchargeTab"
                        onClick={() => { }}
                    >{data == 0 ? "OFF"
                        : data == 1 ? "ON" : "ON"}</Button>
                </div>
            },
            {
                title: "할증명",
                dataIndex: "surchargeTitle",
                className: "table-column-center",
                render: (data) => <div>{data == 0 ? "우천할증" : "설연휴할증"}</div>
            },
            {
                title: "적용시간",
                dataIndex: "completionTime",
                className: "table-column-center",
                render: (data) => <div>{data}</div>
            },
            {
                title: "추가요금",
                dataIndex: "addFee",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            },
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
        ];

        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="surcharge-Dialog">
                                <div className="surcharge-container">
                                    <div className="surcharge-title">
                                        할증
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <div className="surchargeLayout">
                                        <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                            <div className="listBlock">
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
                                            <div className="insertBlock">
                                                <div className="mainTitle">
                                                    할증 요금 정보
                                                </div>
                                                <div className="m-t-20">
                                                    <div className="subTitle">
                                                        할증명
                                                    </div>
                                                    <div className="inputBox">
                                                        <FormItem
                                                            name="surchargeName"
                                                            rules={[{ required: true, message: "할증명을 입력해주세요." }]}
                                                        >
                                                            <Input />
                                                        </FormItem>
                                                    </div>
                                                    <div className="subDatePrice">
                                                        등록기간
                                                    </div>
                                                    <div className="selectBox">
                                                        <FormItem
                                                            name="surchargeDate"
                                                            rules={[{ required: true, message: "등록기간 날짜를 선택해주세요" }]}
                                                        >
                                                            <RangePicker
                                                                onChange={this.onChangeDate}
                                                            />
                                                        </FormItem>
                                                    </div>
                                                    <div className="subDatePrice">
                                                        추가요금
                                                    </div>
                                                    <div className="inputBox">
                                                        <FormItem
                                                            name="feeAdd"
                                                            rules={[{ required: true, message: "추가금액을 입력해주세요." }]}
                                                        >
                                                            <Input />
                                                        </FormItem>
                                                        <div className="priceText">
                                                            원
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="btnInsert">
                                                    <Button type="primary" htmlType="submit" className="tabBtn insertTab">
                                                        등록하기
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

export default (SurchargeDialog);