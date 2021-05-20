import React, { Component } from "react";
import {
    Form, Input, Button, Select, Radio, Modal
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost } from '../../../api/httpClient';
import SelectBox from '../../../components/input/SelectBox';
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
        this.setState({
            staffAuth: e.target.value,
        });
    };

    handleSubmit = () => {
        let self = this;
        
        Modal.confirm({
            title: "기사 등록",
            content: (
                <div>
                    {self.formRef.current.getFieldsValue().name + '을 등록하시겠습니까?'}
                </div>
            ),
            okText: "확인",
            cancelText: "취소",
            onOk() {
                httpPost(httpUrl.registRider, [], {
                    ...self.formRef.current.getFieldsValue(),
                    ncash: 0,
                    userStatus: 1,
                    withdrawPassword: 0,
                    bank: "",
                    bankAccount: "",
                    depositor: "",
                    userType: 1,
                    userGroup: 1
                }).then((result) => {
                    Modal.info({
                        title: "등록 완료",
                        content: (
                            <div>
                                {self.formRef.current.getFieldsValue().id}이(가) 등록되었습니다.
                            </div>
                        ),
                    });
                    self.handleClear();
                    self.getList();
                }).catch((error) => {
                    Modal.info({
                        title: "등록 오류",
                        content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                    });
                });
            },
        });
    }

    handleClear = () => {
        this.formRef.current.resetFields();
    };

    handleChangeRiderLevel = (value) => {
        if (value === 1) {
            this.setState({ riderLevelSelected: true });
        } else {
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
                                        {data ? "기사 수정" : "기사 등록"}
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
                                                        rules={[{ required: true, message: "그룹을 선택해주세요" }]}
                                                    >
                                                        {/* <SelectBox
                                                            value={enabledString}
                                                            code={enabledCode}
                                                            codeString={enabledString}
                                                            onChange={(value) => {
                                                                if (parseInt(value) !== row.enabled) {
                                                                    this.onChangeStatus(row.idx, value);
                                                                }
                                                            }}
                                                        /> */}
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        직급
                                                    </div>
                                                    <FormItem
                                                        name="riderLevel"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "직급을 선택해주세요" }]}
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
                                                            rules={[{ required: true, message: "팀장을 선택해주세요" }]}
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
                                                        rules={[{ required: true, message: "직원명을 입력해주세요" }]}
                                                        initialValue={data ? data.riderName : ''}
                                                    >
                                                        <Input placeholder="직원명을 입력해주세요." className="override-input" />
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        아이디
                                                    </div>
                                                    <FormItem
                                                        name="id"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "아이디를 입력해주세요" }]}
                                                        initialValue={data ? data.id : ''}
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
                                                        initialValue={data ? data.email : ''}
                                                    >
                                                        <Input placeholder="ex) example@naver.com" className="override-input"/>
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
                                                        <Input.Password placeholder="패스워드를 입력해 주세요." className="override-input" />
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
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
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        수수료
                                                    </div>
                                                    <FormItem
                                                        name="deliveryPriceFeeAmount"
                                                        className="selectItem"
                                                        rules={[{ required: true, message: "수수료를 입력해주세요" }]}
                                                        initialValue={data ? data.deliveryPriceFeeAmount : ''}
                                                    >
                                                        <Input placeholder="수수료를 입력해 주세요." className="override-input" />
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
                                                        rules={[{ required: true, message: "최소보유잔액을 입력해주세요" }]}
                                                        initialValue={data ? data.minCashAmount : ''}
                                                    >
                                                        <Input placeholder="최소보유잔액을 입력해 주세요." className="override-input" />
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