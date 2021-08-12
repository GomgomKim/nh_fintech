/*global kakao*/
import { Button, Form, Input, Modal, Radio, Table } from "antd";
import React, { Component } from "react";
import {
  httpDelete,
  httpGet,
  httpPost,
  httpUrl
} from "../../../api/httpClient";
import { customError } from "../../../api/Modals";
import "../../../css/rider.css";
import { addType } from "../../../lib/util/codeUtil";
import PostCodeDialog from "../common/PostCodeDialog";
import SelfAddressDialog from "../franchise/SelfAddressDialog";

const FormItem = Form.Item;
const Search = Input.Search;

class SearchAddressDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        total: 10,
        current: 1,
        pageSize: 5,
      },
      list: [],

      // createAptAddr params
      // addr1:'',
      // addr2:'',
      // addr3:'',
      RegistAddType: 1,
      latitude: 0,
      longitude: 0,
      name: "",

      // getList params
      selectAddType: 1,
      searchAddress: "",

      selfAddOpen: false,
      isPostCodeOpen: false,
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    this.getList();
  }

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
    httpGet(
      httpUrl.getAddrAptList,
      [
        this.state.selectAddType,
        this.state.pagination.current,
        this.state.pagination.pageSize,
        this.state.searchAddress,
      ],
      {}
    )
      .then((res) => {
        console.log(res);
        if (res.result === "SUCCESS" && res.data) {
          this.setState({
            list: res.data.addrAptBranches,
            pasination: {
              ...this.state.pasination,
              total: res.data.totalPage,
              current: res.data.currentPage,
            },
          });
        }
      })
      .catch((e) => { });
  };

  // 우편번호 검색
  openPostCode = () => {
    this.setState({ isPostCodeOpen: true });
  };

  closePostCode = () => {
    this.setState({ isPostCodeOpen: false });
  };

  openSelfAdd = () => {
    this.setState({ selfAddOpen: true });
  };
  closeSelfAdd = () => {
    this.setState({ selfAddOpen: false });
  };

  addressSearchKakao = (address) => {
    const geocoder = new kakao.maps.services.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = [result[0].y, result[0].x];
          resolve(coords);
        } else {
          reject(status);
        }
      });
    });
  };

  // 우편번호 - 주소 저장
  getAddr = (addrData) => {
    if (addrData.apartment === "Y") {
      this.setState({
        RegistAddType: 1,
      });
      this.formRef.current.setFieldsValue({
        name: addrData.buildingName,
      });
    }
    this.formRef.current.setFieldsValue({
      addr1: addrData.roadAddress, // 도로명 주소
      addr3:
        addrData.jibunAddress === ""
          ? addrData.autoJibunAddress
          : addrData.jibunAddress, // 지번
    });

    // 좌표변환
    httpGet(httpUrl.getGeocode, [addrData.roadAddress], {}).then((res) => {
      let result = JSON.parse(res.data.json);
      if (res.result === "SUCCESS" && result.meta.totalCount !== 0) {
        this.setState({
          latitude: result.addresses[0].y,
          longitude: result.addresses[0].x,
        });
      } else {
        this.addressSearchKakao(addrData.roadAddress)
          .then((res) => {
            const [lat, lng] = res;
            this.setState({
              latitude: lat,
              longitude: lng,
            });
          })
          .catch((e) => {
            customError(
              "위치 반환 오류",
              "위치 데이터가 존재하지 않습니다. 관리자에게 문의하세요."
            );
            throw e;
          });
      }
    });
  };

  // 주소 검색
  onSearchAddress = (value) => {
    this.setState(
      {
        searchAddress: value,
      },
      () => {
        this.getList();
      }
    );
  };

  handleSubmit = () => {
    const formData = this.formRef.current.getFieldsValue();
    var self = this;
    httpPost(
      httpUrl.createAddrApt,
      [],
      Object.assign(formData, {
        addrType: this.state.RegistAddType,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        addr2: "",
        status: 1,
      })
    )
      .then((res) => {
        if (res.result === "SUCCESS") {
          Modal.info({
            title: "등록성공",
            content: "주소 등록에 성공했습니다.",
          });
          self.formRef.current.resetFields();
          self.setState(
            {
              pagination: {
                ...self.state.pagination,
                current: 1,
              },
            },
            () => self.getList()
          );
        }
      })
      .catch((e) => {
        Modal.info({
          title: "등록실패",
          content: "등록에 실패했습니다.",
        });
        throw e;
      });
  };

  onDelete = (idx) => {
    httpDelete(httpUrl.deleteAddrApt, [], { idx: idx })
      .then((res) => {
        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
          Modal.info({
            title: "삭제성공",
            content: "주소삭제에 성공했습니다.",
          });
          this.getList();
        } else {
          Modal.info({
            title: "삭제실패",
            content: "주소삭제에 실패했습니다.",
          });
        }
      })
      .catch((e) => {
        Modal.info({
          title: "삭제실패",
          content: "주소삭제에 실패했습니다.",
        });
        throw e;
      });
  };

  onChangeStatus = (row) => {
    console.log({
      ...row,
      status: !row.status,
    });
    httpPost(httpUrl.updateAddrApt, [], {
      ...row,
      status: row.status === 0 ? 1 : 0,
    })
      .then((res) => {
        console.log(res);
        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
          Modal.info({
            title: "변경 성공",
            content: "상태변경에 성공했습니다.",
          });
          this.getList();
        } else {
          Modal.warn({
            title: "변경실패",
            conten: "관리자에게 문의하세요",
          });
        }
      })
      .catch((e) => {
        console.log(e);
        Modal.warn({
          title: "변경실패",
          conten: "관리자에게 문의하세요",
        });
        throw e;
      });
  };

  // 라디오
  onChangeRegistAddType = (e) => {
    this.setState({ RegistAddType: e.target.value }, () => { });
  };

  onChangeSelectAddType = (e) => {
    this.setState({ selectAddType: e.target.value }, () => { });
  };

  render() {
    // const onChange = (e) => {
    //   this.setState(
    //     {
    //       addressType: e.target.value,
    //     },
    //     () => { }
    //   );
    // };

    const columns = [
      {
        title: "종류",
        dataIndex: "addrType",
        className: "table-column-center mobile",
        render: (data) => <div>{addType[data]}</div>,
      },
      {
        title: "상세정보",
        dataIndex: "name",
        className: "table-column-center mobile",
        render: (data, row) => (
          <div className="status-box">
            <p>{row.name}</p>
            주소: {row.addr1}
            <br />
            <Button onClick={() => this.onChangeStatus(row)}>
              {data ? "배송가능" : "배송불가"}
            </Button>
            <Button className="tabBtn" onClick={() => this.onDelete(row.idx)}>
              삭제
            </Button>
          </div>
        )

      },

      {
        title: "종류",
        dataIndex: "addrType",
        className: "table-column-center desk",
        // width: "20%",
        render: (data) => <div>{addType[data]}</div>,
      },
      {
        title: "이름",
        dataIndex: "name",
        className: "table-column-center desk",
        // width: "30%",
        render: (data) => <div>{data}</div>,
      },
      {
        title: "도로명주소",
        dataIndex: "addr1",
        className: "table-column-center desk",
        // width: "30%",
        render: (data) => <div>{data}</div>,
      },
      {
        title: "배송가능여부",
        dataIndex: "status",
        className: "table-column-center desk",
        // width: "30%",
        render: (data, row) => (
          <Button onClick={() => this.onChangeStatus(row)}>
            {data ? "배송가능" : "배송불가"}
          </Button>
        ),
      },
      {
        title: "삭제",
        dataIndex: "delete",
        className: "table-column-center desk",
        // width: "20%",
        render: (data, row) => (
          <div className="pwChange-btn">
            <Button className="tabBtn" onClick={() => this.onDelete(row.idx)}>
              삭제
            </Button>
          </div>
        ),
      },
    ];

    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="searchAddress-Dialog">
          <div className="searchAddress-content">
            <div className="searchAddress-title">주소 검색 관리</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="surcharge-close"
              alt=""
            />
            <Form ref={this.formRef} onFinish={this.handleSubmit}>
              <div className="layout">
                <div className="searchAddressWrapper">
                  <div className="searchAddress-name desk">주소 등록</div>
                  <div className="contentbox">
                    <div className="contentBlock frist">
                      <div className="mainTitle desk">유형</div>
                      <div className="searchAddress-name mobile">주소 등록</div>

                      <Radio.Group
                        className="searchRequirement"
                        onChange={this.onChangeRegistAddType}
                        value={this.state.RegistAddType}
                      >
                        {addType.map((v, i) => {
                          if (i === 0) {
                            return <></>;
                          }
                          return <Radio value={i}>{v}</Radio>;
                        })}
                      </Radio.Group>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">주소</div>
                      <FormItem name="addr1" className="selectItem">
                        <Input
                          placeholder="주소를 입력해 주세요."
                          disabled
                          className="override-input sub short"
                        />
                      </FormItem>
                      <PostCodeDialog
                        data={(addrData) => this.getAddr(addrData)}
                        isOpen={this.state.isPostCodeOpen}
                        close={this.closePostCode}
                      />
                      <Button
                        onClick={this.openPostCode}
                        className="override-input addrBtn desk"
                      >
                        우편번호 검색
                      </Button>
                      <Button
                        onClick={this.openPostCode}
                        className="override-input addrBtn mobile"
                      >
                        검색
                      </Button>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle desk">지번주소</div>
                      <div className="mainTitle mobile">지번</div>

                      <FormItem name="addr3" className="selectItem">
                        <Input
                          placeholder="지번주소를 입력해 주세요."
                          disabled
                          className="override-input sub"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">이름</div>
                      <FormItem name="name" className="selectItem">
                        <Input
                          placeholder="이름을 입력해 주세요."
                          className="override-input sub"
                        />
                      </FormItem>
                    </div>
                    {/* <div className="contentBlock" style={{ display: "hidden" }}>
                      <div className="mainTitle">상세주소</div>
                      <FormItem
                        defaultValue={""}
                        name="addr2"
                        className="selectItem"
                      >
                        <Input
                          placeholder="상세주소를 입력해 주세요."
                          className="override-input sub"
                        />
                      </FormItem>
                    </div> */}
                  </div>

                  <div className="searchAddress-btn">
                    {this.state.selfAddOpen && (
                      <SelfAddressDialog close={this.closeSelfAdd} />
                    )}
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: 100, backgroundColor: "#1890ff" }}
                    // onClick={() => this.handleSubmit()}
                    >
                      등록하기
                    </Button>
                  </div>
                </div>

                <div className="searchAddress-name desk">주소 검색</div>

                <div className="contentBlock second">
                  <div className="contentBlock">
                    <div className="mainTitle desk">유형</div>
                    <div className="searchAddress-name mobile">주소 검색</div>

                    <Radio.Group
                      className="searchRequirement"
                      onChange={this.onChangeSelectAddType}
                      value={this.state.selectAddType}
                    >
                      {addType.map((v, i) => {
                        if (i === 0) {
                          return <></>;
                        }
                        return <Radio value={i}>{v}</Radio>;
                      })}
                    </Radio.Group>
                  </div>

                  <div className="contentBlock bottom desk">
                    <div className="mainTitle">주소</div>
                    <Search
                      placeholder="주소를 검색해 주세요."
                      enterButton
                      allowClear
                      onSearch={(value) => this.onSearchAddress(value)}
                      style={{
                        width: 470,
                        marginLeft: 20,
                        verticalAlign: "middle",
                      }}
                    />
                  </div>
                  <div className="contentBlock bottom mobile">
                    <div className="mainTitle">주소</div>
                    <Search
                      placeholder="주소를 검색해 주세요."
                      enterButton
                      allowClear
                      onSearch={(value) => this.onSearchAddress(value)}
                      style={{
                        width: 215,
                        marginLeft: 20,
                        verticalAlign: "middle",
                      }}
                    />
                  </div>
                </div>
                <div className="dataTableLayout-01">
                  <Table
                    dataSource={this.state.list}
                    columns={columns}
                    pagination={this.state.pagination}
                    onChange={(pagination) =>
                      this.handleTableChange(pagination)
                    }
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchAddressDialog;
