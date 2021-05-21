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
import { httpUrl, httpPost, httpGet } from "../../../api/httpClient";
import "../../../css/modal.css";
import { formatDateSecond, formatDate } from "../../../lib/util/dateUtil";
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
      branchCode: 1,
      createdate: '',
      deleteDate: '',
      readDate: '',
      deleted: 0,
    //   idx: 1,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getList();
  }

  handleToggleCompleteCall = () => {
    this.setState({
      deleted: 1,
    });
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
      () => this.getList()
    );
  };

  getList = () => {
    let pageNum = this.state.pagination.current;
    let pageSize = this.state.pagination.pageSize;
    httpGet(httpUrl.noticeList, [pageNum, pageSize], {}).then((res) => {
      const pagination = { ...this.state.pagination };
      pagination.current = res.data.currentPage;
      pagination.total = res.data.totalCount;
      this.setState({
        list: res.data.notices,
        pagination,
      });
    });
  };

  handleClear = () => {
    this.formRef.current.resetFields();
  };

  onDelete = (row) => {
    let self = this;
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
      deleted: 1,
      // name: this.formRef.current.getFieldsValue().surchargeName,
      // extraPrice: this.formRef.current.getFieldsValue().feeAdd,
      deleteDate: formatDateSecond(today),
      // readDate: row.readDate,
      idx: row.idx,
    })
      .then((result) => {
        console.log(row);
        // console.log('## delete result=' + JSON.stringify(result, null, 4))
        alert("해당공지사항을 삭제합니다.");
        self.handleClear();
        self.getList();
      })
      .catch((error) => {
        console.log(error);
        alert("에러가 발생하였습니다 다시 시도해주세요.");
      });
  };

  updateData = () => {};

  render() {
    const columns = [
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
              삭제
            </Button>
          </div>
        ),
      },
      {
        title: "날짜",
        dataIndex: "createDate",
        className: "table-column-center",
        render: (data) => <div>{formatDate(data)}</div>,
      },
      {
        title: "내용",
        dataIndex: "content",
        className: "table-column-center",
        render: (data) => (
          <div
            style={{ display: "inline-block", cursor: "pointer" }}
            onClick={() => {}}
          >
            {data}
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
                  <Form ref={this.formRef} onFinish={this.handleSubmit}>
                    <div className="noticelistBlock">
                      <div className="deleteBox">
                        <Checkbox onChange={this.handleToggleCompleteCall}></Checkbox>
                        <span className="span1">삭제목록</span>
                      </div>
                      <Table
                        // rowKey={(record) => record.idx}
                        dataSource={this.state.list}
                        columns={columns}
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange}
                      />
                    </div>
                  </Form>

                  <Form ref={this.formRef} onFinish={this.handleSubmit}>
                    <div className="noticeDetailBlock">
                      <div className="mainTitle">공지사항 추가 및 수정</div>
                      <div className="inputBox">
                        <FormItem
                          className="noticeInputBox"
                          name="content"
                        >
                          <Input
                            className="noticeInputBox"
                            placeholder="공지 내용"
                          />
                        </FormItem>
                      </div>
                      <div className="btnInsert">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="tabBtn insertTab noticeBtn"
                        >
                          전송
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default NoticeDialog;
