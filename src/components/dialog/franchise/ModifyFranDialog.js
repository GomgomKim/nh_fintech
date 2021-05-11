import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../../css/modal.css';
import { comma } from "../../../lib/util/numberUtil";
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../../api/httpClient';
// import { formatDate } from "../../../lib/util/dateUtil";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Search = Input.Search;

class ModifyFranDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            franchiseUpdate: [],
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        // this.getList()
    }


    handleSubmit = () => {
        httpPost(httpUrl.franchiseUpdate, [], {
            // belongBranch: this.formRef.current.getFieldsValue().belongBranch,
            franchiseName: this.formRef.current.getFieldsValue().franchiseName,
            businessNumber: this.formRef.current.getFieldsValue().businessNumber,
            ceoName: this.formRef.current.getFieldsValue().ceoName,
            franEmail: this.formRef.current.getFieldsValue().franEmail,
            phoneNumber: this.formRef.current.getFieldsValue().phoneNumber,
            birth: this.formRef.current.getFieldsValue().birth,
            franMemo: this.formRef.current.getFieldsValue().franMemo,
            franAddress: this.formRef.current.getFieldsValue().franAddress,
            franAddressSub: this.formRef.current.getFieldsValue().franAddressSub,
            payType: this.formRef.current.getFieldsValue().payType,
            callAmount: this.formRef.current.getFieldsValue().callAmount,
            changePwd: this.formRef.current.getFieldsValue().changePwd,
            minusDate: this.formRef.current.getFieldsValue().minusDate,
            managePrice: this.formRef.current.getFieldsValue().managePrice,
            addr1: "서울시 강남구 선릉로 717",
            addr2: "3층",
            addr3: "서울시 강남구 논현동 111-22",
            bank: "한국은행",
            bankAccount: "111-111-1111",
            basicDeliveryPrice: 3000,
            birthday: "1999-01-01",
            BusinessNumber: "111-22-33333",
            chargeDate: 99,
            corporateNumber: "123456-1111111",
            depositor: "냠냠박스",
            dues: 10000,
            duesAutoChargeEnabled: true,
            email: "string",
            frName: "강남식당",
            frPhone: "02-111-2222",
            frStatus: 1,
            id: "knowend33",
            idx: 0,
            latitude: 37.51878733378206,
            longitude: 127.04047646959147,
            memo: "string",
            ncash: 0,
            ncashPayEnabled: true,
            password: 1111,
            phone: "010-4456-6668",
            prepayAccount: "111-222-333333",
            prepayBank: "냠냠은행",
            prepayDepositor: "냠냠박스",
            profileImage: "string",
            recommenderIdx: 0,
            securityPassword: "string",
            tidNormal: "sejflskejfo",
            tidNormalRate: 50,
            tidPrepay: "kjepsoiefjlk",
            userGroup: 1,
            userStatus: 1,
            userType: 1,
            vaccountBank: "string",
            vaccountDepositor: "string",
            vaccountNumber: "string",
            withdrawLimit: 100000,
            withdrawPassword: 1111
        }).then((result) => {
            console.log("## result: " + JSON.stringify(result, null, 4));
            alert('가맹점 수정이 완료되었습니다.');
            this.props.close()
            // this.props.history.push('/staff/StaffMain')
        }).catch(e => {
            alert('에러가 발생하였습니다 다시 시도해주세요.')
        });
    }

    render() {

        const { isOpen, close, data } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="modifyFran-Dialog">
                                <div className="modifyFran-container">
                                    <div className="modifyFran-title">
                                        가맹점 수정
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">
                                            <div className="modifyFranLayout">
                                                <div className="modifyFranWrapper">
                                                    <div className="modifyFranTitle">
                                                        기본정보
                                                </div>
                                                    {/* <div className="contentBlock">
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
                                                </div> */}
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            가맹점명
                                                    </div>
                                                        <FormItem
                                                            name="franchiseName"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="가맹점명을 입력해 주세요." className="override-input" defaultValue={data.frName}>
                                                            </Input>
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
                                                            <Input placeholder="사업자번호를 입력해 주세요." className="override-input" defaultValue={data.businessNumber}>
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            대표자명
                                                    </div>
                                                        <FormItem
                                                            name="ceoName"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="대표자명을 입력해 주세요." className="override-input" defaultValue={'홍길동'}>
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                    <div className="contentBlock">
                                                        <div className="mainTitle red">
                                                            *이메일
                                                    </div>
                                                        <FormItem
                                                            name="franEmail"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="(필수입력) 세금계산서 발행용" className="override-input" >
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                    {/* <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        전화번호
                                                    </div>
                                                    <FormItem
                                                        name="callNumber"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="전화번호를 입력해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div> */}
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            휴대전화
                                                    </div>
                                                        <FormItem
                                                            name="phoneNumber"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="휴대전화 번호를 입력해 주세요." className="override-input" defaultValue={'010-1234-5678'}>
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                </div>
                                                <div className="modifyFranWrapper sub">
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            생년월일
                                                </div>
                                                        <FormItem
                                                            name="birth"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="ex) 19960404" className="override-input sub" defaultValue={'1994-09-23'}>
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            메모
                                                </div>
                                                        <FormItem
                                                            name="franMemo"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="메모를 입력해 주세요." className="override-input sub" defaultValue={'테스트'}>
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            주소
                                                    </div>
                                                        <FormItem
                                                            name="franAddress"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="주소 입력" className="override-input sub" defaultValue={data.addr1}>
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            상세주소
                                                    </div>
                                                        <FormItem
                                                            name="franAddressSub"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="주소 입력" className="override-input sub" defaultValue={data.addr2}>
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            배달요금
                                                    </div>
                                                        <FormItem
                                                            name="callAmount"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="배달요금 입력" className="override-input price" defaultValue={data.basicDeliveryPrice}>
                                                            </Input>
                                                        </FormItem>
                                                    * 기본배달요금
                                                </div>

                                                    <div className="contentBlock">
                                                        <div className="mainTitle">
                                                            비밀번호
                                                    </div>
                                                        <FormItem
                                                            name="changePwd"
                                                            className="selectItem"
                                                        >
                                                            <Input placeholder="비밀번호 입력" className="override-input sub">
                                                            </Input>
                                                        </FormItem>
                                                    </div>
                                                </div>


                                                <div className="modifyFranWrapper bot">
                                                    <Button type="primary" htmlType="submit" className="callTab">
                                                        수정하기
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

export default (ModifyFranDialog);