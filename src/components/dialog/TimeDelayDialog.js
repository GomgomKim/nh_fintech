import React, { Component } from "react";
import { Form, Button, Input, Checkbox, Select, Radio, Modal } from 'antd';
import '../../css/modal.css';

const FormItem = Form.Item;
const { Option } = Select;

class SurchargeDialog extends Component {
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
                                <div className="timeDelay-Pop-title">
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="timeDelay-Pop-title-1" />
                                </div>
                                <div className="timeDelay-Pop-content">

                                    <div className="timeDelay_inner">
                                        example dialog

                                        <FormItem
                                                    style={{ marginBottom: 0, display: 'inline-block', verticalAlign: 'middle' }}
                                                    name="phone1"
                                                    className="phone-num-select"
                                                    initialValue="가맹점 선택"
                                                >
                                                    <Select size="large">
                                                        <Option value="010">010</Option>
                                                        <Option value="011">011</Option>
                                                        <Option value="016">016</Option>
                                                        <Option value="017">017</Option>
                                                        <Option value="018">018</Option>
                                                        <Option value="019">019</Option>
                                                    </Select>
                                                </FormItem>
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

export default (SurchargeDialog);