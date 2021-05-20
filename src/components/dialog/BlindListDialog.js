import React, { Component } from "react";
import {
    Form, Table,
} from "antd";
import '../../css/modal.css';

class BlindListDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            blocked: 0,
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

    onDelete = (value) => {
        // alert(JSON.stringify(value))
        let blocked = value
        this.setState({
            blocked: blocked
        }, () => {
            // alert([gradeLevel] + ' 등급 으로 수정합니다.')
            this.getList();
        })
    }


    getList = () => {
        var list = [
            {
                idx: 4,
                blockDate: '21-02-17',
                FranchiseName: '구래반도4차)소통',
                riderName: '배지현',
                riderBranch: '플러스김포',
                riderPhone: '010-7755-6466',
                blockMemo: '배송지연 및 픽업지연',
                blocked: this.state.blocked
            },
            {
                idx: 3,
                blockDate: '21-02-17',
                FranchiseName: '구래반도4차)소통',
                riderName: '배지현',
                riderBranch: '플러스김포',
                riderPhone: '010-7755-6466',
                blockMemo: '배송지연 및 픽업지연',
                blocked: this.state.blocked
            },
            {
                idx: 2,
                blockDate: '21-02-17',
                FranchiseName: '구래반도4차)소통',
                riderName: '배지현',
                riderBranch: '플러스김포',
                riderPhone: '010-7755-6466',
                blockMemo: '배송지연 및 픽업지연',
                blocked: this.state.blocked
            },
            {
                idx: 1,
                blockDate: '21-02-17',
                FranchiseName: '구래반도4차)소통',
                riderName: '배지현',
                riderBranch: '플러스김포',
                riderPhone: '010-7755-6466',
                blockMemo: '배송지연 및 픽업지연',
                blocked: this.state.blocked
            },

        ];
        this.setState({
            list: list,
        });
    }

    render() {

        const columns = [
            {
                title: "차단날짜",
                dataIndex: "blockDate",
                className: "table-column-center",
            },
            {
                title: "가맹점명",
                dataIndex: "FranchiseName",
                className: "table-column-center",
            },
            {
                title: "기사명",
                dataIndex: "riderName",
                className: "table-column-center",
            },
            {
                title: "기사의 소속지사",
                dataIndex: "riderBranch",
                className: "table-column-center",
            },
            {
                title: "기사단말기번호",
                dataIndex: "riderPhone",
                className: "table-column-center",
            },
            {
                title: "차단사항",
                dataIndex: "blockMemo",
                className: "table-column-center",
            },
            {
                title: "상태",
                dataIndex: "blocked",
                className: "table-column-center",
                render:
                    (data, row) => (
                        <div>
                            {/* <SelectBox
                                value={string.blockString[data]}
                                code={string.toggleCode}
                                codeString={string.blockString}
                                onChange={(value) => {
                                    if (parseInt(value) !== row.blocked) {
                                        this.onDelete(value, row.idx);
                                    }
                                }}
                            /> */}
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
                            <div className="surcharge-Dialog">
                                <div className="surcharge-container">
                                    <div className="surcharge-title">
                                        기사 차단 목록
                                    </div>
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="surcharge-close" />


                                    <div className="surchargeLayout">
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

export default (BlindListDialog);