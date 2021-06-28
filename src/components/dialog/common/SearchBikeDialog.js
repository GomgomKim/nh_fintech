import { Form, Input, Table } from "antd";
import React, { Component } from "react";
import { httpGet, httpUrl } from "../../../api/httpClient";
import "../../../css/modal.css";
import { searchBike } from "../../../lib/util/codeUtil";
import SelectBox from "../../input/SelectBox";

const Search = Input.Search;
// const today = new Date();

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

      modelName: "",
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    this.getList();
  }

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

  getList = () => {
    if (this.state.modelName) {
      httpGet(
        httpUrl.getBikeList,
        [
          this.state.modelName,
          this.state.pagination.current,
          this.state.pagination.pageSize,
        ],
        {}
      )
        .then((res) => {
          if (res.result === "SUCCESS") {
            this.setState({
              list: res.data.bikes,
              pagination: {
                ...this.state.pagination,
                total: res.data.totalCount,
              },
            });
          }
        })
        .catch((e) => {});
    } else {
      httpGet(
        httpUrl.getBikeListNoModelName,
        [this.state.pagination.current, this.state.pagination.pageSize],
        {}
      )
        .then((res) => {
          if (res.result === "SUCCESS") {
            this.setState({
              list: res.data.bikes,
              pagination: {
                ...this.state.pagination,
                total: res.data.totalCount,
              },
            });
          }
        })
        .catch((e) => {});
    }
  };

  onSubmit = () => {
    // console.log("click")
    if (this.props.callback) {
      this.props.callback(this.state.selectedRowKeys);
    }
    this.props.close();
  };

  onSelect = (data) => {
    if (this.props.onSelect) {
      this.props.onSelect(data);
    }
    this.props.close();
  };

  render() {
    const columns = [
      {
        title: "번호",
        dataIndex: "idx",
        className: "table-column-center",
        render: (data, row) => (
          <div style={{ cursor: "pointer" }} onClick={() => this.onSelect(row)}>
            {data}
          </div>
        ),
      },
      {
        title: "차량번호",
        dataIndex: "bikeNumber",
        className: "table-column-center",
        render: (data, row) => (
          <div style={{ cursor: "pointer" }} onClick={() => this.onSelect(row)}>
            {data}
          </div>
        ),
      },
      {
        title: "모델명",
        dataIndex: "modelName",
        className: "table-column-center",
        render: (data, row) => (
          <div style={{ cursor: "pointer" }} onClick={() => this.onSelect(row)}>
            {data}
          </div>
        ),
      },
      {
        title: "제조사",
        dataIndex: "maker",
        className: "table-column-center",
        render: (data, row) => (
          <div style={{ cursor: "pointer" }} onClick={() => this.onSelect(row)}>
            {data}
          </div>
        ),
      },
    ];

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
                            this.setState({ searchBike: parseInt(value) }, () =>
                              this.getList()
                            );
                          }
                        }}
                      />

                      <Search
                        placeholder="모델명을 입력해주세요"
                        className="searchFranchiseInput"
                        onChange={(e) =>
                          this.setState({ modelName: e.target.value })
                        }
                        enterButton
                        allowClear
                        onSearch={() => this.getList()}
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
                    onChange={(e) => this.handleTableChange(e)}
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
