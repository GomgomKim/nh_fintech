import { Button, Form, Input, Radio, Table } from "antd";
import React, { Component } from "react";
import '../../../css/modal.css';
import { comma } from "../../../lib/util/numberUtil";

const FormItem = Form.Item;

class RiderGroupDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 1,
            },
            payType: 0,
            rowId: 1,
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

    onClickRow = (index) => {
        if (this.state.list.find((x) => x.id === this.state.rowId.id)) {
            // console.log(this.state.list.find((x) => x.id === this.state.rowId.id).proCount)
            const data = this.state.list.find((x) => x.id === this.state.rowId.id);
            if (data !== null) {
                this.formRef.current.setFieldsValue({
                    assignCnt: data.proCount,
                    riderFee: data.riderFee,
                    payType: data.payType,
                    withdraw: data.withdrawLimit,
                    transferLimit: data.transferLimit
                });
                // @todo ????
                // this.setState({payType: data.payType});
            }
        }
        return {
            onClick: () => {
                this.setState({
                    rowId: index,
                });
            },
        };
    }
    setRowClassName = (index) => {
        return index === this.state.rowId ? 'clickRowStyl' : '';
    }


    getList = () => {
        var list = [
            {
                // className={ "mypage-left-select " + (depth1.idx == row.idx ? 'active' : '') },
                id: 1,
                riderGroup: 'A',
                proCount: 6,
                riderFee: '100',
                payType: 0,
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                id: 2,
                riderGroup: 'B',
                proCount: 5,
                riderFee: '200',
                payType: 1,
                withdrawLimit: '10000',
                transferLimit: '1500',
            },
            {
                id: 3,
                riderGroup: 'C',
                proCount: 4,
                riderFee: '300',
                payType: 0,
                withdrawLimit: '200000',
                transferLimit: '1000',
            },
            {
                id: 4,
                riderGroup: 'D',
                proCount: 3,
                riderFee: '400',
                payType: 1,
                withdrawLimit: '40000',
                transferLimit: '500',
            },
            {
                id: 5,
                riderGroup: 'E',
                proCount: 2,
                riderFee: '500',
                payType: 0,
                withdrawLimit: '100000',
                transferLimit: '500',
            },

        ];
        this.setState({
            list: list,
        });
    }

    render() {

        const columns = [
            // {
            //     title: "그룹명",
            //     dataIndex: "riderGroup",
            //     className: "table-column-center",
            // },
            {
                title: "처리건수",
                dataIndex: "proCount",
                className: "table-column-center",
            },
            {
                title: "배달수수료",
                dataIndex: "riderFee",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            },
            // {
            //     title: "정률/정액",
            //     dataIndex: "payType",
            //     className: "table-column-center",
            //     render: (data) => <div>{data === 0 ? `정률` : `정액`}</div>
            // },
            // // {
            //     title: "출금제한 금액",
            //     dataIndex: "withdrawLimit",
            //     className: "table-column-center",
            //     render: (data) => <div>{comma(data)}</div>
            // },
            // {
            //     title: "이체제한",
            //     dataIndex: "transferLimit",
            //     className: "table-column-center",
            //     render: (data) => <div>{comma(data)}</div>
            // },

        ];


        const { close } = this.props;

        return (
            <React.Fragment>
                <div className="Dialog-overlay" onClick={close} />
                <div className="riderGroup-Dialog">
                    <div className="riderGroup-content">
                        <div className="riderGroup-title">
                            기사 그룹관리
                        </div>
                        <img onClick={close} src={require('../../../img/login/close.png').default} className="riderGroup-close" alt="img" />
                        <div className="riderGroup-inner">
                            <Form ref={this.formRef} onFinish={this.handleIdSubmit}>
                                <div className="listBlock">
                                    <Table
                                        dataSource={this.state.list}
                                        columns={columns}
                                        // pagination={this.state.pagination}
                                        onChange={this.handleTableChange}
                                        onRow={this.onClickRow}
                                        rowClassName={this.setRowClassName}
                                    />
                                </div>

                                <div className="riderGroup-ftline">
                                    <div className="riderGroup-ftline-01">
                                        <p>처리 건수</p>
                                    </div>
                                    <div className="inputBox inputBox-rider">
                                        <FormItem
                                            name="assignCnt"
                                        >
                                            <Input />
                                        </FormItem>
                                        <div className="riderGText">
                                            까지 배차가능
                                        </div>
                                    </div>


                                    {/* <div className="riderGroup-ftline-02">
                                        <p>출금 사용</p>

                                        <div className="inputBox inputBox-rider">
                                            <FormItem
                                                name="withdraw"
                                                rules={[{ required: true, message: "0건." }]}
                                            >
                                                <Input />
                                            </FormItem>
                                            <div className="riderGText">
                                                원 (출금 후 잔액이 설정금액이상 있어야 출금허용)
                                            </div>
                                        </div>
                                    </div>


                                    <div className="riderGroup-ftline-03">
                                        <p>이체 사용</p>

                                        <div className="inputBox inputBox-rider">
                                            <FormItem
                                                name="transferLimit"
                                                rules={[{ required: true, message: "0건." }]}
                                            >
                                                <Input />
                                            </FormItem>
                                            <div className="riderGText">
                                                원 까지만 이체가능
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="riderGroup-ftline-04">
                                        <p>배달수수료</p>
                                        <Radio.Group
                                            className="select-fee-pay-type"
                                            defaultValue={this.state.payType}
                                            onChange={(e) => this.setState({ payType: e.target.value })}>
                                            <Radio style={{ fontSize: 18 }} value={0}>정률</Radio>
                                            <Radio style={{ fontSize: 18 }} value={1}>정액&nbsp;&nbsp;&nbsp;</Radio>
                                        </Radio.Group>

                                        <div className="inputBox inputBox-rider">
                                            <FormItem
                                                name="riderFee"
                                                rules={[{ required: true, message: "0건." }]}
                                            >
                                                <Input />
                                            </FormItem>
                                            <div className="riderGText">
                                                {this.state.payType == 0 ? '%' : '원'} 으로 설정
                                            </div>
                                        </div>
                                    </div>



                                    <div className="riderGroup-btn">
                                        <div className="riderGroup-btn-01">
                                            <Button
                                                className="tabBtn riderGroup-btn"
                                                onClick={() => { }}
                                            >적용</Button>
                                        </div>

                                    </div>


                                </div>

                            </Form>

                        </div>


                    </div>
                </div>
            </React.Fragment>

        )
    }
}

export default (RiderGroupDialog);