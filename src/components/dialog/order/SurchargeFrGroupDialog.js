import React, { Component } from "react";
import {
    Form, Input, Button, Modal
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost } from '../../../api/httpClient';
const FormItem = Form.Item;

class SurchargeFrGroupDialog extends Component {
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
    
    handleTableChange = (pagination) => {
        console.log(pagination)
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize
        this.setState({
            pagination: pager,
        }, () => this.getList());
    };

    handleClear = () => {
        this.formRef.current.resetFields();
    };

    // 그룹추가
    handleSubmit = () => {
        const form = this.formRef.current;
        httpPost(httpUrl.priceExtraRegistGroup, [], {
            branchIdx: 1,
            settingGroupName: form.getFieldValue("settingGroupName")
        })
        .then((res) => {
            console.log(res)
            if (res.result === "SUCCESS") {
                Modal.info({
                    title: "새로운 그룹 추가",
                    content: (
                        <div>
                            그룹 추가가 완료 되었습니다.
                        </div>
                    ),
                });
                this.handleClear()
                this.props.close()
            }
            else {
                Modal.info({
                    title: "에러",
                    content: (
                        <div>
                            에러가 발생하여 삭제할수 없습니다.
                        </div>
                    ),
                });
            }
        })
    }

    render() {
        const { isOpen, close } = this.props;


        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="surchargeGroup-Dialog-overlay" onClick={close} />
                            <div className="surchargeGroup-Dialog">
                                <div className="surchargeGroup-content">
                                    <div className="surchargeGroup-title">
                                        그룹 추가
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="addRider-close" />


                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="surchargeGrouplayout">
                                            <div className="surchargeGroupWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        그룹명
                                                    </div>
                                                    <FormItem
                                                        name="settingGroupName"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="그룹명을 입력해 주세요." className="override-input">
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
                        :
                        null
                }
            </React.Fragment>
        )
    }
}

export default (SurchargeFrGroupDialog);