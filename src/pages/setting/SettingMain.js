import { Form, DatePicker, Input, Table, Button, Descriptions } from "antd";
import Icon from "@ant-design/icons";
import React, { Component } from "react";
import {
  httpGet,
  httpUrl,
  httpDownload,
  httpPost,
  httpPut,
} from "../../api/httpClient";
import SelectBox from "../../components/input/SelectBox";
import { connect } from "react-redux";
import Modal from "antd/lib/modal/Modal";

const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class SettingMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkNewPasswordError: false,
      checkCurrentPasswordError: false,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {}

  handleSubmit = () => {
    const form = this.formRef.current.getFieldsValue();
    console.log(form);

    // bcrypt 활용 encoding 후 비교해야 함
    // install 과정에서 에러 발생으로 인해 일단 놔둠
    // + 현재 loginInfo 에서 password 항상 null 로 와서 해당 이슈 해결 후 테스팅 필요
    if (this.props.password !== form.currentPassword) {
      this.setState({ checkCurrentPasswordError: true });
      return;
    } else if (form.newPaword !== form.newPasswordCheck) {
      this.setState({ checkNewPasswordError: true });
      return;
    } else {
      httpPost(httpUrl.changePassword, [], {
        password: form.newPassword,
      })
        .then((res) => {
          if (res.result === "SUCCESS") {
            Modal.info({
              title: "변경 성공",
              content: "비밀번호 변경에 성공했습니다.",
            });
          } else {
            Modal.info({
              title: "변경 실패",
              content: "비밀번호 변경에 싪패했습니다.",
            });
          }
        })
        .catch((e) => {
          Modal.info({
            title: "변경 실패",
            content: "비밀번호 변경에 싪패했습니다.",
          });
        });
    }
  };

  render() {
    return (
      <div className="pwChange-root">
        <div className="pwChange-Layout">
          <div className="pwChange-title">비밀번호 변경</div>
          <br></br>
          <Form ref={this.formRef} onFinish={this.handleSubmit}>
            <div className="pwChange-box">
              <div className="twl pwChange-list">
                <td>현재 비밀번호</td>
                <div className="inputBox inputBox-pwChange sub">
                  <FormItem name="currentPassword">
                    <Input
                      type="password"
                      placeholder="현재 비밀번호를 입력해주세요"
                    />
                  </FormItem>
                  {this.state.checkCurrentPasswordError && (
                    <div className="error-message">
                      비밀번호를 확인해주세요!
                    </div>
                  )}
                </div>
              </div>
              <div className="twl pwChange-list">
                <td>새 비밀번호</td>
                <div className="inputBox inputBox-pwChange sub">
                  <FormItem name="newPassword">
                    <Input
                      type="password"
                      placeholder="새로운 비밀번호를 입력해주세요"
                    />
                  </FormItem>
                </div>
              </div>
              <div className="twl pwChange-list">
                <td>새 비밀번호 확인</td>
                <div className="inputBox inputBox-pwChange sub">
                  <FormItem name="newPasswordCheck">
                    <Input
                      type="password"
                      placeholder="새로운 비밀번호를 다시 입력해주세요"
                    />
                  </FormItem>
                  {this.state.checkNewPasswordError && (
                    <div className="error-message">
                      비밀번호를 확인해주세요!
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pwChange-btn">
              <Button htmlType="submit" className="tabBtn" onClick={() => {}}>
                변경하기
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  password: state.login.loginInfo.password,
});

const mapDispatchToProps = (dispatch) => {};

export default connect(mapStateToProps, mapDispatchToProps)(SettingMain);
