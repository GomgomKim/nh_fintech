import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../../css/modal.css';
import { comma } from "../../../lib/util/numberUtil";
// import { formatDate } from "../../lib/util/dateUtil";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Search = Input.Search;

class BlackRiderDialog extends Component {
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
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
    }

    onChange = e => {
        // console.log('radio checked', e.target.value);
        this.setState({
            staffAuth: e.target.value,
        });
    };

    handleClear = () => {
        this.formRef.current.setFieldsValue({
            belongBranch: undefined,
            staffName: undefined,
            password: undefined,
            phoneNumber: undefined,
            memo: undefined,
            rank: undefined,
            auth: undefined,
        });
    };

    render() {
        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="blackRider-Dialog">
                                <div className="blackRider-content">
                                    <div className="blackRider-title">
                                        기사 차단
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="blackRider-close" />


                                    <Form ref={this.formRef} onFinish={this.handleIdSubmit}>
                                        <div className="layout">
                                            <div className="blackRiderWrapper">
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
                                                        기사그룹
                                                    </div>
                                                    <FormItem
                                                        name="riderGroup"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="그룹을 선택해주세요." className="override-select branch">
                                                            <Option value={0}>A</Option>
                                                            <Option value={1}>B</Option>
                                                            <Option value={2}>C</Option>
                                                        </Select>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        기사명
                                                    </div>
                                                    <FormItem
                                                        name="staffName"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="직원명을 입력해 주세요." className="override-input">
                                                        </Input>
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
                                                        <Input placeholder="메모를 입력해 주세요." className="override-input branch">
                                                        </Input>
                                                    </FormItem>
                                                </div>


                                                <div className="submitBlock">
                                                    <Button type="primary" htmlType="submit">
                                                        등록하기
                                                    </Button>

                                                    <Button className="clearBtn" onClick={this.handleClear}>
                                                        초기화
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

export default (BlackRiderDialog);