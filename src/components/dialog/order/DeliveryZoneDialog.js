import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import React, { Component } from "react";
import { Marker, NaverMap, Polygon } from "react-naver-maps";
import { httpGet, httpPost, httpUrl } from "../../../api/httpClient";
import "../../../css/modal.css";

const FormItem = Form.Item;

class DeliveryZoneDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navermaps: true,
      mapLat: null,
      mapLng: null,

      deliveryZone: [],
      prevDeliveryZone: [],
      customDeliveryZone: [
        {
          code: 10000,
          text: "풍무동326",
          toggle: false,
          coords: [],
        },
      ],
      selectMenu: 0,
      mapCenter: {
        lat: 37.643623625321474,
        lng: 126.66509442649551,
      },

      // 신규 금지 구역 parameter
      paths: [],
      viewPaths: [],
      inputName: "",
    };
    this.navermaps = window.naver.maps;
  }

  componentDidMount() {
    this.state.deliveryZone.forEach((value) => {
      value.toggle = true;
    });
    this.getList();
  }

  getList = () => {
    httpGet(httpUrl.getAddrBranch, [1, 1000], {})
      .then((res) => {
        if (res.result === "SUCCESS") {
          this.setState({
            deliveryZone: res.data.addrBranches,
            prevDeliveryZone: res.data.addrBranches,
          });
        }
      })
      .catch((e) => {
        throw e;
      });
  };

  handleUpdate = async () => {
    let failed = [];
    for (let i = 0; i < this.state.deliveryZone.length; i++) {
      console.log(i);
      console.log(this.state.deliveryZone[i].canDeliver);
      console.log(this.state.prevDeliveryZone[i].canDeliver);
      // if (
      //   this.state.deliveryZone[i].canDeliver !==
      //   this.state.prevDeliveryZone[i].canDeliver
      // ) {
      const res = await httpPost(httpUrl.updateAddrBranch, [], {
        canDeliver: this.state.deliveryZone[i].canDeliver,
        idx: this.state.deliveryZone[i].idx,
      });

      console.log("res");
      console.log(res);

      if (res.result !== "SUCCESS") {
        failed.push(this.state.deliveryZone[i].eupMyeonDong);
      }
      // }
    }
    if (failed.length === 0) {
      Modal.info({
        title: "적용 성공",
        content: "배송가능지역 적용에 성공했습니다.",
      });
    } else {
      Modal.info({
        title: "적용 실패",
        content: `${failed} 지역의 적용에 실패했습니다.`,
      });
    }

    // this.getgetList();
  };

  addPath = (e) => {
    let newPath = this.state.paths;
    newPath.push(new this.navermaps.LatLng(e.coord.y, e.coord.x));
    this.setState({ paths: newPath }, () => console.log(this.state.paths));
  };

  handleToggle = (index) => {
    let newState = [...this.state.deliveryZone];
    newState[index].canDeliver = !newState[index].canDeliver;
    this.setState({ deliveryZone: newState }, () => {
      console.log(this.state.deliveryZone);
      console.log(this.state.prevDeliveryZone);
    });
  };

  registCustomZone = () => {
    const formData = {
      code:
        this.state.customDeliveryZone[this.state.customDeliveryZone.length - 1]
          .code + 1,
      text: this.state.inputName,
      toggle: false,
      coords: this.state.paths,
    };

    this.setState(
      {
        customDeliveryZone: this.state.customDeliveryZone.concat(formData),
      },
      () => this.setState({ inputName: "", paths: [] })
    );
  };

  handleToggleCustom = (index) => {
    let newState = this.state.customDeliveryZone;
    newState[index].toggle = !newState[index].toggle;

    // if (newState[index].toggle) {
    //   let newViewPath = this.state.viewPaths;
    //   newViewPath.push(newState[index].coords);
    //   this.setState({ customDeliveryZone: newState, viewPaths: newViewPath });
    // } else {
    //   this.setState({ customDeliveryZone: newState, viewPaths: [] });
    // }

    // if (this.state.deleteMode) {
    //   const self = this;
    //   Modal.confirm({
    //     onOk: () => {
    //       self.setState({
    //         customDeliveryZone: self.state.customDeliveryZone.filter(
    //           (item) =>
    //             !(item.code === self.state.customDeliveryZone[index].code)
    //         ),
    //         viewPaths: self.state.viewPaths.filter(
    //           (item) =>
    //             !(item.code === self.state.customDeliveryZone[index].code)
    //         ),
    //       });
    //       return;
    //     },
    //   });
    // } else {
    this.setState(
      {
        customDeliveryZone: newState,
        viewPaths: newState[index].toggle
          ? this.state.viewPaths.concat(this.state.customDeliveryZone[index])
          : this.state.viewPaths.filter(
              (item) =>
                !(item.code === this.state.customDeliveryZone[index].code)
            ),
      },
      () => {
        console.log("viewpath");
        console.log(this.state.viewPaths);
      }
    );
    // }
  };

  render() {
    const lat = 37.643623625321474;
    const lng = 126.66509442649551;

    const navermaps = window.naver.maps;
    const { isOpen, close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />

        <div className="zone-dialog">
          <div className="zone-content">
            <div> 배송가능지역 </div>

            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              alt="close"
            />

            <div className="zone-inner">
              <div className="inner-left">
                <div className="zone-title">
                  배송가능지역
                  <Button
                    onClick={() => this.handleUpdate()}
                    style={{ float: "right" }}
                  >
                    적용하기
                  </Button>
                </div>
                <div>
                  {this.state.deliveryZone.map((obj, idx) => (
                    <div key={obj.idx} className="zone-box">
                      <div
                        className={
                          obj.canDeliver ? "zone-el-active" : "zone-el"
                        }
                        onClick={() => this.handleToggle(idx)}
                      >
                        {obj.eupMyeonDong}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="zone-title">
                  특정 구역
                  <Button
                    checked={this.state.deleteMode}
                    className="radio-btn"
                    onClick={() => {
                      Modal.confirm({
                        title: "삭제",
                        content: `삭제하시겠습니까?`,
                        onOk: () => {
                          this.setState({
                            customDeliveryZone:
                              this.state.customDeliveryZone.filter(
                                (item) => !item.toggle
                              ),
                            viewPaths: [],
                          });
                        },
                      });
                    }}
                  >
                    삭제하기
                  </Button>
                </div>
                <div className="zone-box-wrap">
                  {this.state.customDeliveryZone.map((obj, idx) => (
                    <div key={obj.code} className="zone-box">
                      <div
                        className={obj.toggle ? "zone-el-active" : "zone-el"}
                        onClick={() => this.handleToggleCustom(idx)}
                      >
                        {obj.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="zone-title">새 구역 등록</div>
                <div>
                  <Input
                    value={this.state.inputName}
                    onChange={(e) =>
                      this.setState({ inputName: e.target.value })
                    }
                    placeholder="새 구역 이름을 입력해주세요."
                    className="zone-input"
                  />
                </div>
                <div>
                  <Button
                    type="primary"
                    onClick={() => this.registCustomZone()}
                    //   htmlType="submit"
                    className="zone-btn"
                  >
                    등록하기
                  </Button>
                </div>
              </div>

              <div className="inner-right">
                {navermaps && (
                  <NaverMap
                    defaultZoom={14}
                    center={this.state.mapCenter}
                    style={{
                      width: "550px",
                      height: "600px",
                      display: "inline-block",
                    }}
                    onClick={(e) => this.addPath(e)}
                  >
                    {this.state.paths.length > 0 && (
                      <Polygon
                        paths={this.state.paths}
                        fillColor={"#ff0000"}
                        fillOpacity={0.3}
                        strokeColor={"#ff0000"}
                        strokeOpacity={0.6}
                        strokeWeight={3}
                      />
                    )}
                    {this.state.viewPaths.length > 0 &&
                      this.state.viewPaths.map((elem) => {
                        let sumX = 0;
                        let sumY = 0;

                        elem.coords.map((el) => {
                          sumX += el.x;
                          sumY += el.y;
                        });
                        const meanX = sumX / elem.coords.length;
                        const meanY = sumY / elem.coords.length;

                        const position = navermaps.LatLng(meanY, meanX);

                        return (
                          <>
                            <Polygon
                              paths={elem.coords}
                              fillColor={"#ff0000"}
                              fillOpacity={0.3}
                              strokeColor={"#ff0000"}
                              strokeOpacity={0.6}
                              strokeWeight={3}
                            />
                            <Marker
                              position={position}
                              icon={{
                                content: [
                                  '<div style="background-color: black; color: #fddc00; padding: 10px 20px; border-radius: 5px; font-size:16px; transform:translate(-50%,-50%);">' +
                                    elem.text +
                                    "</div>",
                                ].join(""),
                              }}
                              title={elem.text}
                            />
                          </>
                        );
                      })}
                    <Button
                      type="primary"
                      icon={<ArrowLeftOutlined />}
                      style={{ zIndex: 1 }}
                      onClick={() => {
                        this.setState(
                          {
                            paths: this.state.paths.slice(
                              0,
                              this.state.paths.length - 1
                            ),
                          },
                          () => {
                            if (this.state.paths.length === 1) {
                              this.setState({
                                paths: [],
                              });
                            }
                          }
                        );
                      }}
                    />
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      style={{ zIndex: 1 }}
                      onClick={() => this.setState({ paths: [] })}
                    />
                  </NaverMap>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DeliveryZoneDialog;
