import React, { Component } from "react";
import DaumPostcode from "react-daum-postcode";
import "../../../css/modal.css";

class PostCodeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 우편번호 검색 후 주소 클릭 시 실행될 함수, data callback 용
  handlePostCode = (data) => {
    // let fullAddress = data.address;
    // let extraAddress = "";

    // if (data.addressType === "R") {
    //   if (data.bname !== "") {
    //     extraAddress += data.bname;
    //   }
    //   if (data.buildingName !== "") {
    //     extraAddress +=
    //       extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
    //   }
    //   fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    // }
    // console.log(data)
    // console.log(fullAddress)
    // console.log(data.zonecode)
    if (this.props.data) {
      this.props.data(data);
      this.props.close();
    }
    if (this.props.onSelect) {
      this.props.onSelect(data);
      this.props.close();
    }
  };

  render() {
    const { isOpen, close } = this.props;

    const postCodeStyle = {
      display: "block",
      position: "absolute",
      top: "50%",
      width: "600px",
      height: "500px",
      padding: "7px",
      className: "desk"
    };

    return (
      <React.Fragment>
        {isOpen ? (
          <React.Fragment>
            <div className="postCode-Dialog-overlay" onClick={close} />
            <div className="postCode-Dialog">
              <DaumPostcode
                style={postCodeStyle}
                onComplete={this.handlePostCode}
              />
              <img
                onClick={close}
                src={require("../../../img/login/close.png").default}
                className="postCode-close"
                alt="close"
              />
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default PostCodeDialog;
