import React, { Component } from "react";
import {
    Form, Input, DatePicker, Descriptions, Button, Select, Checkbox
} from "antd";
import '../../../css/modal.css';
import moment from 'moment';

const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Option = Select.Option;
const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();


class TaskWorkDialog extends Component {
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
                                        일차감 등록
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="taskWork-close" />
                                    <div className="taskWork-title-sub">
                                        일차감 정보

                                    </div>
                                    <div className="taskWork-inner">

                                        <div className="taskWork-list">

                                            <div className="twl taskWork-list-01">
                                                <td>사용여부</td>
                                                <Checkbox></Checkbox><td className="taskWorkSub">사용함</td>
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
                                                <td>차감금액</td>
                                                <div className="taskWork-place1">
                                                    <div className="inputBox inputBox-taskWork sub">
                                                        <FormItem
                                                            name="riderG"
                                                            rules={[{ required: true, message: "0건." }]}
                                                        >
                                                            <Input />
                                                        </FormItem>원
                                                    </div>

                                                </div>
                                                <div className="twl taskWork-list-05">
                                                    <td>&nbsp;</td>
                                                    <Checkbox>
                                                    </Checkbox><td className="taskWorkSub">기간제한사용</td>

                                                    <DatePicker
                                                        defaultValue={moment(today, dateFormat)}
                                                        format={dateFormat}
                                                        onChange={date => this.setState({ selectedDate: date })}
                                                        className="taskWork-datepicker"
                                                    /><td className="taskWorkSub1">부터</td>
                                                    <DatePicker
                                                        defaultValue={moment(today, dateFormat)}
                                                        format={dateFormat}
                                                        onChange={date => this.setState({ selectedDate: date })}
                                                        className="taskWork-datepicker"
                                                    /><td className="taskWorkSub1">까지</td>
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

export default (TaskWorkDialog);