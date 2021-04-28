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
                            <div className="Rider-Dialog">

                                <div className="rider-content">
                                    <div className="rider-title">
                                        기사 그룹관리
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="rider-close" />
                                    <div className="rider-inner">

                                        <div style={{ margin: 30, width: 610 }}>
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








                                            <div className="timeDelay-btn-01">
                                                <Button
                                                    className="tabBtn timeDelay-btn"
                                                    onClick={() => { }}
                                                >적용</Button>
                                            </div>

                                            <div className="timeDelay-btn-02">
                                                <Button
                                                    className="tabBtn timeDelay-btn"
                                                    onClick={() => { }}
                                                >닫기</Button>
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