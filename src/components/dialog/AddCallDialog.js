import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text,
} from "antd";
import '../../css/modal.css';
import { comma } from "../../lib/util/numberUtil";
import { formatDate } from "../../lib/util/dateUtil";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Search = Input.Search;

class AddCallDialog extends Component {
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
                        : data == 1 ? "ON" : "-"}</Button>
                </div>
            },
            {
                title: "할증명",
                dataIndex: "surchargeTitle",
                className: "table-column-center",
                render: (data) => <div>{data == 0 ? "준비중" : "완료"}</div>
            },
            {
                title: "적용기간",
                dataIndex: "applyTerm",
                className: "table-column-center",
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
                            <div className="addcall-Dialog">
                                <div className="addcall-container">
                                    <div className="addcall-title">
                                        콜등록
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="surcharge-close" />


                                    <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                        <div className="addcallLayout">
                                            <div className="addcallWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        소속지사
                                                </div>
                                                    <FormItem
                                                        name="belongBranch"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="소속지사를 선택해 주세요." className="override-select branch">
                                                            <Option value={0}>플러스김포 / 플러스김포</Option>
                                                            <Option value={1}>김포1지점 / 플러스김포</Option>
                                                            <Option value={2}>김포2지점 / 플러스김포</Option>
                                                        </Select>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        가맹점명
                                                </div>
                                                    <FormItem
                                                        name="franchiseName"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="가맹점을 선택해 주세요." className="override-select fran">
                                                            <Option value={0}>플러스김포 / 플러스김포</Option>
                                                            <Option value={1}>김포1지점 / 플러스김포</Option>
                                                            <Option value={2}>김포2지점 / 플러스김포</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <Search
                                                        placeholder="가맹점검색"
                                                        enterButton
                                                        allowClear
                                                        onSearch={this.onSearchFranchisee}
                                                        style={{
                                                            width: 190,
                                                            marginLeft: 10
                                                        }}
                                                    />
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        고객번호
                                                </div>
                                                    <Search
                                                        placeholder="가맹점검색"
                                                        enterButton
                                                        allowClear
                                                        onSearch={this.onSearchFranchisee}
                                                        style={{
                                                            width: 202,
                                                            marginLeft: 20
                                                        }}
                                                    />
                                                    <div className="mainTitle sub">
                                                        준비시간
                                                </div>
                                                    <FormItem
                                                        name="preparationTime"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="시간단위" className="override-select time">
                                                            <Option value={1}>1</Option>
                                                            <Option value={2}>2</Option>
                                                            <Option value={3}>3</Option>
                                                        </Select>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        도착지
                                                </div>
                                                    <FormItem
                                                        name="addrMain"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="도착지를 선택해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        상세주소
                                                </div>
                                                    <FormItem
                                                        name="addrSub"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="상세주소를 입력해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="addcallWrapper sub">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        메모
                                                </div>
                                                    <FormItem
                                                        name="callmemo"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="메모를 입력해 주세요." className="override-input memo">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        가격
                                                    </div>
                                                    <FormItem
                                                        name="callprice"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="가격 입력" className="override-input price">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        배달요금
                                                    </div>
                                                    <FormItem
                                                        name="callAmount"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="배달요금 입력" className="override-input delprice">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="m-t-10">
                                                    <FormItem
                                                        style={{
                                                            marginBottom: 0,
                                                            display: 'inline-block',
                                                            verticalAlign: 'middle',
                                                        }}
                                                        name="payType"
                                                        initialValue={0}
                                                    >
                                                        <Radio.Group>
                                                            <Radio style={{ fontSize: 18 }} value={0}>현금</Radio>
                                                            <Radio style={{ fontSize: 18 }} value={1}>카드</Radio>
                                                            <Radio style={{ fontSize: 18 }} value={2}>선결</Radio>
                                                        </Radio.Group>
                                                    </FormItem>
                                                </div>
                                                <Button type="primary" htmlType="submit" className="callTab">
                                                    등록하기
                                                </Button>
                                            </div>

                                            <div className="addcallMap">
                                                <img src={require('../../img/order/map.png').default}
                                                    style={{ width: 895, height: 430 }}
                                                ></img>
                                            </div>



                                        </div>
                                    </Form>




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

export default (AddCallDialog);