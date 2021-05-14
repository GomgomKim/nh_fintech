import React, { Component } from "react";
import {
    Form, Input, DatePicker, Table,
    Button, Select,
} from "antd";
import { httpUrl, httpPost, httpGet } from '../../../api/httpClient';
import '../../../css/modal.css';
import { comma } from "../../../lib/util/numberUtil";
import moment from 'moment';
import SelectBox from '../../../components/input/SelectBox';
import string from "../../../string";
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
            startDate: "",
            endDate: "",
            branchIdx: 1,
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

    // 할증목록
    getList = () => {
        let pageNum = this.state.pagination.current;
        let pageSize = this.state.pagination.pageSize;
        httpGet(httpUrl.priceExtraList, [pageNum, pageSize], {}).then((res) => {
            const pagination = { ...this.state.pagination };
            pagination.current = res.data.currentPage;
            pagination.total = res.data.totalCount;
            this.setState({
                list: res.data.deliveryPriceExtras,
                pagination,
            });
        });
    }

    // 할증등록
    handleSubmit = () => {
        let enabled = true;
        httpPost(httpUrl.priceExtraRegist, [], {
            enabled,
            branchIdx: this.state.branchIdx,
            name: this.formRef.current.getFieldsValue().surchargeName,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            extraPrice: this.formRef.current.getFieldsValue().feeAdd,
        }).then((result) => {
            alert('할증 등록이 완료되었습니다.');
            let pageNum = this.state.pagination.current;
            this.getList({ pageSize: 5, pageNum });
        }).catch(result => {
            console.log("## create result: " + JSON.stringify(result, null, 4));
            alert('에러가 발생하였습니다 다시 시도해주세요.')
        });
    }

    // 할증삭제
    onDelete = (row) => {
        let idx = row.idx;
        httpGet(httpUrl.priceExtraDelete, [idx], {})
            .then((result) => {
                let pageNum = this.state.pagination.current;
                console.log('## delete result=' + JSON.stringify(result, null, 4))
                this.getList({ pageSize: 5, pageNum });
            })
            .catch((error) => { });
    };

    // 할증 사용여부수정
    onChangeStatus = (index, value) => {
        httpPost(httpUrl.priceExtraUpdate, [], { idx: index, enabled: value })
            .then((result) => {
                let pageNum = this.state.pagination.current;
                console.log('## update result=' + JSON.stringify(result, null, 4))
                alert('사용여부를 수정합니다.')
                this.getList({ pageSize: 5, pageNum });
            })
            .catch((error) => {
                console.log("## update result: " + JSON.stringify(error, null, 4));
                alert('에러가 발생하였습니다 다시 시도해주세요.')
            });
    }

    // 할증 등록기간 설정
    onChangeDate = (date, dateString) => {
        this.setState({
            startDate: moment(dateString[0]).format('YYYY-MM-DD HH:mm'),
            endDate: moment(dateString[1]).format('YYYY-MM-DD HH:mm'),
        },
        )
    };



    render() {

        const columns = [
            {
                title: "사용여부",
                dataIndex: "enabled",
                className: "table-column-center",
                render: (data, row) => <div>
                    <SelectBox
                        value={string.enabledString[data]}
                        code={string.enabledCode}
                        codeString={string.enabledString}
                        onChange={(value) => {
                            if (parseInt(value) !== row.enabled) {
                                this.onChangeStatus(row.idx, value);
                            }
                        }}
                    />
                </div>
            },
            {
                title: "할증명",
                dataIndex: "name",
                className: "table-column-center",
                render: (data) => <div>{data}</div>
            },
            {
                title: "적용시간",
                dataIndex: "completionTime",
                className: "table-column-center",
                render: (data, row) => <div>{row.startDate + ' 부터 ' + row.endDate}</div>
            },
            {
                title: "추가요금",
                dataIndex: "extraPrice",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            },
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
                                        <div className="listBlock">
                                            <Table
                                                // rowKey={(record) => record.idx}
                                                dataSource={this.state.list}
                                                columns={columns}
                                                pagination={this.state.pagination}
                                                onChange={this.handleTableChange}
                                            />
                                        </div>
                                        <Form ref={this.formRef} onFinish={this.handleSubmit}>
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
                                                            <Input style={{ width: 130 }} />
                                                        </FormItem>
                                                    </div>
                                                    <div className="subDatePrice">
                                                        등록기간s
                                                    </div>
                                                    <div className="selectBox">
                                                        <FormItem
                                                            name="surchargeDate"
                                                            rules={[{ required: true, message: "등록기간 날짜를 선택해주세요" }]}
                                                        >
                                                            <RangePicker
                                                                // popupStyle={{width: 100}}
                                                                showTime={{ format: 'HH:mm' }}
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
                                                            <Input style={{ width: 150 }} />
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