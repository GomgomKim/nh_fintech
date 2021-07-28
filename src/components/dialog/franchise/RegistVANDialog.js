import { Button, Upload, Search, Modal } from "antd";
import { ThunderboltFilled, UploadOutlined } from "@ant-design/icons";
import React, { Component } from "react";

import "../../../css/modal.css";

class RegistVANDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      licenseList: [
        // {
        //   uid: "-1",
        //   name: "xxx.png",
        //   status: "done",
        //   url: "http://www.baidu.com/xxx.png",
        // },
      ],
      ownerIdList: [],
      bankbookList: [],
      newBusinessMan: 0,
    };
    this.formRef = React.createRef();
  }
  licenseHandleChange = (info) => {
    let licenseList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    licenseList = licenseList.slice(-5);

    // 2. Read from response and show file link
    licenseList = licenseList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ licenseList });
  };
  ownerHandleChange = (info) => {
    let ownerIdList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    ownerIdList = ownerIdList.slice(-5);

    // 2. Read from response and show file link
    ownerIdList = ownerIdList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ ownerIdList });
  };
  bankHandleChange = (info) => {
    let bankbookList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    bankbookList = bankbookList.slice(-5);

    // 2. Read from response and show file link
    bankbookList = bankbookList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ bankbookList });
  };
  // 가맹점 검색
  onSearchFranchisee = (value) => {
    this.setState(
      {
        frName: value,
        pagination: {
          total: 0,
          current: 1,
          pageSize: this.state.pagination.pageSize,
        },
      },
      () => {
        this.getList();
      }
    );
  };

  render() {
    const { close } = this.props;

    const licenseImgUpload = {
      // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      onChange: this.licenseHandleChange,
      multiple: true,
    };
    const ownerImgUpload = {
      // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      onChange: this.ownerHandleChange,
      multiple: true,
    };
    const bankImgUpload = {
      // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      onChange: this.bankHandleChange,
      multiple: true,
    };
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
              <div>
                <Button>신규 사업자</Button>
                <Button>기존 사업자</Button>
              </div>

              <div className="VAN-txt-sub">
                * 신규 사업자는 VAN등록을 한 적이 없어 카드사에 등록되지 않은
                사업장입니다.
              </div>

              <div className="VAN-content-box">
                <div>
                  <div className="mainTitle">사업자 등록증</div>
                  <div className="VAN-upload">
                    <Upload
                      {...licenseImgUpload}
                      fileList={this.state.licenseList}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </div>
                </div>
                <div>
                  <div className="mainTitle">대표자 신분증</div>
                  <div className="VAN-upload">
                    <Upload
                      {...ownerImgUpload}
                      fileList={this.state.ownerIdList}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </div>
                </div>
                <div>
                  <div className="mainTitle">통장 사본</div>
                  <div className="VAN-upload">
                    <Upload
                      {...bankImgUpload}
                      fileList={this.state.bankbookList}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RegistVANDialog;
