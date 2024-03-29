import { Button, Form, Input, Radio, Table } from "antd";
import React, { Component } from "react";
import { httpGet, httpUrl } from "../../../api/httpClient";
import "../../../css/modal.css";
import {
  riderLevelText,
  tableStatusString,
  userGroupString
} from "../../../lib/util/codeUtil";
import SelectBox from "../../input/SelectBox";

const Search = Input.Search;
const today = new Date();

class SearchRiderDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: today,
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      addressType: 0,
      selectedRowKeys: [],
      isMulti: false,

      // data param
      riderLevel: [],
      searchName: "",
      userStatus: 0,
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    this.getList(true);
  }

  // 라이더 검색
  onSearchRider = (value) => {
    this.setState(
      {
        searchName: value,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      () => {
        this.getList();
      }
    );
  };

  handleTableChange = (pagination) => {
    console.log(pagination);
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

  getList = (isInit) => {
    const pageNum = this.state.pagination.current;
    const userStatus = this.state.userStatus === 0 ? "" : this.state.userStatus;
    const searchName = this.state.searchName;
    const riderLevel = this.props.teamManagerOnly
      ? [3]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const riderStatus = this.props.availableOnly ? 1 : "";

    httpGet(
      httpUrl.riderList,
      [10, pageNum, searchName, userStatus, riderLevel, riderStatus],
      {}
    ).then((result) => {
      console.log("## nnbox result=" + JSON.stringify(result, null, 4));
      const pagination = { ...this.state.pagination };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.currentCount;
      this.setState({
        list: result.data.riders,
        pagination,
      });

      // mount될 때 data idx 배열 초기화
      if (isInit && result.data.riders.length > 0) {
        // console.log(result.data.franchises[0].idx)
        var totCnt = result.data.riders[0].idx;
        var lists = [];
        for (let i = 0; i < totCnt; i++) {
          lists.push(false);
          // console.log(lists)
        }
        this.setState({
          dataIdxs: lists,
        });
      }
    });
  };

  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys)
    // console.log("selectedRowKeys.length :"+selectedRowKeys.length)

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
        console.log("push  :" + i);
        selectedRowKeys = [...selectedRowKeys, i];
        console.log(selectedRowKeys);
      }
    }
    console.log("#### :" + selectedRowKeys);
    this.setState({
      selectedRowKeys: selectedRowKeys,
      dataIdxs: curIdxs,
    });
  };

  onSubmit = () => {
    if (this.props.callback) {
      this.props.callback(this.state.selectedRowKeys);
    }
    this.props.close();
  };

  onChangeMulti = (e) => {
    // console.log(e.target.value)
    this.setState({ isMulti: e.target.value });
  };

  onRiderSelected = (data) => {
    // console.log(data)
    if (this.props.callback) {
      this.props.callback(data);
    }
    this.props.close();
  };

  render() {
    const { close, multi } = this.props;

    const columns = [
      {
        title: "순번",
        dataIndex: "idx",
        className: "table-column-center desk",
      },
      {
        title: "기사명",
        dataIndex: "riderName",
        className: "table-column-center",
        render: (data, row) =>
          this.state.isMulti ? (
            <div>{data}</div>
          ) : (
            <div
              className="riderNameTag"
              onClick={() => {
                this.onRiderSelected(row);
              }}
            >
              {data}
            </div>
          ),
      },
      {
        title: "직급",
        dataIndex: "riderLevel",
        className: "table-column-center desk tableSub",
        render: (data) => <div>{riderLevelText[data]}</div>,
      },
      {
        title: "직급",
        dataIndex: "riderLevel",
        className: "table-column-center mobile",
        render: (data, row) => (
          <div>
            {riderLevelText[row.riderLevel]}(
            {row.riderSettingGroup.settingGroupName})
          </div>
        ),
      },
      {
        title: "기사그룹",
        dataIndex: "riderSettingGroup",
        className: "table-column-center desk",
        render: (data) => <div>{userGroupString[data]}</div>,
      },
    ];

    const selectedRowKeys = this.state.selectedRowKeys;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="searchFranchise-Dialog">
          <div className="searchFranchise-content">
            <div className="searchFranchise-title">기사조회</div>
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
                        value={tableStatusString[this.state.userStatus]}
                        code={Object.keys(tableStatusString)}
                        codeString={tableStatusString}
                        onChange={(value) => {
                          if (parseInt(value) !== this.state.userStatus) {
                            this.setState(
                              {
                                userStatus: parseInt(value),
                                pagination: {
                                  current: 1,
                                  pageSize: 10,
                                },
                              },
                              () => this.getList()
                            );
                          }
                        }}
                      />

                      <Search
                        placeholder="기사검색"
                        className="searchRiderInput"
                        enterButton
                        allowClear
                        onSearch={this.onSearchRider}
                        style={{}}
                      />

                      {/* 멀티기능 */}
                      {multi && (
                        <Radio.Group
                          onChange={this.onChangeMulti}
                          value={this.state.isMulti}
                          className="selMulti"
                        >
                          <Radio value={false}>single</Radio>
                          <Radio value={true}>multi</Radio>
                        </Radio.Group>
                      )}
                    </div>

                    {/* 멀티기능 */}
                    {multi && (
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="submitBtn"
                      >
                        조회
                      </Button>
                    )}
                  </div>
                </div>

                <div className="dataTableLayout-01">
                  {this.state.isMulti ? (
                    <Table
                      rowKey={(record) => record.idx}
                      rowSelection={rowSelection}
                      dataSource={this.state.list}
                      columns={columns}
                      pagination={this.state.pagination}
                      onChange={this.handleTableChange}
                    />
                  ) : (
                    <Table
                      rowKey={(record) => record.idx}
                      dataSource={this.state.list}
                      columns={columns}
                      pagination={this.state.pagination}
                      onChange={this.handleTableChange}
                    />
                  )}
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchRiderDialog;
