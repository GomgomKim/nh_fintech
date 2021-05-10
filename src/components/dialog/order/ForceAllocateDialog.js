import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../../css/rider.css';
import moment from 'moment';
import { comma } from "../../../lib/util/numberUtil";
import { formatDate } from "../../../lib/util/dateUtil";

const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Option = Select.Option;
const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();


class ForceAllocateDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.getList()
    }
    getList = () => {
        var list = [
            {
                idx: 2,
                select: 1,
                riderName: '애플망고',
                orderNumber: '2건'
            },
            {
                idx: 1,
                select: 1,
                riderName: '애플망고',
                orderNumber: '2건'
            },

        ];
        this.setState({
            list: list,
        });
    }

    render() {

        const { isOpen, close } = this.props;

        const columns = [
            {
                title: "선택",
                dataIndex: "select",
                className: "table-column-center",
                width: "15%",
                render:
                    (data) => (
                        <div className="forceAllocate-select-btn">
                            <Checkbox />
                        </div>
                    ),
            },
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
                width: "45%",
            },
            {
                title: "현재배달건수",
                dataIndex: "orderNumber",
                className: "table-column-center",
                width: "40%",
            },

        ];


        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="forceAllocate-Dialog">

                                <div className="forceAllocate-content">
                                    <div className="forceAllocate-title">
                                        강제배차
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="coinTran-close" />

                                    <div className="forceAllocate-inner">

                                        <div className="forceAllocate-list">
                                            <Search
                                                placeholder="기사명 검색"
                                                enterButton
                                                allowClear
                                                style={{
                                                    width: 200,
                                                    textAlign: 'left',

                                                }}
                                            />
                                        </div>

                                        <div className="dataTableLayout-02">

                                            <Table
                                                dataSource={this.state.list}
                                                columns={columns}
                                                pagination={this.state.pagination}
                                                onChange={this.state.handleTableChange}
                                            />
                                        </div>

                                    </div>

                                    <div className="coinTran-btn-01">
                                        <Button
                                            className="tabBtn coinTran-btn"
                                            onClick={() => { }}
                                        >강제배차하기</Button>


                                    </div>


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

export default (ForceAllocateDialog);