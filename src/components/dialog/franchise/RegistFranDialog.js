import React, { Component } from "react";
import {
    Form, Input, DatePicker,
    Button, Checkbox, Modal
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost } from '../../../api/httpClient';
import moment from 'moment';

const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();

class RegistFranDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogData: [],
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
    }


    handleSubmit = () => {
        if(this.props.data){
            httpPost(httpUrl.registFranchise, [], {
                ...this.formRef.current.getFieldsValue(),
                
                // 초기 기본 값 지정
                addr3: "서울시 강남구 논현동 111-22",
                bank: "한국은행",
                bankAccount: "111-111-1111",
                chargeDate: 99,
                depositor: "냠냠박스",
                dues: 10000,
                duesAutoChargeEnabled: true,
                email: "string",
                frStatus: 1,
                id: "knowend",
                latitude: 37.51878733378206,
                longitude: 127.04047646959147,
                ncash: 0,
                idx: 1,
                ncashPayEnabled: true,
                phone: "010-0000-0000",
                prepayAccount: "111-222-333333",
                prepayBank: "냠냠은행",
                prepayDepositor: "냠냠박스",
                profileImage: "string",
                recommenderIdx: 0,
                tidNormal: "sejflskejfo",
                tidNormalRate: 50,
                tidPrepay: "kjepsoiefjlk",
                userGroup: 1,
                userStatus: 1,
                userType: 1,
                vaccountBank: "string",
                vaccountDepositor: "string",
                vaccountNumber: "string",
                withdrawEnabled: true,
                withdrawLimit: 100000,
                withdrawPassword: 1111


            }).then((result) => {
                console.log("## result: " + JSON.stringify(result, null, 4));
                if (result.result === "SUCCESS") {
                    Modal.info({
                        title: "등록 완료",
                        content: (
                            <div>
                                가맹점 등록이 완료되었습니다.
                            </div>
                        ),
                        onOk() { },
                    });
                } else{
                    Modal.error({
                        title: "등록 실패",
                        content: (
                            <div>
                                등록에 실패했습니다. 관리자에게 문의하세요.
                            </div>
                        ),
                        onOk() { },
                    });
                }
                this.props.close()
            }).catch(e => {
                Modal.error({
                    title: "등록 실패",
                    content: (
                        <div>
                            등록에 실패했습니다. 관리자에게 문의하세요.
                        </div>
                    ),
                    onOk() { },
                });
            });
        }
        else{
            httpPost(httpUrl.registFranchise, [], {
                ...this.formRef.current.getFieldsValue(),
            }).then((result) => {
                console.log("## result: " + JSON.stringify(result, null, 4));
                Modal.info({
                    title: "수정 완료",
                    content: (
                        <div>
                            가맹점 수정이 완료되었습니다.
                        </div>
                    ),
                    onOk() { },
                });
                this.props.close()
            }).catch(e => {
                Modal.error({
                    title: "수정 실패",
                    content: (
                        <div>
                            수정에 실패했습니다. 관리자에게 문의하세요.
                        </div>
                    ),
                    onOk() { },
                });
            });
        }
    }

    render() {

        const { isOpen, close, data } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="registFran-Dialog">
                                <div className="registFran-container">
                                    <div className="registFran-title">
                                    {data ?
                                        "가맹점 수정" :
                                        "가맹점 등록"
                                    }   
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" alt="exit" />

                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="registFranLayout">
                                            <div className="registFranWrapper">
                                                <div className="registFranTitle">
                                                    기본정보
                                                </div>
                                          
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        가맹점명
                                                    </div>
                                                    <FormItem
                                                        name="frName"
                                                        className="selectItem"
                                                     
                                                    >
                                                        {data ?
                                                            <Input placeholder="가맹점명을 입력해 주세요." className="override-input"  defaultValue={data.frName}/> :
                                                            <Input placeholder="가맹점명을 입력해 주세요." className="override-input"/>
                                                        }
                                                      
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        사업자번호
                                                    </div>
                                                    <FormItem
                                                        name="businessNumber"
                                                        className="selectItem"
                                                        
                                                    >
                                                          {data ?
                                                            <Input placeholder="사업자번호를 입력해 주세요." className="override-input" defaultValue={data.businessNumber}/> :
                                                            <Input placeholder="사업자번호를 입력해 주세요." className="override-input"/>
                                                        }
                                                        
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        대표자명
                                                    </div>
                                                    <FormItem
                                                        name="ownerName"
                                                        className="selectItem"                                                        
                                                    >
                                                          {data ?
                                                            <Input placeholder="대표자명을 입력해 주세요." className="override-input" defaultValue={data.ownerName}/> :
                                                            <Input placeholder="대표자명을 입력해 주세요." className="override-input"/>
                                                        }
                                                        
                                                     
                                                    </FormItem>
                                                </div>
                                               
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        휴대전화
                                                    </div>
                                                    <FormItem
                                                        name="frPhone"
                                                        className="selectItem"
                                                    >
                                                           {data ?
                                                            <Input placeholder="휴대전화 번호를 입력해 주세요." className="override-input" defaultValue={data.frPhone}/> :
                                                            <Input placeholder="휴대전화 번호를 입력해 주세요." className="override-input"/>
                                                        }
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        PG 사용비율
                                                    </div>
                                                    <FormItem
                                                        name="businessCardName"
                                                        className="selectItem"
                                                    >
                                                         {data ?
                                                            <Input placeholder="PG 사용비율을 입력해 주세요." className="override-input" defaultValue={data.businessCardName}/> :
                                                            <Input placeholder="PG 사용비율을 입력해 주세요." className="override-input"/>
                                                        }
                                                       
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="registFranWrapper sub">                                               
                                             
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        주소
                                                    </div>
                                                    <FormItem
                                                        name="addr1"
                                                        className="selectItem"
                                                    >
                                                         {data ?
                                                        <Input placeholder="주소를 입력해 주세요." className="override-input sub" defaultValue={data.addr1}/> :
                                                        <Input placeholder="주소를 입력해 주세요." className="override-input sub"/>
                                                    }
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        상세주소
                                                    </div>
                                                    <FormItem
                                                        name="addr2"
                                                        className="selectItem"
                                                    >
                                                      {data ?
                                                        <Input placeholder="상세주소를 입력해 주세요." className="override-input sub" defaultValue={data.addr2}/> :
                                                        <Input placeholder="상세주소를 입력해 주세요." className="override-input sub"/>
                                                    }
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        배달요금
                                                    </div>
                                                    <FormItem
                                                        name="basicDeliveryPrice"
                                                        className="selectItem"
                                                    >

                                                         {data ?
                                                        <Input placeholder="배달요금을 입력해 주세요." className="override-input price" defaultValue={data.basicDeliveryPrice}/> :
                                                        <Input placeholder="배달요금을 입력해 주세요." className="override-input price"/>
                                                    }
                                                    </FormItem>
                                                    * 기본배달요금
                                                </div>

                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        비밀번호
                                                    </div>
                                                    <FormItem
                                                        name="password"
                                                        className="selectItem"
                                                    >
                                                         {data ?
                                                        <Input.Password  placeholder="비밀번호를 입력해 주세요." className="override-input sub"/> :
                                                        <Input.Password  placeholder="비밀번호를 입력해 주세요." className="override-input sub"/>
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
                                                            <Input placeholder="메모를 입력해 주세요." className="override-input sub" defaultValue={data.memo}/> :
                                                            <Input placeholder="메모를 입력해 주세요." className="override-input sub"/>
                                                        }

                                                    </FormItem>
                                                </div>
                                            </div>


                                            <div className="registFranWrapper bot">
                                                <div className="registFranTitle">
                                                    월관리비 설정
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        사용여부
                                                    </div>
                                                    <Checkbox style={{ verticalAlign: 'middle' }}></Checkbox>
                                                    <div className="subTitle">
                                                        월회비 최초납부일
                                                    </div>
                                                    <FormItem
                                                        name="payDate"
                                                        className="selectItem"
                                                    >
                                                        <DatePicker
                                                            style={{ marginLeft: 10 }}
                                                            defaultValue={moment(today, dateFormat)}
                                                            format={dateFormat}
                                                        // onChange={date => this.setState({ selectedDate: date })}
                                                        />
                                                    </FormItem>
                                                    <div className="subTitle">
                                                        관리비
                                                    </div>
                                                    <FormItem
                                                        name="managePrice"
                                                        className="selectItem"
                                                    >
                                                        <Input defaultValue={'100,000'} placeholder="관리비 입력" className="override-input sub">
                                                        </Input>
                                                    </FormItem>

                                                    <Button type="primary" htmlType="submit" className="callTab">
                                                        등록하기
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

export default (RegistFranDialog);