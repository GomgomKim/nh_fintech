import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Modal } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { httpGet, httpPost, httpUrl } from "../../../api/httpClient";
import "../../../css/modal.css";

class TimeDelayDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branchIdx: null,
      branchInfo: null,
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

  componentDidMount() {
    this.getBranch();
  }

  getBranch = () => {
    httpGet(httpUrl.getBranch, [this.props.branchIdx], {})
      .then((res) => {
        if (res.result === "SUCCESS" && res.data) {
          console.log(res);
          this.setState({ branchInfo: res.data }, () => {
            const branchInfo = this.state.branchInfo;
            this.setState({
              deliveryNotAvailable: !branchInfo.deliveryEnabled,
              btnInfos: [
                {
                  value: 5,
                  text: "5분",
                  toggle: branchInfo.pickupAvTime5,
                },
                {
                  value: 10,
                  text: "10분",
                  toggle: branchInfo.pickupAvTime10,
                },
                {
                  value: 15,
                  text: "15분",
                  toggle: branchInfo.pickupAvTime15,
                },
                {
                  value: 20,
                  text: "20분",
                  toggle: branchInfo.pickupAvTime20,
                },
                {
                  value: 30,
                  text: "30분",
                  toggle: branchInfo.pickupAvTime30,
                },
                {
                  value: 40,
                  text: "40분",
                  toggle: branchInfo.pickupAvTime40,
                },
                {
                  value: 1005,
                  text: "후 5분",
                  toggle: branchInfo.pickupAvTime5After,
                },
                {
                  value: 1010,
                  text: "후 10분",
                  toggle: branchInfo.pickupAvTime10After,
                },
              ],
            });
          });
        } else {
          console.log("branchInfo error");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
    console.log(this.props.branchIdx);
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
            if (res.result === "SUCCESS" && res.data === "SUCCESS") {
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

    const { close } = this.props;
    return (
      <>
        <div
          className="Dialog-overlay"
          onClick={() =>
            close({
              idx: this.props.branchIdx,
              deliveryEnabled: !this.state.deliveryNotAvailable,
              pickupAvTime10: btnInfos.find((e) => e.value === 10).toggle,
              pickupAvTime10After: btnInfos.find((e) => e.value === 1010)
                .toggle,
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
          }
        />
        <div className="timeDelay-Dialog">
          <div className="timeDelay-content">
            <div className="timeDelay-title">호출설정</div>
            <img
              onClick={() =>
                close({
                  idx: this.props.branchIdx,
                  deliveryEnabled: !this.state.deliveryNotAvailable,
                  pickupAvTime10: btnInfos.find((e) => e.value === 10).toggle,
                  pickupAvTime10After: btnInfos.find((e) => e.value === 1010)
                    .toggle,
                  pickupAvTime15: btnInfos.find((e) => e.value === 15).toggle,
                  pickupAvTime20: btnInfos.find((e) => e.value === 20).toggle,
                  pickupAvTime30: btnInfos.find((e) => e.value === 30).toggle,
                  pickupAvTime40: btnInfos.find((e) => e.value === 40).toggle,
                  pickupAvTime5: btnInfos.find((e) => e.value === 5).toggle,
                  pickupAvTime50: true,
                  pickupAvTime5After: btnInfos.find((e) => e.value === 1005)
                    .toggle,
                  pickupAvTime60: true,
                  pickupAvTime70: true,
                })
              }
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
                      onClick={
                        btnInfo.value > 1000
                          ? () => {
                              Modal.info({
                                title: "수정 불가",
                                content:
                                  "후5분, 후10분 옵션은 비활성화 할 수 없습니다.",
                              });
                            }
                          : () => this.handleToggle(btnInfo.value)
                      }
                    >
                      <div style={{ fontSize: "1.3rem" }}>{btnInfo.text}</div>
                    </Button>
                  );
                })}
              </div>

              <div style={{ margin: 20, width: 610 }}>
                <div className="timeDelay-btn">
                  <Checkbox
                    onChange={(e) => this.handleChange(e)}
                    checked={this.state.deliveryNotAvailable}
                  ></Checkbox>
                  <div className="timeDelay-btn-01">배달불가</div>
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  branchIdx: state.login.loginInfo.branchIdx,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeDelayDialog);
