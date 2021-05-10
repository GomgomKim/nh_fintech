import React, { Component } from "react";
import {
    Form, Input, Table, Button, Select, Radio, Checkbox
} from "antd";
import '../../../css/modal.css';
import { comma } from "../../../lib/util/numberUtil";

const FormItem = Form.Item;
const Option = Select.Option;

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
        return {
            onClick: () => {
                // console.log(record.riderGroup)
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
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                id: 2,
                riderGroup: 'B',
                proCount: 5,
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                id: 3,
                riderGroup: 'C',
                proCount: 4,
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                id: 4,
                riderGroup: 'D',
                proCount: 3,
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                id: 5,
                riderGroup: 'D',
                proCount: 2,
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
            {
                title: "그룹",
                dataIndex: "riderGroup",
                className: "table-column-center",
                render: (data) => <div>{data == "A" ? "A"
                    : data == "B" ? "B"
                        : data == "C" ? "C"
                            : data == "D" ? "D" : "-"}</div>
            },
            {
                title: "처리건수",
                dataIndex: "proCount",
                className: "table-column-center",
            },
            {
                title: "출금가능",
                className: "table-column-center",
                render: () =>
                    <div>
                        {<Checkbox
                            className="tabBtn riderGroupTab"
                            onClick={() => { this.setState({ workTabOpen: true }) }}
                        ></Checkbox>}
                    </div>
            },
            {
                title: "출금제한 금액",
                dataIndex: "withdrawLimit",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            },
            {
                title: "이체제한",
                dataIndex: "transferLimit",
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
                            <div className="riderGroup-Dialog">

                                <div className="riderGroup-content">
                                    <div className="riderGroup-title">
                                        기사 그룹관리
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="riderGroup-close" />
                                    <div className="riderGroup-inner">
                                        <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>

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

                                        </Form>
                                        <div className="riderGroup-ftline">
                                            <div className="riderGroup-ftline-01">
                                                <Checkbox>&nbsp;</Checkbox><td>오더처리건수</td>
                                            </div>
                                            <div className="inputBox inputBox-rider sub">
                                                <FormItem
                                                    name="riderG"
                                                    rules={[{ required: true, message: "0건." }]}
                                                >
                                                    <Input />
                                                </FormItem>
                                                <div className="riderGText">
                                                    까지 배차가능
                                                </div>
                                            </div>



                                            <div className="riderGroup-ftline-02">
                                                <Checkbox>&nbsp;</Checkbox><td>출금설정</td>
                                                <Checkbox></Checkbox>
                                                <span class="riderSubtext">출금 사용</span>

                                                <div className="inputBox inputBox-rider">
                                                    <FormItem
                                                        name="riderG"
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
                                                <Checkbox>&nbsp;</Checkbox><td>가맹점 코인이체</td>
                                                <Checkbox></Checkbox>
                                                <span class="riderSubtext">이체 사용</span>

                                                <div className="inputBox inputBox-rider">
                                                    <FormItem
                                                        name="riderG"
                                                        rules={[{ required: true, message: "0건." }]}
                                                    >
                                                        <Input />
                                                    </FormItem>
                                                    <div className="riderGText">
                                                        원 까지만 이체가능
                                                </div>
                                                </div>
                                            </div>



                                            <div className="riderGroup-ftline-04">
                                                <Checkbox>&nbsp;</Checkbox><td>기사수수료</td>
                                                <FormItem
                                                    style={{
                                                        marginBottom: 0,
                                                        display: 'inline-block',
                                                        verticalAlign: 'middle',
                                                    }}
                                                    name="payType"
                                                    initialValue={0}
                                                >
                                                    <Radio.Group>
                                                        <Radio style={{ fontSize: 18 }} value={0}>정률</Radio>
                                                        <Radio style={{ fontSize: 18 }} value={1}>정액&nbsp;&nbsp;&nbsp;</Radio>
                                                    </Radio.Group>
                                                </FormItem>
                                            </div>

                                            <div className="riderGroup-ftline-05">
                                                <td>&nbsp;</td>
                                                <FormItem
                                                    style={{
                                                        marginBottom: 0,
                                                        display: 'inline-block',
                                                        verticalAlign: 'middle',
                                                    }}
                                                    name="payType"
                                                    initialValue={0}
                                                >
                                                    <Radio.Group>
                                                        <Radio style={{ fontSize: 18 }} value={0}>고정</Radio>
                                                        <Radio style={{ fontSize: 18 }} value={1}>할인&nbsp;&nbsp;&nbsp;을</Radio>
                                                    </Radio.Group>
                                                </FormItem>
                                            </div>
                                            <div className="inputBox inputBox-rider">
                                                <FormItem
                                                    name="riderG"
                                                    rules={[{ required: true, message: "0건." }]}
                                                >
                                                    <Input />
                                                </FormItem>
                                                <div className="riderGText">
                                                    원으로 설정
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

export default (RiderGroupDialog);