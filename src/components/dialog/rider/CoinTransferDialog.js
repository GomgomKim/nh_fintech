import { Button, Checkbox, Form, Table, Tag, Modal } from "antd";
import React, { Component } from "react";
import { httpGet, httpUrl } from "../../../api/httpClient";
import "../../../css/modal.css";
import { comma } from "../../../lib/util/numberUtil";
import { customAlert, customError} from "../../../api/Modals";
import SelectBox from "../../../components/input/SelectBox";
import { coinCategory } from "../../../lib/util/codeUtil";

class CoinTransferDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      category: "",
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
      category: value === "NONE" ?
        "" : value,
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
    let { data } = this.props;
    let category = this.state.category;
    let pageNum = this.state.pagination.current;
    let pageSize = this.state.pagination.pageSize;
    let userIdx = data.idx
    httpGet(httpUrl.ncashList, [
      category,
      pageNum,
      pageSize,
      userIdx
    ], {})
    .then((res) => {
        console.log("res.data :"+ data.idx)
        const pagination = { ...this.state.pagination };
        pagination.current = res.data.currentPage;
        pagination.total = res.data.totalCount;
        this.setState({
          list: res.data.ncash,
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
        title: "날짜",
        dataIndex: "createDate",
        className: "table-column-center",
        width: "12%",
        // render: (data) => <div>{formatDateToDay(data)}</div>,
      },
      {
        title:"내역",
        dataIndex: "categoryKr",
        className:"table-column-center",
      },
      {
        title: "금액",
        dataIndex: "ncashDelta",
        className: "table-column-center",
        render: (data) => <div>{comma(data)} 원</div>,
      },
      {
        title: "잔액",
        dataIndex: "ncash",
        className: "table-column-center",
        render: (data) => <div>{comma(data)} 원</div>,
      },
    ];

    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="taskWorkList-Dialog">
          <div className="taskWorkList-content">
            <div className="taskWorkList-title">코인 이력</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="taskWorkList-close"
              alt="close"
            />
            <div className="taskWorkList-inner">
            <SelectBox
                // placeholder={'전체'}
                style={{width:200}}
                value={
                  this.state.category === ""
                  ? coinCategory["NONE"] : coinCategory[this.state.category]}
                code={Object.keys(coinCategory)}
                codeString={coinCategory}
                onChange={(value) => {
                    if (parseInt(value) !== this.state.category) {
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

export default CoinTransferDialog;
