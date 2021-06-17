import React, { Component } from "react";
import { Form, Input, Table, Button, Radio } from "antd";
import { httpUrl, httpPost } from "../../../api/httpClient";
import "../../../css/modal.css";
import SelectBox from "../../input/SelectBox";
import { searchBike } from "../../../lib/util/codeUtil";

const Search = Input.Search;
const today = new Date();

class SearchBikeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      searchBike: 0,
      dataIdxs: [],
      selectedRowKeys: [],
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    // this.getList(true);
  }

  // 가맹점 검색
  // onSearchFranchisee = (value) => {
  //   this.setState(
  //     {
  //       frName: value,
  //     },
  //     () => {
  //       this.getList();
  //     }
  //   );
  // };

  handleTableChange = (pagination) => {
    // console.log(pagination);
    const pager = {
      ...this.state.pagination,
    };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState(
      {
        pagination: pager,
      },
      () => this.getList()
    );
  };

  // getList = (isInit) => {
  //   // console.log(isInit)
  //   // console.log(this.state.franStatus);
  //   httpPost(httpUrl.franchiseList, [], {
  //     frName: this.state.frName,
  //     pageNum: this.state.pagination.current,
  //     userGroup: this.state.franGroup,
  //     userStatus: this.state.franStatus === 0 ? null : this.state.franStatus,
  //   }).then((result) => {
  //     // console.log('## result=' + JSON.stringify(result, null, 4))
  //     const pagination = {
  //       ...this.state.pagination,
  //     };
  //     pagination.current = result.data.currentPage;
  //     pagination.total = result.data.totalCount;
  //     this.setState({ list: result.data.franchises, pagination });
  //   });
  // };

  onSelectChange = (selectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    // console.log("selectedRowKeys.length :" + selectedRowKeys.length);

    // console.log(this.state.list)
    var cur_list = this.state.list;
    var overrideData = {};
    for (let i = 0; i < cur_list.length; i++) {
      var idx = cur_list[i].idx;
      if (selectedRowKeys.includes(idx)) overrideData[idx] = true;
      else overrideData[idx] = false;
    }
    // console.log(overrideData)

    var curIdxs = this.state.dataIdxs;
    curIdxs = Object.assign(curIdxs, overrideData);

    selectedRowKeys = [];
    for (let i = 0; i < curIdxs.length; i++) {
      if (curIdxs[i]) {
        // console.log("push  :" + i);
        selectedRowKeys = [...selectedRowKeys, i];
        // console.log(selectedRowKeys);
      }
    }
    // console.log(selectedRowKeys);
    this.setState({
      selectedRowKeys: selectedRowKeys,
      dataIdxs: curIdxs,
    });
  };

  onSubmit = () => {
    // console.log("click")
    if (this.props.callback) {
      this.props.callback(this.state.selectedRowKeys);
    }
    this.props.close();
  };

  onFrSelected = (data) => {
    // console.log(data)
    if (this.props.callback) {
      this.props.callback(data);
    }
    this.props.close();
  };

  render() {
    const columns = [
      {
        title: "번호",
        dataIndex: "bike_number",
        className: "table-column-center",
      },
      {
        title: "모델명",
        dataIndex: "model_name",
        className: "table-column-center",
      },
      {
        title: "제조사",
        dataIndex: "maker",
        className: "table-column-center",
      },
    ];

    const selectedRowKeys = this.state.selectedRowKeys;
    // console.log(selectedRowKeys);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const { close } = this.props;

    return (

      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="searchFranchise-Dialog">
          <div className="searchFranchise-content">
            <div className="searchFranchise-title">바이크조회</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="surcharge-close"
              alt="닫기"
            />

            <Form ref={this.formRef} onFinish={this.onSubmit}>
              <div className="layout">
                <div className="searchFranchiseWrapper">
                  <div className="searchFranchise-list">
                    <div className="inputBox inputBox-searchFranchise sub">
                      <SelectBox
                        value={searchBike[this.state.searchBike]}
                        code={Object.keys(searchBike)}
                        codeString={searchBike}
                        onChange={(value) => {
                          if (parseInt(value) !== this.state.searchBike) {
                            this.setState(
                              { searchBike: parseInt(value) },
                              () => this.getList()
                            );
                          }
                        }}
                      />

                      <Search
                        placeholder="입력해주세요"
                        className="searchFranchiseInput"
                        enterButton
                        allowClear
                        onSearch={this.onSearchBike}
                      />
                    </div>
                  </div>
                </div>

                <div className="dataTableLayout-01">
                  <Table
                    rowKey={(record) => record.idx}
                    dataSource={this.state.list}
                    columns={columns}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
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

export default SearchBikeDialog;
