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


class RiderCoinDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: today,

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
        // this.getList()
        // console.log(this.props)
    }

    setDate = (date) => {
        console.log(date)
    }



    render() {

        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="coinRider-Dialog">

                                <div className="coinRider-content">
                                    <div className="coinRider-title">
                                        코인이체
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="coinRider-close" />
                                    <div className="coinRider-title-sub">
                                        기사명 : ***
                                    </div>
                                    <div className="coinRider-inner">

                                        <div className="coinRider-list">

                                            <div className="twl coinRider-list">
                                                <td>코인잔액</td>
                                                <div className="inputBox inputBox-coinRider sub">
                                                    <FormItem
                                                        name="coinBalance"
                                                        rules={[{ required: true, message: "0건." }]}
                                                    >
                                                        <Input />
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="twl coinRider-list">
                                                <td>금액</td>
                                                <div className="inputBox inputBox-coinRider sub">
                                                    <FormItem
                                                        name="price"
                                                        rules={[{ required: true, message: "0건." }]}
                                                    >
                                                        <Input />
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="twl coinRider-list">
                                                <td>메모</td>
                                                <div className="inputBox inputBox-coinRider sub">
                                                    <FormItem
                                                        name="memo"
                                                        rules={[{ required: true, message: "0건." }]}
                                                    >
                                                        <Input />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="coinRider-btn-01">
                                        <Button
                                            className="tabBtn coinRider-btn"
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

export default (RiderCoinDialog);