import React, { Component } from "react";
import { Form, Button, Input, Checkbox, Select, Radio, Modal } from 'antd';
import '../../css/modal.css';

const FormItem = Form.Item;
const { Option } = Radio;

class FilteringDialog extends Component {
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
                            <div className="filtering-Dialog">

                                <div className="filtering-content">
                                    <div className="timeDelay-title">
                                        상태 필터링
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="filtering-close" />


                                    <div className="filtering-inner">

                                        <div className="filtering-box">
                                            <div className="filtering-btn-01">
                                                <Checkbox>접수</Checkbox>
                                            </div>
                                            <div className="filtering-btn-02">
                                                <Checkbox>완료</Checkbox>
                                            </div>
                                            <div className="filtering-btn-03">
                                                <Checkbox>배차</Checkbox>
                                            </div>
                                            <div className="filtering-btn-04">
                                                <Checkbox>현금</Checkbox>
                                            </div>
                                            <div className="filtering-btn-05">
                                                <Checkbox>픽업</Checkbox>
                                            </div>
                                            <div className="filtering-btn-06">
                                                <Checkbox>카드</Checkbox>
                                            </div>
                                            <div className="filtering-btn-07">
                                                <Checkbox>취소</Checkbox>
                                            </div>
                                            <div className="filtering-btn-08">
                                                <Checkbox>선결</Checkbox>
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

export default (FilteringDialog);