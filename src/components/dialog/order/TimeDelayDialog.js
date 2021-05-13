import React, { Component } from "react";
import { Form, Button, Checkbox, Select } from 'antd';
import '../../../css/modal.css';
import { ClockCircleOutlined } from '@ant-design/icons';


const FormItem = Form.Item;
const Option = Select.Option;

class TimeDelayDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deliveryNotAvailable: false,
            delayTime: '',
        }
    }

    handleChange = e => {
        this.setState({
            deliveryNotAvailable: e.target.checked,
        });
        if (e.target.checked) {
            this.setState({
                delayTime: '',
            })
        }
    }

    handleClick = (value) => {
        this.setState({
            delayTime: value
        });
    }

    handleSubmit = this.props.onSubmit;

    render() {

        const btnInfos = ['5분', '10분', '15분', '20분', '30분', '40분', '후 5분', '후 10분']
        const disabledBtn = ['5분', '40분', '후 10분']

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
                                        호출설정
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="timeDelay-close" />
                                    <div className="timeDelay-inner">
                                        <div className="timeDelay-box">
                                            {btnInfos.map(btnInfo => {
                                                if (!this.state.deliveryNotAvailable) {
                                                    if (disabledBtn.includes(btnInfo)) {
                                                        return (
                                                            <Button
                                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                                className="timeDelay-box-01"
                                                                disabled
                                                            ><td>{btnInfo}</td></Button>
                                                        )
                                                    } else {
                                                        return (
                                                            <Button
                                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                                className="timeDelay-box-01"
                                                                onClick={() => this.handleClick(btnInfo)}
                                                            ><td>{btnInfo}</td></Button>
                                                        )
                                                    }
                                                } else {
                                                    return (
                                                        <Button
                                                            icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                            className="timeDelay-box-01"
                                                            disabled
                                                        ><td>{btnInfo}</td></Button>
                                                    )
                                                }
                                            })}
                                            {/* <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-01"
                                                onClick={() => { }}
                                                disabled
                                            ><td>5분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-02"
                                                onClick={() => { }}
                                                disabled
                                            ><td>10분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-03"
                                                onClick={() => { }}
                                            ><td>15분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-04"
                                                onClick={() => { }}
                                            ><td>20분</td></Button>
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
                                            ><td>후 5분</td></Button>
                                            <Button
                                                icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                className="timeDelay-box-08"
                                                onClick={() => { }}
                                            ><td>후 10분</td></Button> */}
                                        </div>

                                        <div style={{ margin: 20, width: 610 }}>

                                            <div className="timeDelay-btn">
                                                <div className="timeDelay-btn-01">
                                                    배달불가
                                            </div>
                                                <Checkbox
                                                    onChange={e => this.handleChange(e)}
                                                    style={{ marginTop: 11 }}
                                                ></Checkbox>
                                            </div>

                                            <div className="timeDelay-btn-02">
                                                <Button
                                                    className="tabBtn timeDelay-btn"
                                                    onClick={() => {
                                                        this.handleSubmit(this.state.delayTime);
                                                        close();
                                                    }}
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