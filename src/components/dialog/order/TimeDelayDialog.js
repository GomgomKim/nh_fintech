import React, { Component } from "react";
import { Form, Button, Checkbox, Select } from 'antd';
import '../../../css/modal.css';
import { ClockCircleOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { httpPost, httpUrl } from "../../../api/httpClient";

const FormItem = Form.Item;
const Option = Select.Option;

class TimeDelayDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            branchIdx: null,
            deliveryNotAvailable: false,
            delayTime: '',
            btnInfos: [
                {
                    value: 5,
                    toggle: true,
                },
                {
                    value: 10,
                    toggle: true,
                },
                {
                    value: 15,
                    toggle: true,
                },
                {
                    value: 20,
                    toggle: true,
                },
                {
                    value: 30,
                    toggle: false,
                },
                {
                    value: 40,
                    toggle: true,
                },
                {
                    value: 1005,
                    toggle: true,
                },
                {
                    value: 1010,
                    toggle: true,
                },
            ],
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

    handleToggle = (value) => {
        const toggledBtnInfos = this.state.btnInfos.map(btnInfo => {
            if (btnInfo.value === value) {
                return {
                    value: value,
                    toggle: !btnInfo.toggle
                };
            } else {
                return btnInfo;
            }
        })
        this.setState({ btnInfos: toggledBtnInfos });
    }

    handleSubmit = () => {
        httpPost(httpUrl.updateBranch, [], {
            "idx": this.props.branchIdx,
            "pickupAvTime10": true,
            "pickupAvTime10After": true,
            "pickupAvTime15": true,
            "pickupAvTime20": true,
            "pickupAvTime30": true,
            "pickupAvTime40": true,
            "pickupAvTime5": true,
            "pickupAvTime50": true,
            "pickupAvTime5After": true,
            "pickupAvTime60": true,
            "pickupAvTime70": true,
            "startDate": "2021-03-03"
        })
            .then((res) => {
                if (res.data.result) {
                    this.props.onLogin(res.data.user);

                    let localData = {};
                    if (this.state.saveLoginId) {
                        localData = { type: 'saveLoginId', id: this.formRef.current.getFieldValue('id') }
                    }

                    this.props.history.push('/order/OrderMain')
                }
                else {
                    alert("아이디 또는 비밀번호가 잘못되었습니다.")
                }
            })
            .catch((error) => { });
    }

    render() {

        const btnInfos = this.state.btnInfos;

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
                                                if (btnInfo.toggle) {
                                                    if (btnInfo.value > 1000) {
                                                        btnInfo.value = `후 ${btnInfo.value % 1000}`
                                                    }
                                                    return (
                                                        <Button
                                                            icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                            className="timeDelay-box-on"
                                                            onClick={() => this.handleToggle(btnInfo.value)}
                                                        ><td>{`${btnInfo.value}분`}</td></Button>
                                                    )
                                                } else {
                                                    if (btnInfo > 1000) {
                                                        btnInfo = `후 ${btnInfo.value % 1000}`
                                                    }
                                                    return (
                                                        <Button
                                                            icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                            className="timeDelay-box-off"
                                                            onClick={() => this.handleToggle(btnInfo.value)}
                                                        ><td>{`${btnInfo.value}분`}</td></Button>
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
                                                        this.handleSubmit();
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

const mapStateToProps = (state) => {
    return {
        branchIdx: state.login.branch,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeDelayDialog);