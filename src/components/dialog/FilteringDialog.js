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

                                <div className="filtering-Pop-content">

                                    <div className="filtering-inner">
                                        상태 필터링
                                        <div className="filtering-Pop-title">
                                            <img onClick={close} src={require('../../img/login/close.png').default} className="filtering-Pop-title-1" />
                                        </div>

                                        <div className="filtering-place1">
                                            <FormItem
                                                style={{ marginBottom: 0 }}
                                                name="smsAreee"
                                                initialValue={1}
                                                className="mypage-infochange-content-check-01-text-02-check"
                                            >
                                                <Radio.Group>
                                                    <Radio value={1} >예</Radio>
                                                    <Radio value={0} >아니오</Radio>
                                                </Radio.Group>
                                            </FormItem>
                                        </div>

                                        <div className="filtering-box">
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