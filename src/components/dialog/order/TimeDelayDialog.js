import React, { Component } from "react";
import { Form, Button, Input, Checkbox, Select, Radio, Modal } from 'antd';
import '../../../css/modal.css';
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
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="timeDelay-close" />
                                    <div className="timeDelay-inner">



                                        <div className="timeDelay-box">
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-01"
                                                onClick={() => { }}
                                            ><td>10분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-02"
                                                onClick={() => { }}
                                            ><td>15분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-03"
                                                onClick={() => { }}
                                            ><td>20분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-04"
                                                onClick={() => { }}
                                            ><td>25분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-05"
                                                onClick={() => { }}
                                            ><td>30분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-06"
                                                onClick={() => { }}
                                            ><td>40분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-07"
                                                onClick={() => { }}
                                            ><td>50분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-08"
                                                onClick={() => { }}
                                            ><td>0분 지연</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-09"
                                                onClick={() => { }}
                                            ><td>0분 지연</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-10"
                                                onClick={() => { }}
                                            ><td>0분 지연</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-11"
                                                onClick={() => { }}
                                            ><td>0분 지연</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-12"
                                                onClick={() => { }}
                                            ><td>0분 지연</td></Button>

                                        </div>

                                        <div style={{ margin: 20, width: 610 }}>
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