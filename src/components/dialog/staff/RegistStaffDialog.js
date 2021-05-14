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
        // console.log(this.formRef.current.getFieldsValue().staffName)
        httpPost(httpUrl.registStaff, [], {
            riderName: this.formRef.current.getFieldsValue().riderName,
            id: this.formRef.current.getFieldsValue().id,
            email: this.formRef.current.getFieldsValue().email,
            password: this.formRef.current.getFieldsValue().password,
            phone: this.formRef.current.getFieldsValue().phone,
            memo: this.formRef.current.getFieldsValue().memo,
            riderStatus: this.formRef.current.getFieldsValue().riderStatus,
            ncash: 0,
            userStatus: 1,
            withdrawPassword: 0,
            bank: "한국은행",
            bankAccount: "111-111-1111",
            depositor: "냠냠박스",
            userType: 1,
            userGroup: 1,
            riderLevel: 1,
        }).then((result) => {
            console.log("## result: " + JSON.stringify(result, null, 4));
            alert('직원 등록이 완료되었습니다.');
            this.props.close()
            // this.props.history.push('/staff/StaffMain')
        }).catch(e => {
            alert('에러가 발생하였습니다 다시 시도해주세요.')
        });
    }


    handleClear = () => {
        this.formRef.current.setFieldsValue({
            riderName: undefined,
            password: undefined,
            phoneNumber: undefined,
            memo: undefined,
            rank: undefined,
            auth: undefined,
            id: undefined,
            email: undefined,
        });
    };



    render() {
        const { data, isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="registStaff-Dialog">
                                <div className="registStaff-content">
                                    <div className="registStaff-title">
                                    {data ? 
                                        "직원 수정" :
                                        "직원 등록" }
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">
                                            <div className="registStaffWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        직원명
                                                    </div>
                                                    <FormItem
                                                        name="riderName"
                                                        className="selectItem"
                                                    >   
                                                        {data ? 
                                                            <Input placeholder="직원명을 입력해 주세요." className="override-input" defaultValue={data.riderName}/> :
                                                            <Input placeholder="직원명을 입력해 주세요." className="override-input"/>
                                                        }
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        아이디
                                                    </div>
                                                    <FormItem
                                                        name="id"
                                                        className="selectItem"
                                                    >
                                                        {data ? 
                                                            <Input placeholder="아이디를 입력해 주세요." className="override-input" defaultValue={data.id}/> :
                                                            <Input placeholder="아이디를 입력해 주세요." className="override-input"/>
                                                        }
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        이메일
                                                    </div>
                                                    <FormItem
                                                        name="email"
                                                        className="selectItem"
                                                    >
                                                        {data ? 
                                                            <Input placeholder="ex) example@naver.com" className="override-input" defaultValue={data.email}/> :
                                                            <Input placeholder="ex) example@naver.com" className="override-input"/>
                                                        }
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
                                                        <Input.Password  placeholder="패스워드를 입력해 주세요." className="override-input"/>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        휴대전화
                                                    </div>
                                                    <FormItem
                                                        name="phone"
                                                        className="selectItem"
                                                    >
                                                        {data ? 
                                                            <Input placeholder="휴대전화 번호를 입력해 주세요." className="override-input" defaultValue={data.phone}/> :
                                                            <Input placeholder="휴대전화 번호를 입력해 주세요." className="override-input"/>
                                                        }
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
                                                        {data ? 
                                                            <Input placeholder="메모를 입력해 주세요." className="override-input" defaultValue={data.memo}/> :
                                                            <Input placeholder="메모를 입력해 주세요." className="override-input"/>
                                                        }
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        직급
                                                    </div>
                                                    <FormItem
                                                        name="riderLevel"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="직급을 선택해 주세요." className="override-select branch">
                                                            <Option value={2}>부팀장</Option>
                                                            <Option value={3}>팀장</Option>
                                                            <Option value={4}>부본부장</Option>
                                                            <Option value={5}>본부장</Option>
                                                            <Option value={7}>부지점장</Option>
                                                            <Option value={8}>지점장</Option>
                                                            <Option value={9}>센터장</Option>
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

                                                    {!data &&
                                                        <Button className="clearBtn" onClick={this.handleClear}>
                                                            초기화
                                                        </Button>
                                                    }
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