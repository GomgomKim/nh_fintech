import React, { Component } from "react";
import { Form, Button, Input, Checkbox, Select, Radio, Modal } from 'antd';
import '../../css/modal.css';
import { ClockCircleOutlined } from '@ant-design/icons';


const FormItem = Form.Item;
const Option = Select.Option;

class TimeDelayDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {


        const { isOpen, close } = this.props;
        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="timeDelay-Dialog">

                                <div className="timeDelay-content">
                                    <div className="timeDelay-title">
                                        시간지연
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="timeDelay-close" />
                                    <div className="timeDelay-inner">



                                        <div className="timeDelay-box">
                                            <Button
                                                icon={<ClockCircleOutlined style={ } />}
                                                className="timeDelay-box-01"
                                                onClick={() => { }}
                                            >10분</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-02"
                                                onClick={() => { }}
                                            >15분</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-03"
                                                onClick={() => { }}
                                            >20분</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-04"
                                                onClick={() => { }}
                                            >30분</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-05"
                                                onClick={() => { }}
                                            >40분</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-06"
                                                onClick={() => { }}
                                            >50분</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-07"
                                                onClick={() => { }}
                                            >0분</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-08"
                                                onClick={() => { }}
                                            >0분 지연</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-09"
                                                onClick={() => { }}
                                            >0분 지연</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-10"
                                                onClick={() => { }}
                                            >0분 지연</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-11"
                                                onClick={() => { }}
                                            >0분 지연</Button>
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                className="timeDelay-box-12"
                                                onClick={() => { }}
                                            >0분 지연</Button>

                                        </div>

                                        <div style={{ margin: 30, width: 610 }}>
                                            <div className="timeDelay-place1">
                                                <FormItem
                                                    style={{ marginBottom: 0, display: 'inline-block', verticalAlign: 'middle' }}
                                                    name="timeDelay-place"
                                                    initialValue="가맹점 선택"
                                                >
                                                    <Select placeholder="소속지사를 선택해 주세요." className="antd-select">
                                                        <Option value="플러스김포">플러스김포 / 플러스김포</Option>
                                                        <Option value="플러스김포">플러스김포1 / 플러스김포</Option>
                                                        <Option value="플러스김포">플러스김포2 / 플러스김포</Option>
                                                        <Option value="플러스김포">플러스김포3 / 플러스김포</Option>
                                                        <Option value="플러스김포">플러스김포4 / 플러스김포</Option>
                                                        <Option value="플러스김포">플러스김포5 / 플러스김포</Option>
                                                    </Select>
                                                </FormItem>
                                            </div>
                                            <div className="timeDelay-btn">
                                                <div className="timeDelay-btn-01">
                                                    배달불가
                                            </div>
                                                <Checkbox></Checkbox>
                                            </div>

                                            <div className="timeDelay-btn-02">
                                                <Button
                                                    className="tabBtn timeDelay-btn"
                                                    onClick={() => { }}
                                                >적용</Button>
                                            </div>
                                        </div>

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

export default (TimeDelayDialog);