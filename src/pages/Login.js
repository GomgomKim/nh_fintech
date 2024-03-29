import { Button, Checkbox, Form, Input } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { login } from "../actions/loginAction";
import { httpPost, httpUrl } from "../api/httpClient";
import Const from "../const";

const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveLoginId: false,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getStorageLoginInfo();
  }
  getStorageLoginInfo = () => {
    let value = reactLocalStorage.getObject(Const.appName + ":auth");
    if (value !== null) {
      try {
        value = JSON.parse(value);
      } catch { }
      if (value.type === "saveLoginId") {
        this.formRef.current.setFieldsValue({ id: value.id });
        this.setState({ saveLoginId: true });
      }
    }
  };
  handleSubmit = (e) => {
    httpPost(httpUrl.login, [], {
      ...this.formRef.current.getFieldsValue(),
    })
      .then((res) => {
        if(res.data.reason === "INVALID_USER_STATUS") {
          alert("유효하지 않은 사용자입니다.")
          return;
        }
        if (!res.data.result) {
          alert("아이디 또는 비밀번호가 잘못되었습니다.");
          return;
        }
        if(res.data.user.userStatus !== 1) {
          alert("잘못된 사용자입니다.");
          return;
        }
        if(res.data.user.userType !== 4) {
          alert("잘못된 사용자입니다.");
          return;
        }
        this.props.onLogin(res.data.user);

        let localData = {};
        if (this.state.saveLoginId) {
          localData = {
            type: "saveLoginId",
            id: this.formRef.current.getFieldValue("id"),
          };
        }
        reactLocalStorage.setObject(
          Const.appName + ":auth",
          JSON.stringify(localData)
        );

        this.props.history.push("/order/OrderMain");
      })
      .catch((error) => {
        console.log(error) });
  };

  render() {
    return (
      <div className="login-container">
        <Form ref={this.formRef} onFinish={this.handleSubmit}>
          <div className="login-img desk">
            <img
              src={require("../img/login/login_img.png").default}
              alt="login_image"
            />
          </div>
          <div className="login-form">
            <div className="login-logo">
              <img
                src={require("../img/login/login_text.png").default}
                alt="login_text"
              />
              <div className="login-system-name">(관제시스템)</div>
            </div>
            <div className="login-input">
              <FormItem
                name="id"
                rules={[{ required: true, message: "아이디를 입력해주세요" }]}
              >
                <Input className="login-input-item" placeholder="아이디" />
              </FormItem>
              <FormItem
                name="password"
                rules={[
                  { required: true, message: "비밀번호를 입력해주세요." },
                ]}
              >
                <Input
                  className="login-input-item"
                  type="password"
                  placeholder="비밀번호"
                />
              </FormItem>
            </div>
            <div className="login-">
              <FormItem>
                <Button htmlType="submit" className="login-form-button">
                  로그인
                </Button>
              </FormItem>
            </div>

            <div className="top-input-checkbox">
              <Checkbox
                style={{ paddingRight: 5.7 }}
                onChange={(e) => {
                  this.setState({ saveLoginId: e.target.checked });
                }}
                checked={this.state.saveLoginId}
              />
              <div className="top-input-checkbox-text">아이디 저장</div>
            </div>
          </div>
        </Form>

        {/* 
        </Form> */}
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    isLogin: state.login.isLogin,
    loginInfo: state.login.loginInfo,
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (userinfo) => dispatch(login(userinfo)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
