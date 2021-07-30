import { Button, Checkbox, Form, Table, Tag, Modal } from "antd";
import React, { Component } from "react";
import { httpGet, httpUrl } from "../../../api/httpClient";
import "../../../css/modal.css";
import { comma } from "../../../lib/util/numberUtil";
import { customAlert, customError} from "../../../api/Modals";
import SelectBox from "../../../components/input/SelectBox";
import { kindString } from "../../../lib/util/codeUtil";

class BatchWorkListDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      kind: 1,
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

  onChangeStatus = (value) => {
    this.setState({
        kind: value === "0" ? "" : value,
        pagination: {
            current: 1,
            pageSize: 5,
        }
    }, ()=>{
        this.getList();
    })
}

    //   getList = () => {
    //     var list = [
    //         {
    //             createDate: "2021-06-12",
    //             kind: 1,
    //             userId: "rider03",
    //             userName: "rider03",
    //             registrationNumber: "930507-1000000",
    //             phone: "010-1111-2222",
    //             ncashDelta: 50000
    //         },
    //         {
    //             createDate: "2021-06-23",
    //             kind: 2,
    //             userId: "rider04",
    //             userName: "rider04",
    //             registrationNumber: "950721-2000000",
    //             phone: "010-1212-3333",
    //             ncashDelta: 30000
    //         },
    //         {
    //             createDate: "2021-07-15",
    //             kind: 3,
    //             userId: "rider06",
    //             userName: "rider06",
    //             registrationNumber: "941108-1000000",
    //             phone: "010-2121-1111",
    //             ncashDelta: 20000
    //         }
    //     ]
    //     this.setState({
    //         list:list,
    //     })
    // }

  getList = () => {
    let kind = this.state.kind;
    let pageNum = this.state.pagination.current;
    let pageSize = this.state.pagination.pageSize;
    httpGet(httpUrl.riderBatchWorkDailyList, [
      kind,
      pageNum,
      pageSize,
    ], {})
    .then((res) => {
        console.log("res.data :"+JSON.stringify(res.data, null , 4) )
        const pagination = { ...this.state.pagination };
        pagination.current = res.data.currentPage;
        pagination.total = res.data.totalCount;
        this.setState({
          list: res.data.ncashDailies,
          pagination
        }, () => console.log(this.state.list))
  })
  .catch((e) => {
      customError("목록 에러", 
      "에러가 발생하여 목록을 불러올수 없습니다.")
    }); 
  };
  
  render() {
    const columns = [
      {
        title: "일시",
        dataIndex: "createDate",
        className: "table-column-center",
        width: "12%",
        // render: (data) => <div>{formatDateToDay(data)}</div>,
      },
      {
        title:"구분",
        dataIndex: "kind",
        className:"table-column-center",
        render: (data) => <div>{kindString[data]}</div>
      },
      {
        title: "라이더아이디",
        dataIndex: "userId",
        className: "table-column-center",
      },
      {
        title: "라이더이름",
        dataIndex: "userName",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: "주민번호",
        dataIndex: "registrationNumber",
        className: "table-column-center",
      },
      {
        title: "연락처",
        dataIndex: "phone",
        className: "table-column-center"
      },
      {
        title: "차감금액",
        dataIndex: "ncashDelta",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}원</div>
      },
    ];

    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="taskWorkList-Dialog">
          <div className="taskWorkList-content">
            <div className="taskWorkList-title">일차감 내역</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="taskWorkList-close"
              alt="close"
            />
            <div className="taskWorkList-inner">
            <SelectBox
                // placeholder={'전체'}
                style={{width:175}}
                value={ this.state.kind === "" ? kindString["0"] : kindString[this.state.kind]}
                code={Object.keys(kindString)}
                codeString={kindString}
                onChange={(value) => {
                    if (parseInt(value) !== this.state.kind) {
                        this.onChangeStatus(value);
                    }
                }}
            />
                <div className="listBlock">
                  <Table
                    rowKey={(record) => record.idx}
                    dataSource={this.state.list}
                    columns={columns}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                  />
                </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BatchWorkListDialog;
