import React, { Component } from "react";
import {
    Form, Input, DatePicker, Button, Select, Checkbox
} from "antd";
import '../../../css/modal.css';
import moment from 'moment';

const FormItem = Form.Item;

const Option = Select.Option;

const dateFormat = 'YYYY/MM/DD';
const today = new Date();
const {RangePicker} = DatePicker;


class TaskWorkDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: today,
            isTimeLimit: false,
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

    timeLimitCheck = () => {
        if(this.state.isTimeLimit){
            this.setState({
                isTimeLimit: false,
            })
        } else{
            this.setState({
                isTimeLimit: true,
            })
        }
        
    }



    render() {



        const { close } = this.props;

        return (

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
                                                <Checkbox></Checkbox>
                                                {/* <span className="useText">사용함</span> */}
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
                                                            <Input style={{marginRight:10, float: "left"}}/>
                                                        </FormItem>원
                                                    </div>
                                                </div>

                                            </div>
                                                <div className="twl taskWork-list-05">
                                                    <td>기간제한사용</td>
                                                    <Checkbox className="useBtn" onClick={this.timeLimitCheck} style={{marginLeft:0}}></Checkbox>
                                                    
                                                    {this.state.isTimeLimit &&
                                                        <RangePicker
                                                            placeholder={['시작일', '종료일']}
                                                            showTime={{ format: 'MM:dd' }}
                                                            onChange={this.onChangeDate}
                                                        />
                                                    }

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

        )
    }
}

export default (TaskWorkDialog);