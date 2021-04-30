import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../css/rider.css';
import moment from 'moment';
import { comma } from "../../lib/util/numberUtil";
import { formatDate } from "../../lib/util/dateUtil";

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
                            <div className="taskWork-Dialog">

                                <div className="taskWork-content">
                                    <div className="taskWork-title">
                                        코인이체
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="taskWork-close" />
                                    <div className="taskWork-title-sub">
                                        작업 스케줄러 정보

                                    </div>
                                    <div className="taskWork-inner">

                                        <div className="taskWork-list">

                                            <div className="twl taskWork-list-01">
                                                <td>사용여부</td>
                                                <Checkbox></Checkbox>사용함
                                            </div>
                                            <div className="twl taskWork-list-02">
                                                <td>작업명</td>
                                                <div className="inputBox inputBox-taskWork sub">
                                                    <FormItem
                                                        name="riderG"
                                                        rules={[{ required: true, message: "0건." }]}
                                                    >
                                                        <Input />
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="twl taskWork-list-03">
                                                <td>적용대상</td>
                                                <div className="taskWork-place1">
                                                    <FormItem
                                                        style={{ marginBottom: 0, display: 'inline-block', verticalAlign: 'middle' }}
                                                        name="taskWork-place"
                                                    >
                                                        <Select placeholder="적용대상을 선택해주세요" className="taskWork-select">
                                                            <Option value={1}>대여금 -36300원 배지현</Option>
                                                            <Option value={2}>대여금 -36300원 배지현</Option>
                                                            <Option value={3}>대여금 -36300원 배지현</Option>
                                                        </Select>

                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="twl taskWork-list-04">
                                                <td>실행타입</td>
                                                <div className="taskWork-place1">
                                                    <FormItem
                                                        style={{ marginBottom: 0, display: 'inline-block', verticalAlign: 'middle' }}
                                                        name="taskWork-place2"
                                                    >
                                                        <Select placeholder="실행타입을 선택해주세요" className="taskWork-select">
                                                            <Option value={1}>매일</Option>
                                                            <Option value={2}>매일(월~토)</Option>
                                                            <Option value={3}>매주일요일</Option>
                                                            <Option value={3}>매주월요일</Option>
                                                            <Option value={3}>매주화요일</Option>
                                                            <Option value={3}>매주수요일</Option>
                                                            <Option value={3}>매주목요일</Option>
                                                            <Option value={3}>매주금요일</Option>
                                                            <Option value={3}>매주토요일</Option>
                                                            <Option value={3}>매월말일</Option>
                                                            <Option value={3}>매월1일</Option>
                                                            <Option value={3}>매월5일</Option>
                                                            <Option value={3}>매월10일</Option>
                                                            <Option value={3}>매월15일</Option>
                                                            <Option value={3}>매월20일</Option>
                                                            <Option value={3}>매월25일</Option>
                                                        </Select>

                                                    </FormItem>
                                                </div>
                                                <div className="twl taskWork-list-05">
                                                    <td>&nbsp;</td>
                                                    <Checkbox>
                                                    </Checkbox>기간제한사용

                                                        <DatePicker
                                                        defaultValue={moment(today, dateFormat)}
                                                        format={dateFormat}
                                                        onChange={date => this.setState({ selectedDate: date })}
                                                        className="taskWork-datepicker"
                                                    />부터
                                                    <DatePicker
                                                        defaultValue={moment(today, dateFormat)}
                                                        format={dateFormat}
                                                        onChange={date => this.setState({ selectedDate: date })}
                                                        className="taskWork-datepicker"
                                                    />까지
                                                </div>
                                                <div className="twl taskWork-list-06">
                                                    <td>금액</td>
                                                    <div className="inputBox inputBox-taskWork sub">
                                                        <FormItem
                                                            name="riderG"
                                                            rules={[{ required: true, message: "0건." }]}
                                                        >
                                                            <Input />
                                                        </FormItem>원
                                                </div>
                                                    <div className="taskWork-place1">
                                                        <FormItem
                                                            style={{ marginBottom: 0, display: 'inline-block', verticalAlign: 'middle' }}
                                                            name="taskWork-place3"
                                                        >
                                                            <Select placeholder="차감" className="taskWork-select taskWork-select-06">
                                                                <Option value={1}>차감</Option>
                                                                <Option value={2}>적립</Option>
                                                            </Select>

                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="taskWork-btn-01">
                                        <Button
                                            className="tabBtn taskWork-btn"
                                            onClick={() => { }}
                                        >등록</Button>


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