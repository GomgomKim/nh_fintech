import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../../css/rider.css';
import '../../../css/modal.css';
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


class UpdatePasswordDialog extends Component {
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
                                        출금 비밀번호 초기화
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="coinRider-close" />
                                    <div className="coinRider-title-sub">
                                        기사명 : ***
                                    </div>
                                    <div className="updatePassword-inner">

                                        <div className="coinRider-list">

                                            <div className="twl coinRider-list">
                                                <td>출금 비밀번호</td>
                                                <div className="inputBox inputBox-coinRider sub">
                                                    <FormItem
                                                        name="coinBalance"
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
                                        >설정</Button>


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

export default (UpdatePasswordDialog);