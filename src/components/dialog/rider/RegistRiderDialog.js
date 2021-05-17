import React, { Component } from "react";
import {
    Form, Input, Button, Select, Radio
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost} from '../../../api/httpClient';
import Search from "antd/lib/transfer/search";
import { address } from "faker";
const Option = Select.Option;
const FormItem = Form.Item;

class RegistRiderDialog extends Component {
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
            riderLevelSelected: false,
            feeManner: 0,
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
        httpPost(httpUrl.registRider, [], {
            // riderName: this.formRef.current.getFieldsValue().riderName,
            // id: this.formRef.current.getFieldsValue().id,
            // email: this.formRef.current.getFieldsValue().email,
            // password: this.formRef.current.getFieldsValue().password,
            // phone: this.formRef.current.getFieldsValue().phone,
            // memo: this.formRef.current.getFieldsValue().memo,
            // riderStatus: this.formRef.current.getFieldsValue().riderStatus,
            // deliveryPriceFeeAmount: this.formRef.current.getFieldsValue().deliveryPriceFeeAmount,
            ...this.formRef.current.getFieldsValue(),
            ncash: 0,
            userStatus: 1,
            withdrawPassword: 0,
            bank: "",
            bankAccount: "",
            depositor: "",
            userType: 1,
            userGroup: 1,
            riderLevel: this.formRef.current.getFieldsValue().riderLevel,
        }).then((result) => {
            console.log("## result: " + JSON.stringify(result, null, 4));
            alert('직원 등록이 완료되었습니다.');
            this.props.close()
            // this.props.history.push('/staff/StaffMain')
        }).catch(e => {
            alert('에러가 발생하였습니다 다시 시도해주세요.')
        });
    }

    // a = () => {
    //     const self = this;
    //         Modal.confirm({
    //             title: "등록 실패",
    //             content: (
    //                 <div>
    //                     시스템에러로 직원수정 등록에 실패하였습니다. 잠시 후 다시 시도해주세요.
    //                 </div>
    //             ),
    //         onOk() {

    //             httpPost(httpUrl.registRider, [], {
    //                 riderLevel: this.formRef.current.getFieldsValue().riderLevel,
    //             }).then((result) => {
    //                 self.setState({complete: true});
    //             }).catch(e => {
    //                 alert('에러가 발생하였습니다 다시 시도해주세요.')
    //             });


    //          },
    // }

    handleClear = () => {
        console.log("clear")
        this.formRef.current.resetFields();
       /*  this.formRef.current.setFieldsValue({
            belongBranch: undefined,
            riderGroup: undefined,
            riderName: undefined,
            id: undefined,
            password: undefined,
            email: undefined,
            phone: undefined,
            memo: undefined,
            rank: undefined,
            auth: undefined,
            deliveryPriceFeeAmount: undefined,
        }); */
    };

    handleChangeRiderLevel = (value) => {
        // console.log(`selected ${value}`);
        if (value == 1){
            this.setState({ riderLevelSelected: true });
        } else{
            this.setState({ riderLevelSelected: false });
        }
    }

    onChangFeeManner = (e) => {
        console.log(`selected ${e.target.value}`);
        this.setState({ feeManner: e.target.value });
    }
    

    render() {
        const { isOpen, close, data } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="registRider-Dialog">
                                <div className="registRider-content">
                                    <div className="registRider-title">
                                        {data ?
                                            "기사 수정" :
                                            "기사 등록"
                                        }
                                        
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="registRider-close" />


                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">
                                            <div className="registRiderWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        기사그룹
                                                    </div>
                                                    <FormItem
                                                        name="riderGroup"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="그룹을 선택해주세요." className="override-select branch">
                                                            <Option value={1}>A</Option>
                                                            <Option value={2}>B</Option>
                                                            <Option value={3}>C</Option>
                                                            <Option value={4}>D</Option>
                                                            <Option value={5}>E</Option>
                                                        </Select>
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
                                                        <Select placeholder="직급을 선택해주세요." onChange={this.handleChangeRiderLevel} className="override-select branch" >
                                                            <Option value={1}>라이더</Option>
                                                            {/* <Option value={2}>부팀장</Option> */}
                                                            <Option value={3}>팀장</Option>
                                                            {/* <Option value={4}>부본부장</Option> */}
                                                            <Option value={5}>본부장</Option>
                                                            <Option value={6}>부지점장</Option>
                                                            <Option value={7}>지점장</Option>
                                                            <Option value={8}>부센터장</Option>
                                                            <Option value={9}>센터장</Option>
                                                        </Select>
                                                    </FormItem>
                                                </div>
                                                {this.state.riderLevelSelected &&
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            소속팀장
                                                        </div>
                                                        <FormItem
                                                            name="teamManager"
                                                            className="selectItem"
                                                        >
                                                            <Select placeholder="팀장을 선택해주세요." className="override-select branch" >
                                                                <Option value={1}>김동일</Option>
                                                                <Option value={2}>문승현</Option>
                                                                <Option value={3}>송용학</Option>
                                                                <Option value={4}>김시욱</Option>
                                                                <Option value={5}>홍원표</Option>
                                                            </Select>
                                                        </FormItem>
                                                    </div>
                                                }
                                                
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        기사명
                                                    </div>




                                                    <FormItem
                                                        name="riderName"
                                                        className="selectItem"
                                                        // initialValue={}
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
                                                        <Input placeholder="ex) example@naver.com" className="override-input">
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
                                                        <Input.Password placeholder="패스워드를 입력해 주세요." className="override-input"/>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        전화번호
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
                                                            <Input placeholder="메모를 입력해 주세요." className="override-input" defaultValue={"memo"}/> :
                                                            <Input placeholder="메모를 입력해 주세요." className="override-input"/>
                                                        }
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        수수료
                                                    </div>
                                                    <FormItem
                                                        name="deliveryPriceFeeAmount"
                                                        className="selectItem"
                                                    >
                                                        {data ?
                                                            <Input placeholder="수수료를 입력해 주세요." className="override-input" defaultValue={data.deliveryPriceFeeAmount}/> :
                                                            <Input placeholder="수수료를 입력해 주세요." className="override-input"/>
                                                        }
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle mainTitle-sub">
                                                        수수료방식
                                                    </div>
                                                    <div className="registRiderCheck">
                                                    <Radio.Group onChange={this.onChangFeeManner} value={this.state.feeManner}>
                                                        <Radio value={1}>정량</Radio>
                                                        <Radio value={2}>정률</Radio>
                                                    </Radio.Group>
                                                    </div>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        최소보유잔액
                                                    </div>
                                                    <FormItem
                                                        name="minCashAmount"
                                                        className="selectItem"
                                                    >
                                                        {data ?
                                                            <Input placeholder="최소보유잔액을 입력해 주세요." className="override-input" defaultValue={1000}/> :
                                                            <Input placeholder="최소보유잔액을 입력해 주세요." className="override-input"/>
                                                        }
                                                    </FormItem>
                                                </div>
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

export default (RegistRiderDialog);