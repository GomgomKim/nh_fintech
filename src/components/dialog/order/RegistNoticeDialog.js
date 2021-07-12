import { Button, Checkbox, Form, Input, Modal } from "antd";
import React, { Component } from "react";
import { httpPost, httpUrl } from "../../../api/httpClient";
import { customAlert, registError, updateError } from "../../../api/Modals";
import SelectBox from "../../../components/input/SelectBox";
import "../../../css/modal.css";
import { noticeCategoryType } from "../../../lib/util/codeUtil";

const FormItem = Form.Item;

class RegistNoticeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      frData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      date: "",
      title: "",
      content: "",
      category: 1,
      sortOrder: 30,
      branchIdx: 1,
      createDate: "",
      deleteDate: "",
      readDate: "",
      deleted: false,
      registNotice: false,
      checkedMessage: false,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getFrList();
  }

  getFrList = () => {
    httpPost(httpUrl.franchiseList, [], {
      pageSize: 2000000000,
    }).then((result) => {
      const pagination = {
        ...this.state.pagination,
      };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      this.setState({ frData: result.data.franchises, pagination }, () => {
        console.log(JSON.stringify(this.state.frData.map((x) => x.phone)));
      });
    });
  };

  CheckedMessage = (e) => {
    console.log("checked = ", e.target.checked);
    this.setState({ checkedMessage: e.target.checked });
  };

  handleSubmit = () => {
    let self = this;
    let { data } = this.props;
    Modal.confirm({
      title: <div> {data ? "공지 수정" : "공지 등록"} </div>,
      content: (
        <div>
          {" "}
          {data
            ? "공지사항을 수정하시겠습니까?"
            : "새 공지사항을 등록하시겠습니까?"}{" "}
        </div>
      ),
      okText: "확인",
      cancelText: "취소",
      onOk() {
        data
          ? // 공지사항 수정
            httpPost(httpUrl.updateNotice, [], {
              ...self.formRef.current.getFieldsValue(),
              idx: data.idx,
              category: self.state.category,
              important: false,
            })
              .then((result) => {
                console.log(result);
                if (result.result === "SUCCESS" && result.data === "SUCCESS") {
                  customAlert(
                    "완료",
                    self.formRef.current.getFieldsValue().title +
                      "이(가) 수정되었습니다."
                  );
                  // 가맹점 핸드폰 메세지 처리
                  if (self.state.checkedMessage) {
                    httpPost(httpUrl.smsSendFran, [], {
                      destPhones: self.state.frData.map((x) => x.phone),
                      msgBody: self.formRef.current.getFieldsValue().content,
                      subject: "냠냠박스 공지사항",
                    });
                  }
                } else updateError();
                self.props.close();
              })
              .catch((error) => {
                updateError();
              })
          : // 공지사항 등록
            httpPost(httpUrl.registNotice, [], {
              ...self.formRef.current.getFieldsValue(),
              createDate: self.state.createDate,
              deleted: false,
              category: self.state.category,
              branchIdx: self.state.branchIdx,
              important: false,
            })
              .then((result) => {
                if (result.result === "SUCCESS" && result.data === "SUCCESS") {
                  customAlert(
                    "완료",
                    self.formRef.current.getFieldsValue().title +
                      "이(가) 등록되었습니다."
                  );
                  // 가맹점 핸드폰 메세지 처리
                  console.log(
                    "### sms test :" + self.state.frData.map((x) => x.phone)
                  );
                  if (self.state.checkedMessage) {
                    httpPost(httpUrl.smsSendFran, [], {
                      destPhones: self.state.frData.map((x) => x.phone),
                      msgBody: self.formRef.current.getFieldsValue().content,
                      subject: "냠냠박스 공지사항",
                    });
                  }
                } else registError();
                self.props.close();
              })
              .catch((error) => {
                registError();
              });
      },
    });
  };

  handleClear = () => {
    this.formRef.current.resetFields();
  };

  render() {
    const { data, close } = this.props;

    return (
      <React.Fragment>
        <div className="Regist-Notice-Dialog-overlay" onClick={close} />
        <div className="registNoticeDialog">
          <div className="registNotice-content">
            <div className="registStaff-title">
              {data ? "공지 수정" : "공지 등록"}
            </div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="surcharge-close"
              alt="닫기"
            />
            <Form ref={this.formRef} onFinish={this.handleSubmit}>
              <div className="layout">
                <div className="registNoticeWrapper">
                  <div className="contentBlock">
                    <div className="mainTitle">제목</div>
                    <FormItem
                      name="title"
                      className="selectItem"
                      initialValue={data ? data.title : ""}
                      rules={[
                        { required: true, message: "제목을 입력해주세요." },
                      ]}
                    >
                      <Input
                        placeholder="제목을 입력해 주세요."
                        className="override-input"
                      />
                    </FormItem>
                  </div>
                  <div className="contentBlock">
                    <div className="mainTitle">노출순위</div>
                    <FormItem
                      name="sortOrder"
                      className="selectItem"
                      initialValue={data ? data.sortOrder : ""}
                      rules={[
                        { required: true, message: "노출순위를 입력해주세요." },
                      ]}
                    >
                      <Input
                        placeholder="숫자가 클수록 위쪽에 공지됩니다."
                        className="override-input"
                      />
                    </FormItem>
                  </div>
                  <div className="contentBlock">
                    <div className="mainTitle">대상 지정</div>
                    <FormItem name="category" className="selectItem">
                      <SelectBox
                        placeholder={"전체"}
                        value={noticeCategoryType[this.state.franStatus]}
                        code={Object.keys(noticeCategoryType)}
                        codeString={noticeCategoryType}
                        onChange={(value) => {
                          if (value) {
                            this.setState({ category: value });
                          }
                        }}
                      />
                    </FormItem>
                    {this.state.category == 3 && (
                      <>
                        <div className="subTitle">SMS 전송</div>
                        <div className="importantBox">
                          <Checkbox
                            defaultChecked={this.state.checkedMessage}
                            onChange={(e) => this.CheckedMessage(e)}
                          ></Checkbox>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="registNoticeWrapper sub">
                  <div className="contentBlock">
                    <div className="mainTitle">내용</div>
                    <FormItem
                      name="content"
                      className="selectItem"
                      initialValue={data ? data.content : ""}
                      rules={[
                        { required: true, message: "내용을 입력해주세요." },
                      ]}
                    >
                      <Input.TextArea
                        placeholder="내용을 입력해 주세요."
                        className="override-input notice-content"
                      />
                    </FormItem>
                  </div>

                  <div className="submitBlock">
                    <Button type="primary" htmlType="submit">
                      {data ? "수정하기" : "등록하기"}
                    </Button>

                    {!data && (
                      <Button className="clearBtn" onClick={this.handleClear}>
                        초기화
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RegistNoticeDialog;
