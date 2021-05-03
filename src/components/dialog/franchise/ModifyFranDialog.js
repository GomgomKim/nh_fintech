import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../../css/modal.css';
import { comma } from "../../../lib/util/numberUtil";
// import { formatDate } from "../../../lib/util/dateUtil";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Search = Input.Search;

class ModifyFranDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        // this.getList()
    }

    render() {

        const { isOpen, close } = this.props;

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


                                    <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                        <div className="modifyFranLayout">
                                            <div className="modifyFranWrapper">
                                                <div className="modifyFranTitle">
                                                    기본정보
                                                </div>
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
                                                        가맹점명
                                                    </div>
                                                    <FormItem
                                                        name="franchiseName"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="가맹점명을 입력해 주세요." className="override-input">
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
                                                        <Input placeholder="사업자번호를 입력해 주세요." className="override-input">
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
                                                        <Input placeholder="대표자명을 입력해 주세요." className="override-input">
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
                                                        <Input placeholder="(필수입력) 세금계산서 발행용" className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
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
                                                        <Input placeholder="ex) 19960404" className="override-input sub">
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
                                                        <Input placeholder="메모를 입력해 주세요." className="override-input sub">
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
                                                        <Input placeholder="주소 입력" className="override-input sub">
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
                                                        <Input placeholder="주소 입력" className="override-input sub">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="m-t-10">
                                                    <div className="mainTitle">
                                                        기본료
                                                    </div>
                                                    <FormItem
                                                        style={{
                                                            marginBottom: 0,
                                                            display: 'inline-block',
                                                            verticalAlign: 'middle',
                                                            marginLeft: 20
                                                        }}
                                                        name="payType"
                                                        initialValue={0}
                                                    >
                                                        <Radio.Group>
                                                            <Radio style={{ fontSize: 18 }} value={0}>코인</Radio>
                                                            <Radio style={{ fontSize: 18 }} value={1}>코인(VAT)</Radio>
                                                        </Radio.Group>
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
                                                        <Input placeholder="배달요금 입력" className="override-input price">
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