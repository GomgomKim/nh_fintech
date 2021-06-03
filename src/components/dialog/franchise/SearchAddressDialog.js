import React, { Component } from "react";
import { Form, Input, Table, Button, Select, Radio, Modal } from "antd";
import {
  httpUrl,
  httpGet,
  httpPost,
  httpDelete,
} from "../../../api/httpClient";
import PostCodeDialog from "../common/PostCodeDialog";
import SelfAddressDialog from "../franchise/SelfAddressDialog";
import { addType } from "../../../lib/util/codeUtil";
import { customError } from "../../../api/Modals";

import "../../../css/rider.css";

const FormItem = Form.Item;

const Option = Select.Option;
const Search = Input.Search;
const today = new Date();

class SearchAddressDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        total: 0,
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

  setDate = (date) => {
    // console.log(date)
  };

  handleTableChange = (pagination) => {
    // console.log(pagination)
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
        if (res.result === "SUCCESS" && res.data) {
          this.setState({
            list: res.data.addrAptBranches,
          });
        }
      })
      .catch((e) => {});
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

  // 우편번호 - 주소 저장
  getAddr = (addrData) => {
    console.log(addrData);
    // console.log(addrData.address)
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
      if (res.result === "SUCCESS" && result.addresses.length > 0) {
        this.setState({
          latitude: result.addresses[0].y,
          longitude: result.addresses[0].x,
        });
      } else {
        customError(
          "위치 반환 오류",
          "위치 데이터가 존재하지 않습니다. 관리자에게 문의하세요."
        );
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
    httpPost(
      httpUrl.createAddrApt,
      [],
      Object.assign(formData, {
        addrType: this.state.RegistAddType,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      })
    )
      .then((res) => {
        if (res.result === "SUCCESS") {
          Modal.info({
            title: "등록성공",
            content: "주소 등록에 성공했습니다.",
          });
          this.formRef.current.resetFields();
          this.getList();
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
    console.log(idx);
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

  // 라디오
  onChangeRegistAddType = (e) => {
    this.setState({ RegistAddType: e.target.value }, () => {});
  };

  onChangeSelectAddType = (e) => {
    this.setState({ selectAddType: e.target.value }, () => {});
  };

  render() {
    const onChange = (e) => {
      // console.log(e.target.value)
      this.setState(
        {
          addressType: e.target.value,
        },
        () => {}
      );
    };

    const columns = [
      {
        title: "종류",
        dataIndex: "addrType",
        className: "table-column-center",
        width: "20%",
        render: (data) => <div>{addType[data]}</div>,
      },
      {
        title: "등록 주소 목록",
        dataIndex: "name",
        className: "table-column-center",
        width: "30%",
        render: (data) => <div>{data}</div>,
      },
      {
        title: "도로명주소",
        dataIndex: "addr1",
        className: "table-column-center",
        width: "30%",
        render: (data) => <div>{data}</div>,
      },
      {
        title: "삭제",
        dataIndex: "delete",
        className: "table-column-center",
        width: "20%",
        render: (data, row) => (
          <div className="pwChange-btn">
            <Button className="tabBtn" onClick={() => this.onDelete(row.idx)}>
              삭제
            </Button>
          </div>
        ),
      },
    ];

    const { close, data } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="serchAddress-Dialog">
          <div className="serchAddress-content">
            <div className="serchAddress-title">주소 검색 관리</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="surcharge-close"
              alt=""
            />
            <Form ref={this.formRef} onFinish={this.handleSubmit}>
              <div className="layout">
                <div className="serchAddressWrapper">
                  <div className="searchAddress-name">주소 등록</div>
                  <div className="contentbox">
                    <div className="contentBlock frist">
                      <div className="mainTitle">유형</div>

                      <Radio.Group
                        className="searchRequirement"
                        onChange={this.onChangeRegistAddType}
                        value={this.state.RegistAddType}
                      >
                        {addType.map((v, i) => {
                          if (i === 0) {
                            return;
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
                        className="override-input addrBtn"
                      >
                        우편번호 검색
                      </Button>
                    </div>

                    <div className="contentBlock">
                      <div className="mainTitle">지번주소</div>

                      <FormItem name="addr3" className="selectItem">
                        <Input
                          placeholder="지번주소를 입력해 주세요."
                          disabled
                          className="override-input sub"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">상세주소</div>
                      <FormItem name="addr2" className="selectItem">
                        <Input
                          placeholder="상세주소를 입력해 주세요."
                          className="override-input sub"
                        />
                      </FormItem>
                    </div>
                    <div className="contentBlock">
                      <div className="mainTitle">건물이름</div>
                      <FormItem name="name" className="selectItem">
                        <Input
                          placeholder="건물이름을 입력해 주세요."
                          className="override-input sub"
                        />
                      </FormItem>
                    </div>
                  </div>

                  <div className="searchAddress-btn">
                    {this.state.selfAddOpen && (
                      <SelfAddressDialog close={this.closeSelfAdd} />
                    )}
                    <Button
                      type="primary"
                      htmlType="submit"
                      // onClick={() => this.handleSubmit()}
                    >
                      등록하기
                    </Button>
                  </div>
                </div>

                <div className="searchAddress-name">주소 검색</div>

                <div className="contentBlock second">
                  <div className="contentBlock">
                    <div className="mainTitle">유형</div>

                    <Radio.Group
                      className="searchRequirement"
                      onChange={this.onChangeSelectAddType}
                      value={this.state.selectAddType}
                    >
                      {addType.map((v, i) => {
                        if (i === 0) {
                          return;
                        }
                        return <Radio value={i}>{v}</Radio>;
                      })}
                    </Radio.Group>
                  </div>

                  <div className="contentBlock bottom">
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
                </div>
                <div className="dataTableLayout-01">
                  <Table
                    dataSource={this.state.list}
                    columns={columns}
                    pagination={this.state.pagination}
                    onChange={this.state.handleTableChange}
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
