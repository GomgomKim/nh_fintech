import React, { Component } from "react";
import {
    Form, Input, Button, Select,
} from "antd";
import '../../../css/modal.css';
import '../../../css/modal_m.css';
import { httpUrl, httpPost } from "../../../api/httpClient";
const Option = Select.Option;
const FormItem = Form.Item;

class UpdateStaffDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            staffUpdate: [],
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


    handleSubmit = () => {
        const form = this.formRef.current;

        console.log(JSON.stringify(form.getFieldValue('staffUpdate')));
        httpPost(httpUrl.staffUpdate, [], {
            staffUpdate: form.getFieldValue('staffUpdate')
        }).then((result) => {
            console.log("## result: " + JSON.stringify(result, null, 4));
            alert('직원정보 수정이 완료되었습니다.')
            this.props.close()
            // this.props.history.push('../../pages/staff/StaffMain')

        });

        //.catch(e => {
        //     console.log('## change error: ' + e);
        //     Modal.info({
        //         title: "등록 실패",
        //         content: (
        //             <div>
        //                 시스템에러로 직원수정 등록에 실패하였습니다. 잠시 후 다시 시도해주세요.
        //             </div>
        //         ),
        // onOk() { },
        // });
        //});
    }


    render() {
        const { data, isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="updateStaff-Dialog-overlay" onClick={close} />
                            <div className="updateStaff-Dialog">
                                <div className="updateStaff-content">
                                    <div className="updateStaff-title">
                                        직원 정보 수정
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">
                                            <div className="updateStaffWrapper">
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
                                                        <Input defaultValue={data.riderName} className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        아이디
                                                    </div>
                                                    <FormItem
                                                        name="staffId"
                                                        className="selectItem"
                                                    >
                                                        <Input defaultValue={data.id} className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        이메일
                                                    </div>
                                                    <FormItem
                                                        name="staffEmail"
                                                        className="selectItem"
                                                    >
                                                        <Input defaultValue={data.email} className="override-input">
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
                                                        <Input defaultValue={data.phone} className="override-input">
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
                                                        <Input defaultValue={data.memo} className="override-input branch">
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

export default (UpdateStaffDialog);