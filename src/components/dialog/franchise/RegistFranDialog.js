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

class RegistFranDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getList()
    }

    handleTableChange = (pagination) => {
        console.log(pagination)
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize
        this.setState({
            pagination: pager,
        }, () => this.getList());
    };


    getList = () => {
        var list = [
            {
                useType: 1,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500',
            },
            {
                useType: 0,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },
            {
                useType: 1,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },
            {
                useType: 0,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },
            {
                useType: 0,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },
            {
                useType: 0,
                surchargeTitle: '추석연휴 운행할증',
                applyTerm: '매일',
                completionTime: '금일 11:00 부터 익일 07:59 까지',
                addFee: '500'
            },

        ];
        this.setState({
            list: list,
        });
    }

    render() {

        const columns = [
            {
                title: "사용여부",
                dataIndex: "useType",
                className: "table-column-center",
                render: (data) => <div>
                    <Button
                        className="tabBtn surchargeTab"
                        onClick={() => { }}
                    >{data == 0 ? "OFF"
                        : data == 1 ? "ON" : "-"}</Button>
                </div>
            },
            {
                title: "할증명",
                dataIndex: "surchargeTitle",
                className: "table-column-center",
                render: (data) => <div>{data == 0 ? "준비중" : "완료"}</div>
            },
            {
                title: "적용기간",
                dataIndex: "applyTerm",
                className: "table-column-center",
            },
            {
                title: "적용시간",
                dataIndex: "completionTime",
                className: "table-column-center",
                render: (data) => <div>{data}</div>
            },
            {
                title: "추가요금",
                dataIndex: "addFee",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            },
            {
                className: "table-column-center",
                render: () =>
                    <div>
                        <Button
                            className="tabBtn surchargeTab"
                            onClick={() => { }}
                        >삭제</Button>
                    </div>
            },
        ];

        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="registFran-Dialog">
                                <div className="registFran-container">
                                    <div className="registFran-title">
                                        가맹점 등록
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                        <div className="registFranLayout">
                                            <div className="registFranWrapper">
                                                <div className="registFranTitle">
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
                                            <div className="registFranWrapper sub">
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
                                                        차감일자
                                                    </div>
                                                    <FormItem
                                                        name="minusDate"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="차감일자 선택" className="override-select">
                                                            <Option value={0}>매일</Option>
                                                            <Option value={1}>매월 1일 ~ 매월 31일</Option>
                                                            <Option value={2}>매월 말일</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <div className="subTitle">
                                                        관리비
                                                    </div>
                                                    <FormItem
                                                        name="managePrice"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="관리비 입력" className="override-input sub">
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