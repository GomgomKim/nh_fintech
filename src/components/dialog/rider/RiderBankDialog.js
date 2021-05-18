import React, { Component } from "react";
import {
    Form, DatePicker, Table, Button
} from "antd";
import '../../../css/modal.css';
import moment from 'moment';
import { comma } from "../../../lib/util/numberUtil";
const dateFormat = 'YYYY/MM/DD';
const today = new Date();


class RiderBankDialog extends Component {
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
        };
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.getList()
        // console.log(this.props)
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
                bankDate: '2021-02-28 오후 3:31:59',
                processer: '[system]',
                riderName: '배지현팀장',
                branchName: '플러스김포',
                processPrice: '3600',
                leftPrice: '2120000'

            },
            {
                bankDate: '2021-02-28 오후 3:31:59',
                processer: '[system]',
                riderName: '배지현팀장',
                branchName: '플러스김포',
                processPrice: '3600',
                leftPrice: '2120000'

            },
            {
                bankDate: '2021-02-28 오후 3:31:59',
                processer: '[system]',
                riderName: '배지현팀장',
                branchName: '플러스김포',
                processPrice: '3600',
                leftPrice: '2120000'

            },
            {
                bankDate: '2021-02-28 오후 3:31:59',
                processer: '[system]',
                riderName: '배지현팀장',
                branchName: '플러스김포',
                processPrice: '3600',
                leftPrice: '2120000'

            },
            {
                bankDate: '2021-02-28 오후 3:31:59',
                processer: '[system]',
                riderName: '배지현팀장',
                branchName: '플러스김포',
                processPrice: '3600',
                leftPrice: '2120000'

            },
            {
                bankDate: '2021-02-28 오후 3:31:59',
                processer: '[system]',
                riderName: '배지현팀장',
                branchName: '플러스김포',
                processPrice: '3600',
                leftPrice: '2120000'

            },

        ];
        this.setState({
            list: list,
        });
    };



    render() {
        const columns = [

            {
                title: "날짜",
                dataIndex: "bankDate",
                className: "table-column-center",
            },
            {
                title: "처리자",
                dataIndex: "processer",
                className: "table-column-center",
            },
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
            },
            {
                title: "소속지사",
                dataIndex: "branchName",
                className: "table-column-center",

            },
            {
                title: "처리금액",
                dataIndex: "processPrice",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            },
            {
                title: "잔액",
                dataIndex: "leftPrice",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            },



        ];



        const { isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="riderBank-Dialog">

                                <div className="riderBank-content">
                                    <div className="riderBank-title">
                                        기사 입출금내역
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="coinRider-close" />

                                    <div className="rdierBank-inner">

                                        <div className="riderBank-list">
                                            <div className="riderBank-list-01">

                                                <DatePicker
                                                    defaultValue={moment(today, dateFormat)}
                                                    format={dateFormat}
                                                    onChange={date => this.setState({ selectedDate: date })}
                                                    className="riderBank-datepicker"
                                                /><td>~</td>
                                                <DatePicker
                                                    defaultValue={moment(today, dateFormat)}
                                                    format={dateFormat}
                                                    onChange={date => this.setState({ selectedDate: date })}
                                                    className="riderBank-datepicker"
                                                />

                                                <Button
                                                    className="tabBtn riderBank-btn"
                                                    onClick={() => { }}
                                                >조회</Button>



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
                            </div>
                        </React.Fragment>
                        :
                        null
                }
            </React.Fragment>
        )
    }
}

export default (RiderBankDialog);