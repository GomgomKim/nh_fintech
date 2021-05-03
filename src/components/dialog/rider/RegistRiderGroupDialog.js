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

class RegistRiderGroupDialog extends Component {
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

    onChange = e => {
        // console.log('radio checked', e.target.value);
        this.setState({
            staffAuth: e.target.value,
        });
    };

    handleTableChange = (pagination) => {
        console.log(pagination)
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize
        this.setState({
            pagination: pager,
        }, () => this.getList());
    };

    render() {
        const { isOpen, close } = this.props;


        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="addGroup-Dialog-overlay" onClick={close} />
                            <div className="addGroup-Dialog">
                                <div className="addGroup-content">
                                    <div className="addGroup-title">
                                        그룹 추가
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="addRider-close" />


                                    <Form ref={this.formRef} onFinish={this.handleIdSubmit}>
                                        <div className="addGrouplayout">
                                            <div className="addGroupWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        그룹명
                                                    </div>
                                                    <FormItem
                                                        name="groupName"
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

export default (RegistRiderGroupDialog);