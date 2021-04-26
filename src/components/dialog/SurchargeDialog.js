import React, { Component } from "react";
import { Form, Modal, Input, DatePicker, Descriptions, Upload, Button, Select, Icon, Radio, Carousel, Text } from "antd";
import '../../css/modal.css';
const Option = Select.Option;

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
                            <div className="surcharge-dialog">
                                <div className="surcharge-container">
                                    <div className="surcharge-title">
                                        할증
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="surcharge-close" />

                                    <div className="selLayout">
                                        <div className="selectBlock">
                                            <div className="mainTitle">
                                                소속지사
                                            </div>
                                            <Select placeholder="소속지사를 선택해 주세요." className="antd-select">
                                                <Option value={0}>플러스김포 / 플러스김포</Option>
                                                <Option value={1}>김포1지점 / 플러스김포</Option>
                                                <Option value={2}>김포2지점 / 플러스김포</Option>
                                            </Select>
                                        </div>
                                        <div className="listBlock">

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

export default (SurchargeDialog);