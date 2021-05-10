import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../../css/rider.css';
import moment from 'moment';
import { comma } from "../../../lib/util/numberUtil";
import { formatDate } from "../../../lib/util/dateUtil";

const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Option = Select.Option;
const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();


class CoinTransferDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: today,
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
        };
        this.formRef = React.createRef();
    }
    componentDidMount() {
        // this.getList()
        // console.log(this.props)
    }

    setDate = (date) => {
        console.log(date)
    }


    render() {

        const { isOpen, close } = this.props;
        const columns = [
            {
                title: "날짜",
                dataIndex: "data",
                className: "table-column-center",
                width: "20%",
            },
            {
                title: "금액",
                dataIndex: "price",
                className: "table-column-center",
                width: "30%",
            },
            {
                title: "이체 후 잔액",
                dataIndex: "email",
                className: "table-column-center",
                width: "30%",
            },
            {
                title: "메모",
                dataIndex: "riderName",
                className: "table-column-center",
                width: "20%",
            },

        ];


        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="coinTran-Dialog">

                                <div className="coinTran-content">
                                    <div className="coinTran-title">
                                        코인이체
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="coinTran-close" />
                                    <div className="coinTran-title-sub">
                                        계룡리슈빌)잭슨부대
                                    </div>
                                    <div className="coinTran-inner">

                                        <div className="coinTran-list">

                                            <div className="twl coinTran-list">
                                                <td>코인잔액</td>
                                                <div className="inputBox inputBox-coinTran sub">
                                                    <FormItem>
                                                        <Input
                                                            name="coinBalance"
                                                            value={"111,111원"} />
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="twl coinTran-list">
                                                <td>금액</td>
                                                <div className="inputBox inputBox-coinTran sub">
                                                    <FormItem
                                                        name="price"
                                                        rules={[{ required: true, message: "0건." }]}
                                                    >
                                                        <Input />
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="twl coinTran-list">
                                                <td>메모</td>
                                                <div className="inputBox inputBox-coinTran sub">
                                                    <FormItem
                                                        name="memo"
                                                        rules={[{ required: true, message: "0건." }]}
                                                    >
                                                        <Input />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="dataTableLayout-01">
                                            <span className="coinTran-title-02">이체내역</span><br /><br />
                                            <Table
                                                dataSource={this.state.results}
                                                columns={columns}
                                                pagination={this.state.pagination}
                                                onChange={this.state.Status}
                                            />
                                        </div>

                                    </div>

                                    <div className="coinTran-btn-01">
                                        <Button
                                            className="tabBtn coinTran-btn"
                                            onClick={() => { }}
                                        >코인이체</Button>


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

export default (CoinTransferDialog);