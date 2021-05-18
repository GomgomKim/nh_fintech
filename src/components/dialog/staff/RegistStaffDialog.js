import React, { Component } from "react";
import {
    Form, Input, Button, Select, Modal
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost } from '../../../api/httpClient';
const Option = Select.Option;
const FormItem = Form.Item;

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
        this.setState({
            staffAuth: e.target.value,
        });
    };

    handleSubmit = () => {
        let self = this;
        let data = this.props;
        Modal.confirm({
            title: <div> {data ? "직원 수정" : "직원 등록" } </div>,
            content:  
            <div>
               {data ? 
                    self.formRef.current.getFieldsValue().riderName + ' 의 정보를 수정하시겠습니까?':
                    self.formRef.current.getFieldsValue().riderName + ' 을 등록하시겠습니까?'
                }
            </div>,
            okText: "확인",
            cancelText: "취소",
            onOk() {
                httpPost(httpUrl.registStaff, [], {
                    ...self.formRef.current.getFieldsValue(),
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
                    Modal.info({
                        title: <div>{data ? "직원 수정" : "직원 등록" }</div>,
                        content: (
                            <div>
                                {data ? 
                                    self.formRef.current.getFieldsValue().riderName + ' 의 정보를 수정하였습니다':
                                    self.formRef.current.getFieldsValue().riderName + ' 을 등록하였습니다'
                                } 
                            </div>
                        ),
                    });
                    self.props.close()
                }).catch(e => {
                    Modal.info({
                        title: <div>{data ? "수정 오류" : "등록 오류" }</div>,
                        content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                    });
                });
            },
            onCancel() {},
        });
        
    }


    handleClear = () => {
        this.formRef.current.resetFields();
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
                                                <div className="submitBlock">
                                                    <Button type="primary" htmlType="submit">
                                                        {data ? "수정하기":"등록하기"}
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