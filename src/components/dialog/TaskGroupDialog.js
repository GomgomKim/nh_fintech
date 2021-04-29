import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../css/rider.css';
import { comma } from "../../lib/util/numberUtil";
import { formatDate } from "../../lib/util/dateUtil";

const FormItem = Form.Item;
const Option = Select.Option;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class TaskGroupDialog extends Component {
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
                groupName: '대여금 -33000원 배지현',
                groupType: '기사그룹(기사개별)',
                placeName: '플러스김포',
                riderName: '배지현',
            },
            {
                groupName: '대여금 -33000원 배지현',
                groupType: '기사그룹(기사개별)',
                placeName: '플러스김포',
                riderName: '배지현',
            },
            {
                groupName: '대여금 -33000원 배지현',
                groupType: '기사그룹(기사개별)',
                placeName: '플러스김포',
                riderName: '배지현',
            },
            {
                groupName: '대여금 -33000원 배지현',
                groupType: '기사그룹(기사개별)',
                placeName: '플러스김포',
                riderName: '배지현',
            },
            {
                groupName: '리스비 -33000원',
                groupType: '기사그룹(기사개별)',
                placeName: '플러스김포',
                riderName: '배지현',
            },
            {
                groupName: '리스비 -33000원',
                groupType: '기사그룹(기사개별)',
                placeName: '플러스김포',
                riderName: '배지현',
            },

        ];
        this.setState({
            list: list,
        });
    }

    render() {

        const columns = [
            {
                title: "그룹명",
                dataIndex: "groupName",
                className: "table-column-center",

            },
            {
                title: "그룹타입",
                dataIndex: "groupType",
                className: "table-column-center",
            },
            {
                title: "지사명",
                dataIndex: "placeName",
                className: "table-column-center",
            },
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
            },

        ];


        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="taskGroup-Dialog">

                                <div className="taskGroup-content">
                                    <div className="taskGroup-title">
                                        작업 스케줄러 그룹관리
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="taskGroup-close" />
                                    <div className="taskGroup-inner">

                                        <div className="taskGroup-btn">
                                            <div className="taskGroup-btn-01">
                                                <Button
                                                    className="tabBtn taskGroup-btn"
                                                    onClick={() => { }}
                                                >그룹등록</Button>
                                            </div>

                                        </div>
                                        <div className="taskGroup-list">
                                            <div className="taskGroup-list-01">작업스케줄러 그룹목록</div>
                                            <div className="taskGroup-list-02">리스비 -22500원 </div>
                                            <div className="taskGroup-list-03-place1">
                                                <FormItem
                                                    style={{ marginBottom: 0, display: 'inline-block', verticalAlign: 'middle' }}
                                                    name="taskGroup-place"
                                                >
                                                    <Select placeholder="소속지사를 선택해 주세요." className="rider-select">
                                                        <Option value={1}>플러스김포 / 플러스김포</Option>
                                                        <Option value={2}>플러스김포1 / 플러스김포</Option>
                                                        <Option value={3}>플러스김포2 / 플러스김포</Option>
                                                        <Option value={4}>플러스김포3 / 플러스김포</Option>
                                                        <Option value={5}>플러스김포4 / 플러스김포</Option>
                                                        <Option value={6}>플러스김포5 / 플러스김포</Option>
                                                    </Select>

                                                </FormItem>
                                            </div>
                                        </div>
                                        <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                            <div className="listBlock">
                                                <Table
                                                    // rowKey={(record) => record.idx}
                                                    dataSource={this.state.list}
                                                    columns={columns}
                                                    pagination={this.state.pagination}
                                                    onChange={this.handleTableChange}
                                                />
                                            </div>

                                        </Form>

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

export default (TaskGroupDialog);