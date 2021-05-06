import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../../css/modal.css';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../../api/httpClient';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Search = Input.Search;

class RegistStaffDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            staffAuth: 1,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
    }

    onChange = e => {
        // console.log('radio checked', e.target.value);
        this.setState({
            staffAuth: e.target.value,
        });
    };

    handleSubmit = () => {
        console.log(this.formRef.current)
        // httpPost(httpUrl.registStaff, [], {
        //     lotteryNums: this.formRef.current,
        //     lotteryType: 0,
        // }).then((result) => {
        //     console.log("## result: " + JSON.stringify(result, null, 4));
        //     alert('나의로또볼이 저장되었습니다.')
        //     this.props.history.push('/lottery/megamillionStep')
        // }).catch(e => {
        //     alert('에러가 발생하였습니다 다시 시도해주세요.')
        // });
    }


    handleClear = () => {
        this.formRef.current.setFieldsValue({
            belongBranch: undefined,
            staffName: undefined,
            password: undefined,
            phoneNumber: undefined,
            memo: undefined,
            rank: undefined,
            auth: undefined,
        });
    };

    render() {
        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="registStaff-Dialog">
                                <div className="registStaff-content">
                                    <div className="registStaff-title">
                                        직원 등록
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">
                                            <div className="registStaffWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        소속지사
                                                    </div>
                                                    <FormItem
                                                        name="belongBranch"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="소속지사를 선택해 주세요." className="override-select branch">
                                                            <Option value={0}>플러스김포 / 플러스김포</Option>
                                                            <Option value={1}>김포1지점 / 플러스김포</Option>
                                                            <Option value={2}>김포2지점 / 플러스김포</Option>
                                                        </Select>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        직원명
                                                    </div>
                                                    <FormItem
                                                        name="staffName"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="직원명을 입력해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        패스워드
                                                    </div>
                                                    <FormItem
                                                        name="password"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="패스워드를 입력해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        휴대전화
                                                    </div>
                                                    <FormItem
                                                        name="phoneNumber"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="휴대전화 번호를 입력해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        메모
                                                    </div>
                                                    <FormItem
                                                        name="memo"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="메모를 입력해 주세요." className="override-input branch">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        직급
                                                    </div>
                                                    <FormItem
                                                        name="rank"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="직급을 선택해 주세요." className="override-select branch">
                                                            <Option value={0}>팀장</Option>
                                                            <Option value={1}>본부장</Option>
                                                            <Option value={2}>부지점장</Option>
                                                            <Option value={3}>지점장</Option>
                                                        </Select>
                                                    </FormItem>
                                                </div>
                                                {/* <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        권한
                                                    </div>

                                                    <FormItem
                                                        name="auth"
                                                        className="selectItem"
                                                    >
                                                        <Radio.Group onChange={this.onChange} value={this.state.staffAuth}>
                                                            <Radio value={1}>주문</Radio>
                                                            <Radio value={2}>기사</Radio>
                                                            <Radio value={3}>직원</Radio>
                                                            <Radio value={4}>가맹</Radio>
                                                        </Radio.Group>
                                                    </FormItem>
                                                </div> */}
                                                <div className="submitBlock">
                                                    <Button type="primary" htmlType="submit">
                                                        등록하기
                                                    </Button>

                                                    <Button className="clearBtn" onClick={this.handleClear}>
                                                        초기화
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>
                                    </Form>
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

export default (RegistStaffDialog);