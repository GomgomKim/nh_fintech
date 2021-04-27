import React, { Component } from "react";
import { Form, Button, Input, Checkbox, Select, Radio, Modal } from 'antd';
import '../../css/modal.css';

const FormItem = Form.Item;
const { Option } = Select;

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

                                <div className="timeDelay-Pop-content">

                                    <div className="timeDelay-inner">
                                        <div className="timeDelay-Pop-title">
                                            <img onClick={close} src={require('../../img/login/close.png').default} className="timeDelay-Pop-title-1" />
                                        </div>

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

                                        <div className="timeDelay-box">
                                            <div className="timeDelay-box-01">10분</div>
                                            <div className="timeDelay-box-02">15분</div>
                                            <div className="timeDelay-box-03">20분</div>
                                            <div className="timeDelay-box-04">30분</div>
                                            <div className="timeDelay-box-05">40분</div>
                                            <div className="timeDelay-box-06">50분</div>
                                            <div className="timeDelay-box-07">0분</div>
                                            <div className="timeDelay-box-08">0분</div>
                                            <div className="timeDelay-box-09">0분 지연</div>
                                            <div className="timeDelay-box-10">0분 지연</div>
                                            <div className="timeDelay-box-11">0분 지연</div>
                                            <div className="timeDelay-box-12">0분 지연</div>
                                        </div>

                                        <div className="timeDelay-btn-01">
                                            배달불가
                                            <Checkbox>

                                            </Checkbox>
                                        </div>

                                        <div className="timeDelay-btn-02">
                                            적용
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