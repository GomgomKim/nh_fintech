import React, { Component } from "react";
import {
  Modal,
  Table,
  Button,
  Checkbox,
} from "antd";
import { httpUrl, httpPost, httpGet } from '../../../api/httpClient';
import '../../../css/modal.css';
import '../../../css/modal_m.css';
import { connect } from "react-redux";
import { formatDate } from '../../../lib/util/dateUtil';
import RegistNoticeDialog from "./RegistNoticeDialog";
import { customAlert, customError, updateError } from "../../../api/Modals";
import {
  importantNotice,
} from "../../../lib/util/codeUtil"

class NoticeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      date: "",
      title: "",
      content: "",
      category: 0,
      sortOrder: 30,
      important: 0,
      branchIdx: 1,
      createdate: '',
      deleteDate: '',
      readDate: '',
      deleted: false,
      checkedDeletedCall: false,
      registNotice: false,
      updateNotice: false,
      showContent: 0,
      //   idx: 1,
    };
    this.formRef = React.createRef();
  }


  componentDidMount() {
    this.getList();
  }

  handleToggleDeletedCall = (e) => {
    this.setState(
      {
        checkedDeletedCall: e.target.checked,
        pagination: {
          current: 1,
          pageSize: 5,
        },
      },
      () => {
        this.getList();
      }
    );
  };

  handleTableChange = (pagination) => {
    console.log(pagination);
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState(
      {
        pagination: pager,
      },
      () => {
        this.getList();
      }
    );
  };


  getList = () => {
    // console.log("### "+ this.state.pagination.current)
    let pageNum = this.state.pagination.current;
    let pageSize = this.state.pagination.pageSize;
    if (!this.state.checkedDeletedCall) {
      let deleted = false;
      httpGet(httpUrl.noticeList, [deleted, pageNum, pageSize], {}).then((res) => {
        console.log(res)
        const pagination = { ...this.state.pagination };
        pagination.current = res.data.currentPage;
        pagination.total = res.data.totalCount;
        this.setState({
          list: res.data.notices,
          pagination,
        });
      });
    }
    else {
      let deleted = true;
      httpGet(httpUrl.noticeList, [deleted, pageNum, pageSize], {}).then((res) => {
        console.log(res)
        const pagination = { ...this.state.pagination };
        pagination.current = res.data.currentPage;
        pagination.total = res.data.totalCount;
        this.setState({
          list: res.data.notices,
          pagination,
        });
      });
    }
  }

  handleClear = () => {
    this.formRef.current.resetFields();
  };

  onDelete = (row) => {
    let self = this;
    console.log(row.important)
    if (!row.important) {
      if (!this.state.checkedDeletedCall) {
        Modal.confirm({
          title: "공지사항 삭제",
          content: "해당 공지사항을 삭제하시겠습니까?",
          okText: "확인",
          cancelText: "취소",
          onOk() {
            httpPost(httpUrl.updateNotice, [], {
              // category:row.category,
              // important:row.important,
              // title:row.title,
              // sortOrder:row.sortOrder,
              // content:row.content,
              // // name: this.formRef.current.getFieldsValue().surchargeName,
              // // extraPrice: this.formRef.current.getFieldsValue().feeAdd,
              // branchCode: self.state.branchCode,
              // createDate: formatDateSecond(row.createDate),
              deleted: true,
              // name: this.formRef.current.getFieldsValue().surchargeName,
              // extraPrice: this.formRef.current.getFieldsValue().feeAdd,
              // deleteDate: formatDateSecond(today),
              // readDate: row.readDate,
              idx: row.idx,
            })
              .then((result) => {
                if (result.result === "SUCCESS" && result.data === "SUCCESS") {
                  customAlert("완료", "해당공지사항을 삭제합니다.")
                }
                else updateError()
                self.getList();
              })
              .catch((error) => {
                customError("삭제오류", "에러가 발생하였습니다. 다시 시도해주세요.")
              });
          }
        });
      }
      else {
        Modal.confirm({
          title: "공지사항 재공지",
          content: "해당 공지사항을 재공지하시겠습니까?",
          okText: "확인",
          cancelText: "취소",
          onOk() {
            httpPost(httpUrl.updateNotice, [], {
              deleted: false,
              idx: row.idx,
            })
              .then((result) => {
                if (result.result === "SUCCESS" && result.data === "SUCCESS") {
                  customAlert("완료", "해당공지사항을 재공지합니다.")
                }
                else updateError()
                self.getList();
              })
              .catch((error) => {
                updateError()
              });
          }
        })
      };
    }
    else
      customError("삭제불가", "해당공지는 중요 공지사항입니다.")
  }

  closeNoticeRegistrationModal = () => {
    this.setState({
      registNotice: false,
      checkedDeletedCall: false,
      pagination: {
        current: 1,
        pageSize: 5,
      }
    }, () => this.getList());
  }

  openNoticeRegistrationModal = () => {
    this.setState({ registNotice: true });
  }

  closeNoticeUpdateModal = () => {
    this.setState({ updateNotice: false });
    this.getList()
  }

  changeShowContent = (idx) => {
    if (this.state.showContent === idx) {
      this.setState({
        showContent: 0
      })
    }
    else
      this.setState({
        showContent: idx
      })
  }

  // dataSplit = (content) => {
  //     content.split('\n').map(line=>{
  //     return(<span>{line}<br/></span>)
  //   })
  // }


  render() {
    const columns = [
      {
        title: "제목",
        dataIndex: "title",
        className: "table-column-center",
        width: 400,
        render: (data, row) => (
          <>
            <div
              className="noticeTag"
              onClick={() => { this.changeShowContent(row.idx) }}>{data}</div>
            {this.state.showContent === row.idx &&
              <div className="table-column-content">
                {row.content.split('\n').map(line => {
                  return (<span>{line}<br /></span>)
                })}
              </div>
            }
          </>
        ),
      },
      {
        title: "대상",
        dataIndex: "category",
        className: "table-column-center",
        width: 100,
        render: (data) => <div>{data === 1 ? '전체' : data === 2 ? '라이더' : '가맹점'}</div>,
      },
      {
        title: "날짜",
        dataIndex: "createDate",
        className: "table-column-center",
        width: 150,
        render: (data) => <div>{formatDate(data)}</div>,
      },
      {
        title: "노출순위",
        dataIndex: "sortOrder",
        className: "table-column-center",
        render: (data) => (
          <div>{data}</div>
        ),
      },
      {
        className: "table-column-center",
        render: !this.state.checkedDeletedCall && (
          (data, row) => (
            <div>

              <Button
                className="tabBtn surchargeTab"
                onClick={() => { this.setState({ updateNotice: true, dialogData: row }) }}
              >
                수정
              </Button>
            </div>
          )),
      },
      {
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => {
                this.onDelete(row);
              }}
            >
              {!this.state.checkedDeletedCall ? (
                <div>삭제</div>
              ) : (
                <div>등록</div>
              )}
            </Button>
          </div>
        ),
      },

    ];

    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="noticeDialog">
          <div className="container">
            <div className="notice-title">공지사항</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="surcharge-close"
              alt="닫기"
            />
            <div className="noticeLayout">
              <div className="noticelistBlock">
                <div className="deleteBox">
                  <Checkbox
                    checked={this.state.checkedDeletedCall ? "checked" : ""}
                    // defaultChecked={this.state.checkedDeletedCall ? "checked":""}
                    onChange={this.handleToggleDeletedCall}></Checkbox>
                  <span className="span1">삭제목록</span>
                </div>
                <div className="registBtn">
                  {this.state.registNotice &&
                    <RegistNoticeDialog close={this.closeNoticeRegistrationModal} />}
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="tabBtn insertTab noticeBtn"
                    onClick={this.openNoticeRegistrationModal}
                  >
                    등록하기
                  </Button>
                </div>
                <Table
                  className="noticeListTable"
                  rowKey={(record) => record.idx}
                  rowClassName={(record) => importantNotice[record.important]}
                  dataSource={this.state.list}
                  columns={columns}
                  pagination={this.state.pagination}
                  onChange={this.handleTableChange}
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.updateNotice &&
          <RegistNoticeDialog data={this.state.dialogData} close={this.closeNoticeUpdateModal} />}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    branchIdx: state.login.branch,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NoticeDialog);
