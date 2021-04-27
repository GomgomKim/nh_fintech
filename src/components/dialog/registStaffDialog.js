import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text,
} from "antd";
import '../../css/modal.css';
import { comma } from "../../lib/util/numberUtil";
import { formatDate } from "../../lib/util/dateUtil";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SurchargeDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
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
                                        직원 등록
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="surcharge-close" />


                                    <div className="surchargeLayout">
                                        <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                            <div className="selectBlock">
                                                <div className="subTitle">
                                                    소속지사
                                                </div>
                                                <FormItem
                                                    name="belongBranch"
                                                    className="selectItem"
                                                >
                                                    <Select placeholder="소속지사를 선택해 주세요." className="override-select">
                                                        <Option value={0}>플러스김포 / 플러스김포</Option>
                                                        <Option value={1}>김포1지점 / 플러스김포</Option>
                                                        <Option value={2}>김포2지점 / 플러스김포</Option>
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        </Form>
                                        <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                            <div className="insertBlock">
                                                <div style={{ marginTop: 20 }}>
                                                    <div className="subTitle">
                                                        직원명
                                                    </div>
                                                    <div className="inputBox">
                                                        <FormItem
                                                            name="staffName"
                                                            rules={[{ required: true, message: "직원명을 입력해주세요." }]}
                                                        >
                                                            <Input />
                                                        </FormItem>
                                                    </div>
                                                </div>

                                                <div style={{ marginTop: 20 }}>
                                                    <div className="subTitle">
                                                        아이디
                                                    </div>
                                                    <div className="inputBox">
                                                        <FormItem
                                                            name="staffId"
                                                            rules={[{ required: true, message: "아이디를 입력해주세요." }]}
                                                        >
                                                            <Input />
                                                        </FormItem>
                                                    </div>
                                                </div>

                                                <div style={{ marginTop: 20 }}>
                                                    <div className="subTitle">
                                                        패스워드
                                                    </div>
                                                    <div className="inputBox">
                                                        <FormItem
                                                            name="staffPassword"
                                                            rules={[{ required: true, message: "패스워드를 입력해주세요." }]}
                                                        >
                                                            <Input />
                                                        </FormItem>
                                                    </div>
                                                </div>

                                                <div style={{ marginTop: 20 }}>
                                                    <div className="subTitle">
                                                        휴대전화
                                                    </div>
                                                    <div className="inputBox">
                                                        <FormItem
                                                            name="staffPhoneNum"
                                                            rules={[{ required: true, message: "휴대전화를 입력해주세요." }]}
                                                        >
                                                            <Input />
                                                        </FormItem>
                                                    </div>
                                                </div>

                                                <div style={{ marginTop: 20, width: 400, height: 100 }}>
                                                    <div className="subTitle">
                                                        메모
                                                    </div>
                                                    <div className="memoInputBox">
                                                        <FormItem
                                                            name="staffMemo"
                                                        >
                                                            <Input />
                                                        </FormItem>
                                                    </div>
                                                </div>

                                                <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                                    <div className="selectBlock">
                                                        <div className="subTitle">
                                                            직급
                                                        </div>
                                                        <FormItem
                                                            name="belongBranch"
                                                            className="selectItem"
                                                        >
                                                            <Select placeholder="직급을 선택해 주세요." className="override-select">
                                                                <Option value={0}>직원</Option>
                                                                <Option value={1}>팀장</Option>
                                                                <Option value={2}>본부장</Option>
                                                                <Option value={3}>부지점장</Option>
                                                                <Option value={4}>지점장</Option>
                                                            </Select>
                                                        </FormItem>
                                                    </div>
                                                </Form>


                                                <div className="btnInsert">
                                                    <Button type="primary" htmlType="submit" className="tabBtn insertTab">
                                                        등록하기
                                                    </Button>
                                                </div>
                                            </div>
                                        </Form>
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