import React, { Component } from "react";
import {
    Form, Modal, Input, DatePicker, Descriptions, Table,
    Upload, Button, Select, Icon, Radio, Carousel, Text, Checkbox
} from "antd";
import '../../../css/rider.css';
import SelectBox from '../../../components/input/SelectBox';
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


class SearchAddressDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: today,
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            addressType: 0,
        };
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.getList()
    }

    setDate = (date) => {
        console.log(date)
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
                idx: 5,
                KindOfAddress: '오피스텔',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },
            {
                idx: 4,
                KindOfAddress: '오피스텔',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },
            {
                idx: 3,
                KindOfAddress: '오피스텔',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },
            {
                idx: 2,
                KindOfAddress: '아파트',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },
            {
                idx: 1,
                KindOfAddress: '아파트',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },

        ];
        this.setState({
            list: list,
        });
    }
    render() {


        const onChange = (e) => {
            console.log(e.target.value)
            this.setState({
                addressType: e.target.value
            }, () => {
            })
        }

        const columns = [
            {
                title: "종류",
                dataIndex: "KindOfAddress",
                className: "table-column-center",
                width: "20%",
            },
            {
                title: "등록 주소 목록",
                dataIndex: "addressList",
                className: "table-column-center",
                width: "60%",
            },
            {
                title: "삭제",
                dataIndex: "delete",
                className: "table-column-center",
                width: "20%",
                render:
                    (data) => (
                        <div className="pwChange-btn">
                            <Button
                                className="tabBtn"
                                onClick={() => { }}
                            >삭제</Button>
                        </div>
                    ),
            },

        ];

        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="serchAddress-Dialog">
                                <div className="serchAddress-content">
                                    <div className="serchAddress-title">
                                        주소 검색 관리
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">
                                            <div className="serchAddressWrapper">
                                                <div className="contentBlock">
                                                    <Radio.Group className="searchRequirement" onChange={onChange} value={this.state.addressType}>
                                                        <Radio value={0}>아파트</Radio>
                                                        <Radio value={1}>오피스텔</Radio>
                                                    </Radio.Group>
                                                </div>

                                                <div className="serchAddress-list">
                                                    <div className="inputBox inputBox-serchAddress sub">
                                                        <FormItem name="price">
                                                            <Input placeholder="주소를 입력해주세요" />
                                                        </FormItem>
                                                    </div>
                                                    <div className="searchAddress-btn">
                                                        <Button type="primary" htmlType="submit">
                                                            등록하기
                                                        </Button>
                                                    </div>

                                                </div>

                                            </div>


                                            <div className="dataTableLayout-01">
                                                <Table
                                                    dataSource={this.state.list}
                                                    columns={columns}
                                                    pagination={this.state.pagination}
                                                    onChange={this.state.handleTableChange}
                                                />
                                            </div>

                                            <div className="serchAddress-searchbox">

                                                <Select
                                                    defaultValue={0}
                                                    style={{ width: 100 }}>
                                                    <Option value={0}>아파트</Option>
                                                    <Option value={1}>오피스텔</Option>
                                                </Select>

                                                <Search
                                                    placeholder="주소 검색"
                                                    enterButton
                                                    allowClear
                                                    style={{
                                                        width: 350,
                                                        marginLeft: 10,
                                                        verticalAlign: 'bottom'
                                                    }}
                                                />

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

export default (SearchAddressDialog);