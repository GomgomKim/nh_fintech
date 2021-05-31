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
import RegistNoticeDialog from "./RegistNoticeDialog";
import { customError, updateError } from "../../../api/Modals";
import { rowColorName } from "../../../lib/util/codeUtil";

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
      checkedDeletedCall: false,
      registNotice: false,
      updateNotice: false,
      showContent: false,
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
    console.log(row.important)
    if (row.important === false){
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
        if(result.result == "SUCCESS" && result.data == "SUCCESS"){
        // console.log('## delete result=' + JSON.stringify(result, null, 4))
        Modal.info({
          title:"공지사항 삭제",
          content: (
            <div>
              해당공지사항을 삭제합니다.
            </div>
          ),
        });}
        else if(result.data == "NOT_ADMIN") updateError()
        else updateError()
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
        if(result.result == "SUCCESS" && result.data == "SUCCESS"){
        // console.log('## delete result=' + JSON.stringify(result, null, 4))
        Modal.info({
          title:"공지사항 등록",
          content: (
            <div>
              해당공지사항을 재공지합니다.
            </div>
          ),
        });}
        else if(result.data == "NOT_ADMIN") updateError()
        else updateError()
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
  else
  customError("삭제불가", "해당공지는 중요 공지사항입니다.")
}

  closeNoticeRegistrationModal = () => {
    this.setState({ registNotice: false });
    this.getList()
  }

  closeNoticeUpdateModal = () => {
    this.setState({ updateNotice: false });
    this.getList()
  }

  changeShowContent = (row) =>{
    if (this.state.showContent){
      this.setState({
        showContent:false
      })
    }
    else
    this.setState({
      showContent:true
    })
  }


  render() {
    const columns = [
      {
        title: "제목",
        dataIndex: "title",
        className: "table-column-center",
        width: 300,
        render: (data, row) => (
          <div>
          <div
          style={{ display: "inline-block", cursor: "pointer" }}
          onClick={()=>{this.changeShowContent(row)}}>{data}</div>
          {this.state.showContent &&
            <div className= "table-column-content">
            {row.content}
            </div>
          }
          </div>
        ),
      },
      {
        title: "날짜",
        dataIndex: "createDate",
        className: "table-column-center",
        width: 300,
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
              onClick={() => {this.setState({ updateNotice: true, dialogData: row })}}
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
                defaultChecked={this.state.checkedDeletedCall ? "checked":""}
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
                onClick={() => {this.setState({ registNotice: true })}}
                >
                  등록하기
                </Button>
              </div>
              <Table
              className="noticeListTable"
              rowKey={(record) => record.idx}
              rowClassName={(record) => record.important ? "table-blue" : "table-white"}
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
