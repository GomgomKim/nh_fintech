import React, { Component, } from "react";
import {
    Form, Input, DatePicker,
    Button, Checkbox, Modal, Radio,
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost, serverUrl, httpGet } from '../../../api/httpClient';
import moment from 'moment';
import PostCodeDialog from '../common/PostCodeDialog';
import { 
    pgUseRate,
    feeManner
} from '../../../lib/util/codeUtil';
import {
    registComplete,
    registError,
    updateComplete,
    updateError,
    customError,
} from '../../../api/Modals'

const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();

class RegistFranDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogData: [],
            isPostCodeOpen: false,
            roadAddr: "",
            localAddr: "",
            PgRate: 0,
            feeManner: 1,
            // 좌표
            targetLat: 0,
            targetLng: 0,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
    }


    handleSubmit = () => {
        if(this.props.data){
            httpPost(httpUrl.franchiseUpdate, [], {
                ...this.formRef.current.getFieldsValue(),
                idx: this.props.data.idx,
                userGroup: 0,
            }).then((result) => {
                console.log("## result: " + JSON.stringify(result, null, 4));
                if (result.result === "SUCCESS") {
                    updateComplete()
                } else{
                    updateError()
                }
                this.props.close()
            }).catch(e => {
                updateError()
            });
        }
        else{
            httpPost(httpUrl.registFranchise, [], {
                ...this.formRef.current.getFieldsValue(),
                ncash: 0,
                userStatus: 1,
                recommenderIdx: 0,
                userType: 2,
                withdrawPassword: "0000",
                bank: "",
                bankAccount: 0,
                depositor: "",
                userGroup: 0,
                latitude: this.state.targetLat,
                longitude: this.state.targetLng,
                frStatus: 1,
                ncashPayEnabled: false,
                tidNormal: "",
                tidPrepay: "",
                tidNormalRate: this.state.PgRate, // 100 or 0
                chargeDate: 1,
                duesAutoChargeEnabled: false,
                dues: 0,
            }).then((result) => {
                console.log("## result: " + JSON.stringify(result, null, 4));
                if (result.result === "SUCCESS") {
                    registComplete()
                } else{
                    registError()
                }
                this.props.close()
            }).catch(e => {
                registError()
            });
        }
    }

    // 우편번호 검색
    openPostCode = () => {
        this.setState({ isPostCodeOpen: true,})
    }

    closePostCode = () => {
        this.setState({ isPostCodeOpen: false,})
    }

    // 우편번호 - 주소 저장
    getAddr = (addrData) => {
        console.log(addrData)
        // console.log(addrData.address)
        this.formRef.current.setFieldsValue({
            addr1: addrData.roadAddress, // 도로명 주소
            addr3: addrData.jibunAddress === "" ? addrData.autoJibunAddress : addrData.jibunAddress // 지번
        })

        // 좌표변환
        httpGet(httpUrl.getGeocode, [addrData.roadAddress], {}).then((res) => {
            let result = JSON.parse(res.data.json);
            // console.log(result)
            // console.log(result.addresses.length)
            if(res.result === "SUCCESS" && result.addresses.length > 0){
                const lat = result.addresses[0].y;
                const lng = result.addresses[0].x;
                // console.log(lat)
                // console.log(lng)

                this.setState({
                    targetLat: lat,
                    targetLng: lng
                }) 

                // 예상 배송 요금
                httpGet(httpUrl.expectDeliveryPrice, [lat, lng], {}).then((res) => {
                    // console.log("expectDeliveryPrice data :"+res.data)
                    // console.log("expectDeliveryPrice data :"+res.data.distance)
                    // console.log("expectDeliveryPrice data :"+res.data.deliveryPriceBasic)
                    // console.log("expectDeliveryPrice data :"+res.data.deliveryPriceExtra)
                    if(res.result === "SUCCESS" && res.data != null){
                        this.formRef.current.setFieldsValue({
                            distance: res.data.distance,
                            basicDeliveryPrice: res.data.deliveryPriceBasic,
                            deliveryPriceExtra: res.data.deliveryPriceExtra,
                        })

                    } else customError("배송 요금 오류", "예상 배송요금을 불러오는 데 실패했습니다. 관리자에게 문의하세요.") 
                });
            } else{
                customError("위치 반환 오류", "위치 데이터가 존재하지 않습니다. 관리자에게 문의하세요.")
            }
          
        });
    }
    
    onChangePgRate = (e) => {
        console.log(e.target.value);
        this.setState({ PgRate: e.target.value }, 
            () => { });
    }

    onChangFeeManner = (e) => {
        console.log(e.target.value);
        this.setState({ feeManner: e.target.value }, 
            () => { });
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
                                                        initialValue={data && data.frName}
                                                    >
                                                        <Input placeholder="가맹점명을 입력해 주세요." className="override-input"/>
                                                      
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        사업자번호
                                                    </div>
                                                    <FormItem
                                                        name="corporateNumber"
                                                        className="selectItem"
                                                        initialValue={data && data.corporateNumber}
                                                    >
                                                        <Input placeholder="사업자번호를 입력해 주세요." className="override-input"/>
                                                        
                                                    </FormItem>
                                                </div>

                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        대표자명
                                                    </div>
                                                    <FormItem
                                                        name="ownerName"
                                                        className="selectItem"
                                                        // initialValue={data && data.ownerName}
                                                        initialValue={data && "대표자명"}                                                
                                                    >
                                                        <Input placeholder="대표자명을 입력해 주세요." className="override-input"/>
                                                    </FormItem>
                                                </div>

                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        가맹점전화
                                                    </div>
                                                    <FormItem
                                                        name="frPhone"
                                                        className="selectItem"
                                                        initialValue={data && data.frPhone}
                                                    >
                                                        <Input placeholder="가맹점 전화번호를 입력해 주세요." className="override-input"/>
                                                        
                                                    </FormItem>
                                                </div>
                                               
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        휴대전화
                                                    </div>
                                                    <FormItem
                                                        name="phone"
                                                        className="selectItem"
                                                        // initialValue={data && data.frPhone}
                                                        initialValue={data && "010-1234-5678"}
                                                    >
                                                        <Input placeholder="휴대전화 번호를 입력해 주세요." className="override-input"/>
                                                    </FormItem>
                                                </div>
                                             
                                               {/*  <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        그룹
                                                    </div>
                                                    <FormItem
                                                        name="userGroup"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "그룹을 선택해주세요" }]}
                                                        initialValue={0}
                                                    >
                                                        <SelectBox
                                                            className="override-select"
                                                            style={{ width: "300px" }}
                                                            placeholder="그룹을 선택해주세요"
                                                            value={userGroupString}
                                                            code={Object.keys(userGroupString)}
                                                            codeString={userGroupString}
                                                        />
                                                    </FormItem>
                                                </div> */}
                                                                                                                                                                                
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        주소
                                                    </div>
                                                    <FormItem
                                                        name="addr1"
                                                        className="selectItem"
                                                        initialValue={data && data.addr1}
                                                    >
                                                        <Input placeholder="주소를 입력해 주세요." disabled className="override-input addrText" />
                                                    </FormItem>
                                                    <PostCodeDialog data={(addrData) => this.getAddr(addrData)} isOpen={this.state.isPostCodeOpen} close={this.closePostCode}/>
                                                    <Button onClick={this.openPostCode} className="override-input addrBtn">
                                                        우편번호 검색
                                                    </Button>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        지번주소
                                                    </div>
                                                    <FormItem
                                                        name="addr3"
                                                        className="selectItem"
                                                        // initialValue={data && data.addr3}
                                                        initialValue={data && 'test'}
                                                    >
                                                        <Input placeholder="상세주소를 입력해 주세요." disabled className="override-input sub"/>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        상세주소
                                                    </div>
                                                    <FormItem
                                                        name="addr2"
                                                        className="selectItem"
                                                        initialValue={data && data.addr2}
                                                    >
                                                        <Input placeholder="상세주소를 입력해 주세요." className="override-input sub"/>
                                                    </FormItem>
                                                </div>
                                                 <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        가입일자
                                                    </div>
                                                    <FormItem
                                                        name="frJoinDate"
                                                        className="selectItem"                                                        
                                                    >
                                                       <DatePicker
                                                            style={{ marginLeft: 20 , width: 300}}
                                                            defaultValue={moment(today, dateFormat)}
                                                            format={dateFormat}
                                                        // onChange={date => this.setState({ selectedDate: date })}
                                                        />
                                                    </FormItem>
                                                </div>
                                            </div>


                                            <div className="registFranWrapper sub">                                               


                                            <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        아이디
                                                    </div>
                                                    <FormItem
                                                        name="id"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "아이디를 입력해주세요" }]}
                                                        initialValue={data && data.id}
                                                    >
                                                        <Input placeholder="아이디를 입력해 주세요." className="override-input" />
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        이메일
                                                    </div>
                                                    <FormItem
                                                        name="email"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "이메일을 입력해주세요" }]}
                                                        initialValue={data && data.email}
                                                    >
                                                        <Input placeholder="ex) example@naver.com" className="override-input"/>
                                                    </FormItem>
                                                </div>



                                               <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        PG 사용여부
                                                    </div>
                                                    <div className="registRiderCheck">
                                                    <FormItem
                                                     name="tidNormalRate"
                                                     initialValue={0}>
                                                        <Radio.Group className="searchRequirement" onChange={this.onChangePgRate} value={this.state.PgRate}>
                                                            {Object.entries(pgUseRate).map(([key, value]) => {
                                                                return (
                                                                    <Radio value={parseInt(key)}>{value === "100%" ? "사용" : "미사용"}</Radio>
                                                                );
                                                            })}
                                                        </Radio.Group>
                                                    </FormItem>
                                                    </div>
                                                </div>    
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        배달거리
                                                    </div>
                                                    <FormItem
                                                        name="distance"
                                                        className="selectItem"
                                                        // initialValue={data && data.basicDeliveryPrice}
                                                        initialValue={data && 10000}
                                                    >

                                                        <Input placeholder="배달거리를 입력해 주세요." className="override-input"/>
                                                    </FormItem>
                                                </div>                                         
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        배달요금
                                                    </div>
                                                    <FormItem
                                                        name="basicDeliveryPrice"
                                                        className="selectItem"                                                       
                                                        initialValue={data && 10000}
                                                    >

                                                        <Input placeholder="배달요금을 입력해 주세요."  disabled className="override-input price"/>
                                                    </FormItem>
                                                    * 기본배달요금
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        할증요금
                                                    </div>
                                                    <FormItem
                                                        name="deliveryPriceExtra"
                                                        className="selectItem"
                                                        // initialValue={data && data.basicDeliveryPrice}
                                                        initialValue={data && 10000}
                                                    >

                                                        <Input placeholder="할증요금을 입력해 주세요." className="override-input"/>
                                                    </FormItem>
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
                                               
                                                {/* <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        전화번호
                                                    </div>
                                                    <FormItem
                                                        name="phone"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "전화번호를 입력해주세요" }]}
                                                        initialValue={data ? data.phone : ''}
                                                    >
                                                        <Input placeholder="휴대전화 번호를 입력해 주세요." className="override-input" />
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        메모
                                                    </div>
                                                    <FormItem
                                                        name="memo"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "메모를 입력해주세요" }]}
                                                        initialValue={data ? data.memo : ''}
                                                    >
                                                        <Input placeholder="메모를 입력해 주세요." className="override-input" />
                                                    </FormItem>
                                                </div> */}
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        수수료
                                                    </div>
                                                    <FormItem
                                                        name="deliveryPriceFeeAmount"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "수수료를 입력해주세요" }]}
                                                        // initialValue={data && data.deliveryPriceFeeAmount}
                                                        initialValue={data && 1000}
                                                    >
                                                        <Input placeholder="수수료를 입력해 주세요." className="override-input" />
                                                    </FormItem>
                                                </div>
                                                {/* <div className="contentBlock">
                                                    <div className="mainTitle mainTitle-sub">
                                                        수수료방식
                                                    </div>
                                                    <div className="registRiderCheck">
                                                        <Radio.Group className="searchRequirement" onChange={this.onChangFeeManner} value={this.state.feeManner}>
                                                            {Object.entries(feeManner).map(([key, value]) => {
                                                                return (
                                                                    <Radio value={parseInt(key)}>{value}</Radio>
                                                                );
                                                            })}
                                                        </Radio.Group>
                                                    </div>
                                                </div> */}
                                               
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
                                                        {/* <div className="mainTitle">
                                                            사용여부
                                                        </div>
                                                        <Checkbox style={{ verticalAlign: 'middle' }}></Checkbox> */}

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

                                                        <div className="subTitle" style={{marginLeft: 20}}>
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