import {
    Button, Form, Input, Modal
} from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { httpPostWithNoLoading, httpUrl } from '../../../api/httpClient';
import '../../../css/modal.css';
import '../../../css/modal_m.css';
const { TextArea } = Input;
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
            dataIdxs: [],
            selectedRowKeys: [],

            riderLevel: 0,
            searchName: "",
            isMulti: false,

            background: '#fff',

        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
    }

    // 전체메세지 전송
    handleSubmit = () => {
        let self = this;
        Modal.confirm({
            title: "전체메세지 전송",
            content: (
                <div>메세지를 전송하시겠습니까?</div>
            ),
            okText: "확인",
            cancelText: "취소",
            onOk() {
                self.props.close()
                httpPostWithNoLoading(httpUrl.riderMessageAll, [], {
                    ...self.formRef.current.getFieldsValue(),
                    branchIdx: self.props.branchIdx
                }).then((res) => {
                    if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                        Modal.info({
                            title: "완료",
                            content: (
                                <div>
                                    전체 라이더에게 메세지가 전송되었습니다.
                                </div>
                            ),
                        });
                    } else {
                        Modal.info({
                            title: " 오류",
                            content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                        });
                    }
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
                        <div className="sns-title">전체메세지 전송</div>
                        <img
                            onClick={close}
                            src={require("../../../img/login/close.png").default} alt=""
                            className="surcharge-close"
                        />
                        <div className="snsLayout">
                            <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                <div className="snsDetailBlock">
                                    {/* <div className="inputBox">
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
                                    </div> */}
                                    <div className="inputBox">
                                        <FormItem
                                            className="selectItem"
                                            name="message"
                                            rules={[{ required: true, message: "메세지를 입력해주세요" }]}
                                        >
                                            <TextArea
                                                className="snsInputBox"
                                                placeholder="전체 라이더에게 보낼 메세지 내용을 입력해주세요."
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

const mapStateToProps = (state) => ({
    branchIdx: state.login.loginInfo.branchIdx,
});

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SendSnsDialog);
