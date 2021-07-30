import { Button, Upload, Radio, Modal, Form, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { Component } from "react";
import { httpPost, httpUrl } from "../../../api/httpClient";
import { customAlert, customError } from "../../../api/Modals";
import FormItem from "antd/lib/form/FormItem";
import { contarctType, phoneAgency } from "../../../lib/util/codeUtil";
import SelectBox from "../../input/SelectBox";

import "../../../css/modal.css";

const imgUpload = {
  // action: { file: "C:/Users/PC01/Downloads/Telegram_Desktop" },
  listType: "picture",
  beforeUpload(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(resolve);
        };
      };
    });
  },
};

class RegistVANDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contarctType: 1,
      phoneAgency: 0,
      VANchecked: false,
      file: null,
    };
    this.formRef = React.createRef();
  }

  handleSubmit = () => {
    let self = this;
    Modal.confirm({
      title: "VAN 등록요청",
      content: <div>VAN 등록요청 하시겠습니까?</div>,
      okText: "확인",
      cancelText: "취소",
      onOk() {
        httpPost(httpUrl.FileUpload, [], {
          file: [],
          ...self.formRef.current.getFieldsValue(),
        })
          .then((res) => {
            if (res.result === "SUCCESS" && res.file === "SUCCESS") {
              customAlert("등록요청이 완료되었습니다.");
            }
            self.props.close();
          })
          .catch((error) => {
            customError(
              "등록 오류",
              "오류가 발생하였습니다. 다시 시도해 주십시오."
            );
          });
      },
    });
  };

  onCheckType = (e) => {
    this.setState({
      contarctType: e.target.value,
    });
  };

  handleChange = (e) => {
    this.setState({
      VANchecked: e.target.checked,
    });
  };

  render() {
    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="zone-dialog">
          <div className="VAN-content">
            <div className="timeDelay-title">VAN 등록요청</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              alt="close"
            />
            <div className="filtering-inner">
              <Form ref={this.formRef} onFinish={this.handleSubmit}>
                <div className="VAN-content-first-box">
                  <div className="mainTitle">유형</div>
                  <div>
                    <FormItem name="contarctType">
                      <Radio.Group
                        onChange={this.onCheckType}
                        value={this.state.contarctType}
                        defaultValue={1}
                      >
                        {Object.keys(contarctType)
                          .reverse()
                          .map((key) => {
                            return (
                              <Radio value={parseInt(key)}>
                                {contarctType[key]}
                              </Radio>
                            );
                          })}
                      </Radio.Group>
                    </FormItem>
                  </div>
                  {this.state.contarctType === 0 ? (
                    <div className="VAN-txt-sub">
                      *신규 사업자는 VAN등록을 한 적이 없어 카드사에 등록되지{" "}
                      <br />
                      않은 사업장입니다.
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {this.state.contarctType === 0 ? (
                  <div>
                    <div className="VAN-content-box right">
                      <div className="VAN-content-block">
                        <div>사업자 등록증</div>
                        <div>
                          <FormItem name="licenseImg">
                            <Upload {...imgUpload} method="post">
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                      <div className="VAN-content-block">
                        <div>영업신고증</div>
                        <div>
                          <FormItem name="licenseImg">
                            <Upload {...imgUpload} method="post">
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                      <div className="VAN-content-block">
                        <div>대표자 신분증</div>
                        <div>
                          <FormItem name="ownerImg">
                            <Upload {...imgUpload} method="post">
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                      <div className="VAN-content-block">
                        <div>대표자 핸드폰</div>
                        <div>
                          <FormItem name="ownerPhone">
                            <>
                              <SelectBox
                                value={phoneAgency[this.state.phoneAgency]}
                                code={Object.keys(phoneAgency)}
                                codeString={phoneAgency}
                                onChange={(value) => {
                                  if (
                                    parseInt(value) !== this.state.phoneAgency
                                  ) {
                                    this.setState({
                                      phoneAgency: parseInt(value),
                                    });
                                  }
                                }}
                              />
                            </>
                          </FormItem>
                        </div>
                      </div>
                    </div>

                    <div className="VAN-content-box">
                      <div className="VAN-content-block">
                        <div>통장 사본</div>
                        <div>
                          <FormItem name="bankbookImg">
                            <Upload {...imgUpload} method="post">
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                      <div className="VAN-content-block">
                        <div>매장 외부 사진</div>
                        <div>
                          <FormItem name="bankbookImg">
                            <Upload {...imgUpload} method="post">
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                      <div className="VAN-content-block">
                        <div>매장 내부 사진</div>
                        <div>
                          <FormItem name="bankbookImg">
                            <Upload {...imgUpload} method="post">
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                      <div className="VAN-content-block">
                        <div>법인 사업자</div>
                        <div>
                          <FormItem name="ownerImg">
                            <Checkbox
                              onChange={(e) => this.handleChange(e)}
                              checked={this.state.VANchecked}
                            />
                          </FormItem>
                        </div>
                      </div>
                    </div>
                    {this.state.VANchecked ? (
                      <>
                        <div className="VAN-content-first-box" />
                        <div className="VAN-content-box right">
                          <div className="VAN-content-block">
                            <div>법인등기부등본</div>
                            <div>
                              <FormItem name="bankbookImg">
                                <Upload {...imgUpload} method="post">
                                  <Button icon={<UploadOutlined />}>
                                    Upload
                                  </Button>
                                </Upload>
                              </FormItem>
                            </div>
                          </div>
                          <div className="VAN-content-block">
                            <div>법인인감증명서</div>
                            <div>
                              <FormItem name="bankbookImg">
                                <Upload {...imgUpload} method="post">
                                  <Button icon={<UploadOutlined />}>
                                    Upload
                                  </Button>
                                </Upload>
                              </FormItem>
                            </div>
                          </div>
                          <div className="VAN-content-block">
                            <div>주주명부</div>
                            <div>
                              <FormItem name="bankbookImg">
                                <Upload {...imgUpload} method="post">
                                  <Button icon={<UploadOutlined />}>
                                    Upload
                                  </Button>
                                </Upload>
                              </FormItem>
                            </div>
                          </div>
                        </div>
                        <div className="VAN-content-box">
                          <div className="VAN-content-block">
                            <div>사용인감계(선택)</div>
                            <div>
                              <FormItem name="bankbookImg">
                                <Upload {...imgUpload} method="post">
                                  <Button icon={<UploadOutlined />}>
                                    Upload
                                  </Button>
                                </Upload>
                              </FormItem>
                            </div>
                          </div>
                          <div className="VAN-content-block">
                            <div>본사 유선</div>
                            <div>
                              <FormItem name="bankbookImg">
                                <Upload {...imgUpload} method="post">
                                  <Button icon={<UploadOutlined />}>
                                    Upload
                                  </Button>
                                </Upload>
                              </FormItem>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="VAN-btn">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="zone-btn"
                      >
                        요청하기
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="VAN-content-box">
                      <div className="VAN-content-block">
                        <div>사업자 등록증</div>
                        <div>
                          <FormItem name="licenseImg">
                            <Upload {...imgUpload} method="post">
                              <Button
                                onClick={this.onClickHandler}
                                icon={<UploadOutlined />}
                              >
                                Upload
                              </Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                      <div className="VAN-content-block">
                        <div>대표자 신분증</div>
                        <div>
                          <FormItem name="ownerImg">
                            <Upload {...imgUpload} method="post">
                              <Button
                                onClick={this.onClickHandler}
                                icon={<UploadOutlined />}
                              >
                                Upload
                              </Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                      <div className="VAN-content-block">
                        <div>통장 사본</div>
                        <div>
                          <FormItem name="bankbookImg">
                            <Upload {...imgUpload} method="post">
                              <Button
                                onClick={this.onClickHandler}
                                icon={<UploadOutlined />}
                              >
                                Upload
                              </Button>
                            </Upload>
                          </FormItem>
                        </div>
                      </div>
                    </div>
                    <div className="VAN-btn">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="zone-btn"
                      >
                        요청하기
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RegistVANDialog;
