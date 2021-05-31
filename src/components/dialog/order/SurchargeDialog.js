import React, { Component } from "react";
import {
    Form, Input, DatePicker, Table,
    Button, Modal, Checkbox, Radio
} from "antd";
import { httpUrl, httpPost, httpGet } from '../../../api/httpClient';
import '../../../css/modal.css';
import { connect } from "react-redux";
import { comma } from "../../../lib/util/numberUtil";
import moment from 'moment';
import SelectBox from '../../../components/input/SelectBox';
import { enabledString, enabledCode, surchargeType } from '../../../lib/util/codeUtil';
import SurchargeGroupDialog from './SurchargeGroupDialog';
import SearchFranchiseDialog from "../../dialog/common/SearchFranchiseDialog";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SurchargeDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            startDate: "",
            endDate: "",
            surchargeGroupOpen: false,
            surchargeCheck: false,
            surchargeType: 0,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getList()
        // alert(this.props.userGroup)
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

    // 할증목록
    getList = () => {
        let pageNum = this.state.pagination.current;
        let pageSize = this.state.pagination.pageSize;
        httpGet(httpUrl.priceExtraList, [pageNum, pageSize], {}).then((res) => {
            const pagination = { ...this.state.pagination };
            pagination.current = res.data.currentPage;
            pagination.total = res.data.totalCount;
            this.setState({
                list: res.data.deliveryPriceExtras,
                pagination,
            });
        }).catch(e => {
            Modal.info({
                title: "시스템 에러",
                content: "시스템 에러가 발생하였습니다. 다시 시도해 주십시오."
            });
        });;
    }

    // 할증등록
    handleSubmit = () => {
        let self = this;
        Modal.confirm({
            title: "할증 등록",
            content: (
                <div>
                    {self.formRef.current.getFieldsValue().name + '을 등록하시겠습니까?'}
                </div>
            ),
            okText: "확인",
            cancelText: "취소",
            onOk() {
                let enabled = true;
                httpPost(httpUrl.priceExtraRegist, [], {
                    ...self.formRef.current.getFieldsValue(),
                    enabled,
                    branchIdx: self.props.userGroup,
                    startDate: self.state.startDate,
                    endDate: self.state.endDate,
                }).then((result) => {
                    Modal.info({
                        title: "등록 완료",
                        content: (
                            <div>
                                {self.formRef.current.getFieldsValue().name}이(가) 등록되었습니다.
                            </div>
                        ),
                    });
                    self.handleClear();
                    self.getList();
                }).catch((error) => {
                    Modal.info({
                        title: "등록 오류",
                        content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                    });
                });
            },
        });
    }

    // 할증 등록기간 설정
    onChangeDate = (dateString) => {
        this.setState({
            startDate: moment(dateString[0]).format('YYYY-MM-DD HH:mm'),
            endDate: moment(dateString[1]).format('YYYY-MM-DD HH:mm'),
        })
    };

    // 할증 등록시 초기화
    handleClear = () => {
        this.formRef.current.resetFields();
    };

    // 할증삭제
    onDelete = (row) => {
        let self = this;
        Modal.confirm({
            title: "할증 삭제",
            content: <div> {row.name} 할증을 삭제하시겠습니까?</div>,
            okText: "확인",
            cancelText: "취소",
            onOk() {
                let idx = row.idx;
                let name = row.name;
                httpGet(httpUrl.priceExtraDelete, [idx], {})
                    .then((result) => {
                        Modal.info({
                            title: "할증 삭제",
                            content: <div> {name} 할증이 삭제되었습니다.</div>,
                        });
                        self.getList();
                    })
                    .catch((error) => {
                        Modal.info({
                            title: "삭제 오류",
                            content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                        });
                    });
            },
        });
    };

    // 할증 사용여부수정
    onChangeStatus = (index, value) => {
        httpPost(httpUrl.priceExtraUpdate, [], { idx: index, enabled: value })
            .then((result) => {
                this.getList();
            })
            .catch((error) => {
                Modal.info({
                    title: "수정 오류",
                    content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                });
            });
    }

    //대상 적용
    onCheckType = (e) => {
        this.setState({ surchargeType: e.target.value })
    }


    // 할증그룹관리 dialog
    openSurchargeGroupModal = () => {
        this.setState({ surchargeGroupOpen: true });
    };
    closeSurchargeGroupModal = () => {
        this.setState({ surchargeGroupOpen: false });
    };


    render() {

        const columns = [
            {
                title: "사용여부",
                dataIndex: "enabled",
                className: "table-column-center",
                render: (data, row) => <div>
                    <SelectBox
                        value={enabledString[data]}
                        code={enabledCode}
                        codeString={enabledString}
                        onChange={(value) => {
                            if (parseInt(value) !== row.enabled) {
                                this.onChangeStatus(row.idx, value);
                            }
                        }}
                    />
                </div>
            },
            {
                title: "할증명",
                dataIndex: "name",
                className: "table-column-center",
                render: (data) => <div>{data}</div>
            },
            {
                title: "적용시간",
                dataIndex: "completionTime",
                className: "table-column-center",
                render: (data, row) => <div>{row.startDate + ' - ' + row.endDate}</div>
            },
            {
                title: "추가요금",
                dataIndex: "extraPrice",
                className: "table-column-center",
                render: (data, row) => 
                <div>{comma(data)}</div>
            },
            {
                title: "할증 그룹",
                dataIndex: "frSettingGroupIdx",
                className: "table-column-center",
                render: (data, row) => 
                <div>{data === null ? "전체" : "그룹1"}</div>
            },
            {
                className: "table-column-center",
                render: (data, row) =>
                    <div>
                        <Button
                            className="tabBtn surchargeTab"
                            onClick={() => { this.onDelete(row) }}
                        >삭제</Button>
                    </div>
            },
        ];

        const { close } = this.props;

        return (

                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="surcharge-Dialog">
                                <div className="surcharge-container">
                                    <div className="surcharge-title">
                                        할증
                                    </div>

                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <div className="surchargeLayout">
                                    {this.state.surchargeGroupOpen && 
                                        <SurchargeGroupDialog
                                        isOpen={this.state.surchargeGroupOpen}
                                        close={this.closeSurchargeGroupModal}
                                    />
                                    }
                                    <Button onClick={this.openSurchargeGroupModal}>
                                        할증 그룹관리
                                    </Button>
                                        <div className="listBlock">
                                            <Table
                                                // rowKey={(record) => record.idx}
                                                dataSource={this.state.list}
                                                columns={columns}
                                                pagination={this.state.pagination}
                                                onChange={this.handleTableChange}
                                            />
                                        </div>
                                        <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                            <div className="insertBlock">
                                                <div className="mainTitle">
                                                    할증 요금 정보
                                                </div>
                                                <div className="m-t-20">
                                                    <div className="subTitle">
                                                        할증명
                                                    </div>
                                                    <div className="inputBox">
                                                        <FormItem
                                                            name="name"
                                                            rules={[{ required: true, message: "할증명을 입력해주세요." }]}
                                                        >
                                                            <Input style={{ width: 130 }} />
                                                        </FormItem>
                                                    </div>
                                                    <div className="subDatePrice">
                                                        등록기간
                                                    </div>
                                                    <div className="selectBox">
                                                        <FormItem
                                                            name="surchargeDate"
                                                            rules={[{ required: true, message: "등록기간 날짜를 선택해주세요" }]}
                                                        >
                                                            <RangePicker
                                                                placeholder={['시작일', '종료일']}
                                                                showTime={{ format: 'HH:mm' }}
                                                                onChange={this.onChangeDate}
                                                            />
                                                        </FormItem>
                                                    </div>
                                                    <div className="subDatePrice">
                                                        추가요금
                                                    </div>
                                                    <div className="inputBox">
                                                        <FormItem
                                                            name="extraPrice"
                                                            rules={[{ required: true, message: "추가금액을 입력해주세요." }]}
                                                        >
                                                            <Input style={{ width: 150 }} />
                                                        </FormItem>
                                                        <div className="priceText">
                                                            원
                                                        </div>
                                                    </div>
                                                    <div className="checkbox">
                                                        상시할증 적용
                                                    </div>
                                                    <Checkbox
                                                        style={{verticalAlign:'middle'}}
                                                        defaultChecked={this.state.surchargeCheck ? "checked" : ""}
                                                        onChange={this.onSurchargeCheck} />
                                                    
                                                    <div className="radio-btn">
                                                        대상 지정
                                                    </div>
                                                    <Radio.Group
                                                        className="searchRequirement"
                                                        onChange={this.onCheckType}
                                                        value={this.state.surchargeType}
                                                        >
                                                        {Object.entries(surchargeType).map(([key, value]) => {
                                                            return (
                                                            <Radio value={parseInt(key)}>
                                                                {value}
                                                            </Radio>
                                                            );
                                                        })}
                                                    </Radio.Group>
                                                        

                                                <div className="search-input">
                                                    그룹명
                                                </div>
                                                {this.state.searchFranchiseOpen &&
                                                <SearchFranchiseDialog
                                                    close={this.closeSearchFranchiseModal}
                                                    callback={(data) => {
                                                        this.setState({ selectedFr:data })
                                                    }}
                                                />}
                                                <FormItem
                                                    name="frName"
                                                    className="selectItem"
                                                >
                                                    <Input placeholder="가맹점명 입력" className="override-input sub" required
                                                        value={ this.state.selectedFr ? this.state.selectedFr.frName : ""}>
                                                    </Input>
                                                    <Button onClick={this.openSearchFranchiseModal}>
                                                    조회
                                                    </Button>
                                                </FormItem>



                                                </div>
                                                <div className="btnInsert">
                                                    <Button type="primary" htmlType="submit" className="tabBtn insertTab">
                                                        등록하기
                                                    </Button>
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
const mapStateToProps = (state) => {
    return {
        userGroup: state.login.loginInfo.userGroup,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurchargeDialog);
