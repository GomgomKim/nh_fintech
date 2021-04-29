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

class RiderGroupDialog extends Component {
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
                riderGroup: 'A',
                proCount: 6,
                // withdraw: '매일',
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                riderGroup: 'B',
                proCount: 5,
                // withdraw: '매일',
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                riderGroup: 'C',
                proCount: 4,
                // withdraw: '매일',
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                riderGroup: 'D',
                proCount: 3,
                // withdraw: '매일',
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                riderGroup: 'D',
                proCount: 2,
                // withdraw: '매일',
                withdrawLimit: '100000',
                transferLimit: '500',
            },
            {
                riderGroup: 'A',
                proCount: 1,
                // withdraw: '매일',
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
                // dataIndex: "withdraw",
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
                title: "코인이체",
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
                title: "이체제한",
                dataIndex: "transferLimit",
                className: "table-column-center",
                render: (data) => <div>{comma(data)}</div>
            },
            // {
            //     className: "table-column-center",
            //     render: () =>
            //         <div>
            //             <Button
            //                 className="tabBtn riderGroupTab"
            //                 onClick={() => { }}
            //             >삭제</Button>
            //         </div>
            // },
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
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="riderGroup-close" />
                                    <div className="riderGruop-inner">
                                        <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                            <div className="selectBlock">
                                                <div className="mainTitle">
                                                    지점 선택
                                                </div>
                                                <div className="riderGroup-place1">
                                                    <FormItem
                                                        style={{ marginBottom: 0, display: 'inline-block', verticalAlign: 'middle' }}
                                                        name="riderGroup-place"
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
                                        <div className="riderGroup-ftline">
                                            <div className="riderGroup-ftline-01">
                                                <td>오더처리건수</td>
                                            </div>
                                            <div className="inputBox inputBox-rider sub">
                                                <FormItem
                                                    name="riderG"
                                                    rules={[{ required: true, message: "0건." }]}
                                                >
                                                    <Input />
                                                </FormItem>
                                                <div className="riderGText">
                                                    까지 배차가능 (0으로 설정시 제한없음)
                                                </div>
                                            </div>
                                            <div className="riderGroup-ftline-02">
                                                <td>전체배차조회</td>
                                                <Checkbox></Checkbox>전체기사 배차목록 사용
                                        </div>
                                            <div className="riderGroup-ftline-03">
                                                <td>출금설정</td>
                                                <Checkbox></Checkbox>출금 사용
                                        </div>
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
                                            <div className="riderGroup-ftline-04">
                                                <td>가맹점 코인이체</td>
                                                <Checkbox></Checkbox>이체 사용
                                        </div>
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

                                            <div className="riderGroup-ftline-05">
                                                <td>기사수수료</td>
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
                                                        <Radio style={{ fontSize: 18 }} value={0}>변경없음</Radio>
                                                    </Radio.Group>
                                                </FormItem>
                                            </div>

                                            <div className="riderGroup-ftline-06">
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

                                                <div className="riderGroup-btn-02">
                                                    <Button
                                                        className="tabBtn riderGroup-btn"
                                                        onClick={() => { }}
                                                    >닫기</Button>
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