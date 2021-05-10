import React, { Component } from "react";
import { Form, Checkbox, Radio } from 'antd';
import '../../../css/modal.css';

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
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="filtering-close" />


                                    <div className="filtering-inner">

                                        <div className="filtering-box">
                                            <div className="filtering-btn-01">
                                                <Checkbox defaultChecked="checked" >접수</Checkbox>
                                            </div>

                                            <div className="filtering-btn-03">
                                                <Checkbox defaultChecked="checked" >현금</Checkbox>
                                            </div>
                                            <div className="filtering-btn-04">
                                                <Checkbox defaultChecked="checked">배차</Checkbox>
                                            </div>
                                            <div className="filtering-btn-05">
                                                <Checkbox defaultChecked="checked">카드</Checkbox>
                                            </div>
                                            <div className="filtering-btn-06">
                                                <Checkbox defaultChecked="checked">픽업</Checkbox>
                                            </div>
                                            <div className="filtering-btn-07">
                                                <Checkbox defaultChecked="checked">선결</Checkbox>
                                            </div>
                                            <div className="filtering-btn-08">
                                                <Checkbox defaultChecked="checked">취소</Checkbox>
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