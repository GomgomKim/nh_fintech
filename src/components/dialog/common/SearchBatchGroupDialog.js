import React, { Component } from "react";
import { Form, Input, Table, Button, Radio } from "antd";
import { httpUrl, httpPost } from "../../../api/httpClient";
import "../../../css/modal.css";
import SelectBox from "../../../components/input/SelectBox";
import { tableStatusString } from "../../../lib/util/codeUtil";
import { connect } from "react-redux";

const Search = Input.Search;
const today = new Date();

class SearchBatchGroupDialog extends Component {
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
      frName: "",
      franGroup: 0,
      dataIdxs: [],
      selectedRowKeys: [],
      isMulti: false,
      groupName: "",
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    this.getList(true);
  }

  // 가맹점 검색
  onSearchFranchisee = (value) => {
    this.setState(
      {
        groupName: value,
      },
      () => {
        this.getList();
      }
    );
  };

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

  getList = (isInit) => {
    // console.log(isInit)
    // console.log(this.state.franStatus);
    httpPost(httpUrl.priceExtraGroupList, [], {
      branchIdx: this.props.branchIdx,
      pageNum: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
    }).then((result) => {
      // console.log('## result=' + JSON.stringify(result, null, 4))
      const pagination = {
        ...this.state.pagination,
      };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      this.setState({ list: result.data.frSettingGroups, pagination });
    });
  };

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

  onChangeMulti = (e) => {
    // console.log(e.target.value)
    this.setState({ isMulti: e.target.value });
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
        title: "순번",
        dataIndex: "idx",
        className: "table-column-center",
      },
      {
        title: "그룹명",
        dataIndex: "settingGroupName",
        className: "table-column-center",
        render: (data, row) =>
          this.state.isMulti ? (
            <div>{data}</div>
          ) : (
            <div
              className="frNameTag"
              onClick={() => {
                if (this.props.onSelect) {
                  this.props.onSelect(row);
                }
                this.onFrSelected(row);
              }}
            >
              {data}
            </div>
          ),
      },
    ];

    const selectedRowKeys = this.state.selectedRowKeys;
    // console.log(selectedRowKeys);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const { close, multi } = this.props;

    return (

          <React.Fragment>
            <div className="Dialog-overlay" onClick={close} />
            <div className="searchFranchise-Dialog">
              <div className="searchFranchise-content">
                <div className="searchFranchise-title">일차감 그룹 조회</div>
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
                          <Search
                            style={{marginLeft:0}}
                            placeholder="그룹 검색"
                            className="searchFranchiseInput"
                            enterButton
                            allowClear
                            onSearch={this.onSearchFranchisee}
                          />

                          {/* 멀티 기능 */}
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

                        {/* 멀티 기능 */}
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

const mapStateToProps = (state) => {
  return {
      branchIdx: state.login.loginInfo.branchIdx,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBatchGroupDialog);
