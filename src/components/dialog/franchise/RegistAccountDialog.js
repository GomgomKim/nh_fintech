import React, { Component } from "react";
import {
    Form, Input, Button, Select, Modal
} from "antd";
import '../../../css/modal.css';
import '../../../css/modal_m.css';
import { connect } from "react-redux";
import { httpUrl, httpPost } from '../../../api/httpClient';
import { customAlert, customError } from "../../../api/Modals";
import {
    bankCode,
    bikeType,
    items,
    riderGroupString,
    riderLevelText
  } from "../../../lib/util/codeUtil";
const Option = Select.Option;
const FormItem = Form.Item;

class RegistAccountDialog extends Component {
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
            selRiderList: [],
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {

    }

    // handleTableChange = (pagination) => {
    //     console.log(pagination)
    //     const pager = { ...this.state.pagination };
    //     pager.current = pagination.current;
    //     pager.pageSize = pagination.pageSize
    //     this.setState({
    //         pagination: pager,
    //     }, () => this.getList());
    // };

    // handleClear = () => {
    //     this.formRef.current.resetFields();
    // };

    // 출금계좌 등록,수정 처리





    handleSubmit = () => {
        let self = this;
        var bankAccount = self.formRef.current.getFieldValue("bankAccount").replace(/\-/gi, "");
        const data = this.props.data;
        Modal.confirm({
            title: "출금계좌 수정",
            content: (
                <div>
              {data ? "출금계좌을 수정하시겠습니까?" : "출금계좌을 등록하시겠습니까?"}
            </div>
          ),
          okText: "확인",
          cancelText: "취소",
          onOk() {
            console.log(bankAccount)
            httpPost(httpUrl.frAccount, [], {
                userIdx: data.idx,
                ...self.formRef.current.getFieldsValue(),
                bankAccount,
            })
              .then((res) => {
                if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                  customAlert("새로운 출금계좌가 등록되었습니다.");
                }
                self.props.close();
              })
              .catch((error) => {
                customError(
                  "등록 오류",
                  "오류가 발생하였습니다. 다시 시도해 주십시오."
                );
              });
          },
        });
      };

    render() {
        const { isOpen, close, data } = this.props;


        return (
            <React.Fragment>
                            <div className="registAccount-Dialog-overlay" onClick={close} />
                            <div className="registAccount-Dialog">
                                <div className="registAccount-content">
                                    <div className="registAccount-title">
                                    출금계좌 관리
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default}
                                        className="registAccount-close" alt='close' />

                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="registAccountlayout">
                                            <div className="registAccountWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        은행
                                                    </div>
                                                    <FormItem
                                                        name="bank"
                                                        className="selectItem"
                                                        rules={[
                                                        { required: true, message: "은행을 선택해주세요" },
                                                        ]}
                                                        initialValue={data ? data.bank : "기업은행"}
                                                    >
                                                        <Select className="override-select">
                                                        {Object.keys(bankCode).map((key) => {
                                                            return (
                                                            <Option value={key + "," + bankCode[key]}>
                                                                {key}
                                                            </Option>
                                                            );
                                                        })}
                                                        </Select>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        계좌번호
                                                    </div>
                                                    <FormItem
                                                        name="bankAccount"
                                                        className="selectItem"
                                                        initialValue={data ? data.bankAccount : null == ""}
                                                    >
                                                        <Input placeholder="계좌번호를 입력해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        예금주
                                                    </div>
                                                    <FormItem
                                                        name="depositor"
                                                        className="selectItem"
                                                        initialValue={data ? data.depositor : null == ""}
                                                    >
                                                        <Input placeholder="예금주를 입력해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>

                                                <div className="submitBlock">
                                                    <Button type="primary" htmlType="submit">
                                                        등록하기
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        branchIdx: state.login.loginInfo.branchIdx,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistAccountDialog);