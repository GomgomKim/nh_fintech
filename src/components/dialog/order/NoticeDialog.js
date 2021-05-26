import React, { Component } from "react";
import {
  Form,
  Modal,
  Input,
  DatePicker,
  Descriptions,
  Table,
  Upload,
  Button,
  Select,
  Icon,
  Radio,
  Carousel,
  Text,
  Checkbox,
} from "antd";
import { httpUrl, httpPost, httpGet } from '../../../api/httpClient';
import '../../../css/modal.css';
import { connect } from "react-redux";
import { formatDate, formatDateSecond } from '../../../lib/util/dateUtil';
import moment from 'moment';
// import RegistNoticeDialog from "../../components/dialog/order/RegistNoticeDialog";

const Option = Select.Option;
const FormItem = Form.Item;
const today = new Date();

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
      branchCode: 1,
      createdate: '',
      deleteDate: '',
      readDate: '',
      deleted: false,
      checkedCompleteCall: false,
      registNotice: false,
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
        pagination:{
          total: 0,
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
<<<<<<< HEAD
    httpGet(httpUrl.noticeList, [deleted, pageNum, pageSize], {}).then((res) => {
      console.log(res)
      const pagination = { ...this.state.pagination };
      pagination.current = res.data.currentPage;
      pagination.total = res.data.totalCount;
      this.setState({
        list: res.data.notices,
        pagination,
=======
    httpGet(httpUrl.noticeListDeleted, [deleted, pageNum, pageSize], {})
      .then((res) => {
        if (res.result === "SUCCESS" && res.data==="SUCCESS") {
          // alert("성공적으로 처리되었습니다.");
          console.log(res)
          console.log("삭제목록 조회");
          const pagination = { ...this.state.paginationDeleted };
          pagination.current = res.data.currentPage;
          pagination.total = res.data.totalCount;
          // console.log(pagination.total)
          this.setState({
            deletedList: res.data.notices,
            paginationDeleted: pagination,
          });
        } else {
          Modal.info({
            title: "적용 오류",
            content: "처리가 실패했습니다.",
          });
        }
      })
      .catch((e) => {
        Modal.info({
          title: "적용 오류",
          content: "처리가 실패했습니다.",
        });
>>>>>>> 69e5e071b9a17c2177585beee4e8029865bc24e7
      });
    });
    }
  }

  //공지 전송
  handleSubmit = () => {
    let self = this;

    Modal.confirm({
      title: "공지사항 등록",
      content: (
        <div>
          {self.formRef.current.getFieldsValue().content + '을 등록하시겠습니까?'}
        </div>
      ),
      okText: "확인",
      cancelText: "취소",
      onOk() {
        httpPost(httpUrl.registNotice, [], {
          ...self.formRef.current.getFieldsValue(),
          // idx: self.state.idx,
          date: self.state.date,
          title: self.state.title,
          // content: self.state.content,
          deleted: false,
          category: self.state.category,
          sortOrder: self.state.sortOrder,
          important: self.state.important,
          branchCode: self.state.branchCode,
          // deleted: false,
        }).then((result) => {
          Modal.info({
            title: " 완료",
            content: (
              <div>
                {self.formRef.current.getFieldsValue().content}이(가) 등록되었습니다.
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
        })


          //     httpPost(httpUrl.registNotice, [], {
          //         ...self.formRef.current.getFieldsValue(),
          //         date: self.state.date,
          //         title: self.state.title,
          //         category: self.state.category,
          //         sortOrder: self.state.sortOrder,
          //         important: self.state.important,
          //         branchCode: self.state.branchCode,
          //     })
          //         .then((result) => {
          //             Modal.info({
          //                 title: "공지사항",
          //                 content: (
          //                     <div>
          //                        adfds
          //                     </div>
          //                 ),
          //             });
          //             // self.getList();
          //             self.props.close()

          // //     this.setState({content});
          // //     this.getList();
          // // 
          .catch((error) => {
            Modal.info({
              title: "수정 오류",
              content: "오류가 발생하였습니다. 다시 시도해 주십시오."
            });
          });
      }
    });
  }

  handleClear = () => {
    this.formRef.current.resetFields();
  };

  onDelete = (row) => {
    let self = this;
    if (!this.state.checkedDeletedCall) {
    Modal.confirm({
      title:"공지사항 삭제",
      content: "해당 공지사항을 삭제하시겠습니까?",
      okText: "확인",
      cancelText:"취소",
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
        // console.log('## delete result=' + JSON.stringify(result, null, 4))
        Modal.info({
          title:"공지사항 삭제",
          content: (
            <div>
              해당공지사항을 삭제합니다.
            </div>
          ),
        });
        self.getList();
      })
      .catch((error) => {
        console.log(error);
        Modal.info({
          title: "삭제 오류",
          content: "에러가 발생하였습니다 다시 시도해주세요."
        });
      });
  }});
}
  else {
    Modal.confirm({
      title:"공지사항 재공지",
      content: "해당 공지사항을 재공지하시겠습니까?",
      okText: "확인",
      cancelText:"취소",
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
         deleted: false,
         // name: this.formRef.current.getFieldsValue().surchargeName,
         // extraPrice: this.formRef.current.getFieldsValue().feeAdd,
         // deleteDate: formatDateSecond(today),
         // readDate: row.readDate,
         idx: row.idx,
        })
      .then((result) => {
        // console.log('## delete result=' + JSON.stringify(result, null, 4))
        Modal.info({
          title:"공지사항 등록",
          content: (
            <div>
              해당공지사항을 재공지합니다.
            </div>
          ),
        });
        self.getList();
      })
      .catch((error) => {
        console.log(error);
        Modal.info({
          title: "삭제 오류",
          content: "에러가 발생하였습니다 다시 시도해주세요."
        });
      });
  }})};
  }

  closeNoticeRegistrationModal = () => {
    this.setState({ registNotice: false });
  }

  render() {
    const columns = [
      {
        title: "내용",
        dataIndex: "content",
        className: "table-column-center",
        render: (data) => (
          <div>{data}</div>
        ),
      },
      {
        title: "날짜",
        dataIndex: "createDate",
        className: "table-column-center",
        render: (data) => <div>{formatDate(data)}</div>,
      },
      {
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => {}}
            >
              수정
            </Button>
          </div>
        ),
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

    const { isOpen, close } = this.props;

    return (
      <React.Fragment>
        {isOpen ? (
          <React.Fragment>
            <div className="Dialog-overlay" onClick={close} />
            <div className="noticeDialog">
              <div className="container">
                <div className="notice-title">공지사항</div>
                <img
                  onClick={close}
                  src={require("../../../img/login/close.png").default}
                  className="surcharge-close"
                />
                <div className="noticeLayout">
                    <div className="noticelistBlock">
                      <div className="deleteBox">
                        <Checkbox
                        onChange={this.handleToggleDeletedCall}></Checkbox>
                        <span className="span1">삭제목록</span>
                      </div>
                      <div className="registBtn">
                      {/* <RegistNoticeDialog data={this.state.dialogData} isOpen={this.state.registNotice} close={this.closeNoticeRegistrationModal} /> */}
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="tabBtn insertTab noticeBtn"
                          onClick={() => {}}
                        >
                          등록하기
                        </Button>
                      </div>
                        <Table
                          className="noticeListTable"
                          rowKey={(record) => record.idx}
                          dataSource={this.state.list}
                          columns={columns}
                          pagination={this.state.pagination}
                          onChange={this.handleTableChange}
                        />                      
                    </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
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
