import React, { Component } from "react";
import {
    Form,
    Modal,
    Input,
    Button,
} from "antd";
import { httpUrl, httpPost } from '../../../api/httpClient';
import '../../../css/modal.css';

const FormItem = Form.Item;

class SendSnsDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            dataIdxs:[],
            selectedRowKeys: [],

            riderLevel:0,
            searchName: "",
            isMulti:false,

            background: '#fff',
             
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
    }

    // 메세지 전송
    handleSubmit = () => {
        let self = this;
        console.log("handle submit")
        Modal.confirm({
            title: "메세지 전송",
            content: (
                <div>
                    {'메세지를 전송하시겠습니까?'}
                </div>
            ),
            okText: "확인",
            cancelText: "취소",
            onOk() {
                httpPost(httpUrl.registNotice, [], {
                    ...self.formRef.current.getFieldsValue(),
                    date: self.state.date,
                    title: self.state.title,
                    deleted: false,
                    category: self.state.category,
                    sortOrder: self.state.sortOrder,
                    important: self.state.important,
                    branchCode: self.state.branchCode,
                }).then((result) => {
                    Modal.info({
                        title: " 완료",
                        content: (
                            <div>
                                메세지가 전송되었습니다.
                            </div>
                        ),
                    });
                    self.handleClear();
                    self.getList();
                }).catch((error) => {
                    Modal.info({
                        title: " 오류",
                        content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                    });
                })
            }
        });
    }

    handleClear = () => {
        this.formRef.current.resetFields();
    };

    render() {

        const { close } = this.props;

        return (
        <React.Fragment>
            <div className="Dialog-overlay" onClick={close} />
            <div className="snsDialog">
                <div className="container">
                    <div className="sns-title">메세지 전송</div>
                    <img
                    onClick={close}
                    src={require("../../../img/login/close.png").default} alt=""  
                    className="surcharge-close" 
                    />
                    <div className="snsLayout">
                        <Form ref={this.formRef} onFinish={this.handleSubmit}>
                            <div className="snsDetailBlock">
                                <div className="inputBox">
                                    휴대번호
                                    <FormItem
                                    className="selectItem"
                                    name="phoneNumber"
                                    rules={[{ required: true, message: "수신번호를 입력해주세요" }]}
                                    >
                                        <Input
                                        className="numberInputBox"
                                        placeholder="수신번호"
                                        />
                                    </FormItem>
                                </div>
                                <div className="inputBox">
                                    <FormItem
                                    className="selectItem"
                                    name="content"
                                    rules={[{ required: true, message: "메세지를 입력해주세요" }]}
                                    >
                                        <Input
                                        className="snsInputBox"
                                        placeholder="메세지 내용"
                                        />
                                    </FormItem>
                                </div>
                                <div className="btnInsert">
                                    <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="tabBtn insertTab snsBtn"
                                    >
                                        전송
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </React.Fragment>
        );
    }
}

export default (SendSnsDialog);
