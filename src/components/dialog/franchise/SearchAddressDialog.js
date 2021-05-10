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


class SearchAddressDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: today,
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
        // this.getList()
        // console.log(this.props)
    }

    setDate = (date) => {
        console.log(date)
    }



    render() {
        const { isOpen, close } = this.props;


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
                width: "15%",
            },
            {
                title: "등록 주소 목록",
                dataIndex: "addressList",
                className: "table-column-center",
                width: "70%",
            },
            {
                title: "삭제",
                dataIndex: "delete",
                className: "table-column-center",
                width: "15%",
            },

        ];


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
                                                    dataSource={this.state.results}
                                                    columns={columns}
                                                    pagination={this.state.pagination}
                                                    onChange={this.state.Status}
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