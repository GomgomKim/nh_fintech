import React, { Component } from "react";
import { Form, Button, Checkbox, Select, Modal } from "antd";
import "../../../css/modal.css";
import { ClockCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { httpPost, httpUrl } from "../../../api/httpClient";

const FormItem = Form.Item;
const Option = Select.Option;

class TimeDelayDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branchIdx: null,
      deliveryNotAvailable: false,
      confirmLoading: false,
      btnInfos: [
        {
          value: 5,
          text: "5분",
          toggle: true,
        },
        {
          value: 10,
          text: "10분",
          toggle: true,
        },
        {
          value: 15,
          text: "15분",
          toggle: true,
        },
        {
          value: 20,
          text: "20분",
          toggle: true,
        },
        {
          value: 30,
          text: "30분",
          toggle: true,
        },
        {
          value: 40,
          text: "40분",
          toggle: true,
        },
        {
          value: 1005,
          text: "후 5분",
          toggle: true,
        },
        {
          value: 1010,
          text: "후 10분",
          toggle: true,
        },
      ],
    };
  }

  handleChange = (e) => {
    this.setState({
      deliveryNotAvailable: e.target.checked,
    });
  };

  handleClick = (value) => {
    this.setState({
      delayTime: value,
    });
  };

  handleToggle = (value) => {
    const toggledBtnInfos = this.state.btnInfos.map((btnInfo) => {
      if (btnInfo.value === value) {
        return {
          value: value,
          text: btnInfo.text,
          toggle: !btnInfo.toggle,
        };
      } else {
        return btnInfo;
      }
    });
    this.setState({ btnInfos: toggledBtnInfos });
  };

  handleSubmit = () => {
    Modal.confirm({
      title: "호출설정",
      content: "설정하시겠습니까?",
      onOk: () => {
        this.setState({ confirmLoading: true });
        const btnInfos = this.state.btnInfos;
        httpPost(httpUrl.updateBranch, [], {
          idx: this.props.branchIdx,
          deliveryEnabled: !this.state.deliveryNotAvailable,
          pickupAvTime10: btnInfos.find((e) => e.value === 10).toggle,
          pickupAvTime10After: btnInfos.find((e) => e.value === 1010).toggle,
          pickupAvTime15: btnInfos.find((e) => e.value === 15).toggle,
          pickupAvTime20: btnInfos.find((e) => e.value === 20).toggle,
          pickupAvTime30: btnInfos.find((e) => e.value === 30).toggle,
          pickupAvTime40: btnInfos.find((e) => e.value === 40).toggle,
          pickupAvTime5: btnInfos.find((e) => e.value === 5).toggle,
          pickupAvTime50: true,
          pickupAvTime5After: btnInfos.find((e) => e.value === 1005).toggle,
          pickupAvTime60: true,
          pickupAvTime70: true,
        })
          .then((res) => {
            if (res.result === "SUCCESS") {
              this.setState({ confirmLoading: false });
              Modal.info({
                title: "적용 완료",
                content: "성공적으로 처리되었습니다.",
              });
            } else {
              this.setState({ confirmLoading: false });
              Modal.info({
                title: "적용 오류",
                content: "처리가 실패했습니다.",
              });
              console.log(res);
            }
          })
          .catch((e) => {
            this.setState({ confirmLoading: false });
            console.log(e);
            Modal.info({
              title: "적용 오류",
              content: "처리가 실패했습니다.",
            });
          });
      },
      onCancel: () => {
        console.log("task cancelled");
      },
      confirmLoading: this.state.confirmLoading,
    });
  };

  render() {
    const btnInfos = this.state.btnInfos;

    const { isOpen, close } = this.props;
    return (
      <React.Fragment>
        {isOpen ? (
          <React.Fragment>
            <div className="Dialog-overlay" onClick={close} />
            <div className="timeDelay-Dialog">
              <div className="timeDelay-content">
                <div className="timeDelay-title">호출설정</div>
                <img
                  onClick={close}
                  src={require("../../../img/login/close.png").default}
                  className="timeDelay-close"
                  alt="closeDialog"
                />
                <div className="timeDelay-inner">
                  <div className="timeDelay-box">
                    {btnInfos.map((btnInfo) => {
                      return (
                        <Button
                          key={btnInfo.value}
                          icon={
                            <ClockCircleOutlined
                              style={{ fontSize: 60, width: 100 }}
                            />
                          }
                          className={
                            !this.state.deliveryNotAvailable && btnInfo.toggle
                              ? "timeDelay-box-on"
                              : "timeDelay-box-off"
                          }
                          onClick={btnInfo.value > 1000 ? () => {
                            Modal.info({
                              title:"수정 불가",
                              content:"후5분, 후10분 옵션은 비활성화 할 수 없습니다."
                            })
                          } : () => this.handleToggle(btnInfo.value)}
                        >
                          <div style={{ fontSize: "1.3rem" }}>
                            {btnInfo.text}
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  <div style={{ margin: 20, width: 610 }}>
                    <div className="timeDelay-btn">
                      <div className="timeDelay-btn-01">배달불가</div>
                      <Checkbox
                        onChange={(e) => this.handleChange(e)}
                        style={{ marginTop: 11 }}
                      ></Checkbox>
                    </div>

                    <div className="timeDelay-btn-02">
                      <Button
                        className="tabBtn timeDelay-btn"
                        onClick={() => {
                          this.handleSubmit();
                        }}
                      >
                        적용
                      </Button>
                    </div>
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
    userGroup: state.login.loginInfo.userGroup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeDelayDialog);
