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
            btnInfos: [
                {
                    value: 5,
                    text: '5분',
                    toggle: true,
                },
                {
                    value: 10,
                    text: '10분',
                    toggle: true,
                },
                {
                    value: 15,
                    text: '15분',
                    toggle: true,
                },
                {
                    value: 20,
                    text: '20분',
                    toggle: true,
                },
                {
                    value: 30,
                    text: '30분',
                    toggle: true,
                },
                {
                    value: 40,
                    text: '40분',
                    toggle: true,
                },
                {
                    value: 1005,
                    text: '후 5분',
                    toggle: true,
                },
                {
                    value: 1010,
                    text: '후 10분',
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
                btnInfos: this.state.btnInfos.map(btnInfo => { return { ...btnInfo, toggle: false } })
            })
        } else {
            this.setState({
                btnInfos: this.state.btnInfos.map(btnInfo => { return { ...btnInfo, toggle: true } })
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
                    text: btnInfo.text,
                    toggle: !btnInfo.toggle
                };
            } else {
                return btnInfo;
            }
        })
        this.setState({ btnInfos: toggledBtnInfos });
    }

    handleSubmit = () => {
        if (this.props.branchIdx) {
            console.log(this.props.branchIdx);
            const btnInfos = this.state.btnInfos;
            httpPost(httpUrl.updateBranch, [], {
                "idx": this.props.branchIdx,
                "deliveryEnabled": !this.state.deliveryNotAvailable,
                "pickupAvTime10": btnInfos.find(e => e.value === 10).toggle,
                "pickupAvTime10After": btnInfos.find(e => e.value === 1010).toggle,
                "pickupAvTime15": btnInfos.find(e => e.value === 15).toggle,
                "pickupAvTime20": btnInfos.find(e => e.value === 20).toggle,
                "pickupAvTime30": btnInfos.find(e => e.value === 30).toggle,
                "pickupAvTime40": btnInfos.find(e => e.value === 40).toggle,
                "pickupAvTime5": btnInfos.find(e => e.value === 5).toggle,
                "pickupAvTime50": true,
                "pickupAvTime5After": btnInfos.find(e => e.value === 1005).toggle,
                "pickupAvTime60": true,
                "pickupAvTime70": true
            })
                .then((res) => {
                    if (res.result === "SUCCESS") {
                        alert('성공적으로 처리되었습니다.')
                    }
                    else {
                        alert('res는 왔는데 result가 SUCCESS가 아닌 경우.');
                    }
                })
                .catch((e) => {
                    console.log(e);
                    alert("처리가 실패했습니다.");
                });
        } else {
            alert('지점을 선택해주세요!');
        }
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
                                                    return (
                                                        <Button
                                                            icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                            className="timeDelay-box-on"
                                                            onClick={() => this.handleToggle(btnInfo.value)}
                                                        ><td>{`${btnInfo.text}`}</td></Button>
                                                    )
                                                } else {
                                                    return (
                                                        <Button
                                                            icon={<ClockCircleOutlined style={{ fontSize: 60, width: 100 }} />}
                                                            className="timeDelay-box-off"
                                                            onClick={() => this.handleToggle(btnInfo.value)}
                                                        ><td>{`${btnInfo.text}`}</td></Button>
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
        branchIdx: state.login.loginInfo.branch,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeDelayDialog);