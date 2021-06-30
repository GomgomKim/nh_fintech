import { Button, Checkbox, Form, Table, Tag, Modal } from "antd";
import React, { Component } from "react";
import { httpPost, httpUrl, httpDelete } from "../../../api/httpClient";
import "../../../css/modal.css";
import { comma } from "../../../lib/util/numberUtil";
import TaskGroupDialog from "../rider/TaskGroupDialog";
import SearchRiderDialog from "../common/SearchRiderDialog";
import TaskWorkDialog from "../rider/TaskWorkDialog";
import { customAlert, customError} from "../../../api/Modals";

class TaskSchedulerDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchRiderOpen: false,
      taskWorkOpen: false, //작업 등록
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      userIdx: 0
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

  onRefresh = () => {
    this.setState({
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      }
    }, ()=>{
      this.getList()
    })
  };

  getList = () => {
    httpPost(httpUrl.riderBatchWorkList, [], {
      pageNum: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
    })
    .then((res) => {
        console.log("res.data :"+JSON.stringify(res.data, null , 4) )
        const pagination = { ...this.state.pagination };
        pagination.current = res.data.currentPage;
        pagination.total = res.data.totalCount;
        this.setState({
          list: res.data.riderBatchWorkList,
          pagination
        }, () => console.log(this.state.list))
  })
  .catch((e) => {
      customError("목록 에러", 
      "에러가 발생하여 목록을 불러올수 없습니다.")
    }); 
  };

  // 일차감 삭제
  onDelete = (row) => {
    let self = this;
      Modal.confirm({
        title: "일차감 삭제",
        content: <div> {row.title} 를 삭제하시겠습니까?</div>,
        okText: "확인",
        cancelText: "취소",
        onOk() {
            httpDelete(httpUrl.riderBatchWorkDelete, [], {
              idx: row.idx
            })
                .then((res) => {
                    if (res.result === "SUCCESS" && res.data === "SUCCESS") {
                      customAlert("일차감 삭제", row.title+" 일차감이 삭제되었습니다.")
                      self.getList();
                    }
                    else customError("삭제 오류", "삭제 오류가 발생하였습니다. 다시 시도해 주십시오.")
                })
                .catch((error) => {
                  customError("삭제 오류", "일차감에 라이더가 있을시 라이더 삭제후 다시 진행해주세요.")
                });
        },
    });
  }

  onAddRider = (riderData) => {
      // console.log(JSON.stringify(riderData + " + " + JSON.stringify(this.state.userIdx)))
      httpPost(httpUrl.userBatchWorkCreate, [], {
        userIdx: riderData.idx,
        batchWorkNcashIdx: this.state.userIdx
      })
        .then((res) => {
            if (res.result === "SUCCESS" && res.data === "SUCCESS") {
              customAlert("일차감 라이더 추가", riderData.riderName+" 라이더가 추가되었습니다.")
              this.getList();
            }
            else  
            customError("추가 오류", "오류가 발생하였습니다. 다시 시도해 주십시오.")

        })
        .catch((error) => {
            customError("추가 오류", "오류가 발생하였습니다. 해당 라이더가 이미 추가 되있을 시 추가되지 않습니다.")
        });
  }

  onDeleteRider = (data,userIdx) => {
    var self = this;
    httpDelete(httpUrl.userBatchWorkDelete, [], {
      batchWorkNcashIdx: data.idx,
      userIdx
    })
    .then((res) => {
        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
          customAlert("일차감 라이더 삭제", "일차감 라이더가 삭제되었습니다.")
          self.getList();
        }
        else customError("삭제 오류", "오류가 발생하였습니다. 다시 시도해 주십시오.")
    })
    .catch((error) => {
        customError("삭제 오류", "오류가 발생하였습니다. 다시 시도해 주십시오.")
    });
  }
  
  // 기사추가 dialog
  openSearchRiderModal = (data) => {
    // userIdx set
    this.setState({ searchRiderOpen: true, userIdx:data });
  };
  closeSearchRiderModal = () => {
    this.setState({ searchRiderOpen: false });
  };

  //일차감 작업등록
  openTaskWorkModal = () => {
    this.setState({ taskWorkOpen: true });
  };
  closeTaskWorkModal = () => {
    this.setState({ taskWorkOpen: false });
  };

  render() {
    const columns = [
      {
        title: "차감명",
        dataIndex: "title",
        className: "table-column-center",
      },
      {
        title: "차감금액",
        dataIndex: "ncashDelta",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: "기간제한시작일",
        dataIndex: "startDate",
        className: "table-column-center",
      },
      {
        title: "기간제한종료일",
        dataIndex: "endDate",
        className: "table-column-center",
      },
      // {
      //   className: "table-column-center",
      //   render: (data, row) => (
      //     <div>
      //       <Button
      //         className="tabBtn surchargeTab"
      //         onClick={() => {}}
      //       >
      //         수정
      //       </Button>
      //     </div>
      //   ),
      // },
      {
        title: "기사추가",
        dataIndex: "idx",
        className: "table-column-center",
        render: (data) => (
          <div>
            {this.state.searchRiderOpen && (
              <SearchRiderDialog
              // multi={true}
                close={this.closeSearchRiderModal}
                callback={(riderData) => this.onAddRider(riderData)}/>
            )}
            <Button
              className="tabBtn"
              onClick={() => {
                // 모달열리면서 data추가
                this.openSearchRiderModal(data);
              }}
            >
              추가
            </Button>
          </div>
        ),
      },
      {
        className: "table-column-center",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => this.onDelete(row)}
            >
              삭제
            </Button>
          </div>
        ),
      },
    ];
    const expandedRowRender = (record) => {
      // alert(JSON.stringify(record.users))
      const dropColumns = [
        {
          dataIndex: "riderName",
          className: "table-column-center",
          render: (data, row) => (
            <>
              <Tag
                key={row.userIdx}
                style={{ fontSize: 14, padding: 5 }}
                closable
                onClose={() => this.onDeleteRider(record, row.userIdx)}
              >
                {data}
              </Tag>
            </>
          ),
        },
      ];
      return (
        <Table
          className="subTable"
          rowKey={(record) => `record: ${record.idx}`}
          columns={dropColumns}
          dataSource={record.users}
          pagination={false}
        />
      );
    };

    const { close } = this.props;

    return (
      <React.Fragment>
        <div className="Dialog-overlay" onClick={close} />
        <div className="taskScheduler-Dialog">
          <div className="taskScheduler-content">
            <div className="taskScheduler-title">일차감 목록</div>
            <img
              onClick={close}
              src={require("../../../img/login/close.png").default}
              className="taskScheduler-close"
              alt="close"
            />
            <div className="taskScheduler-inner">
              <div className="taskScheduler-btn">
                <div className="taskScheduler-btn-01">
                  {this.state.taskWorkOpen && (
                    <TaskWorkDialog 
                      close={this.closeTaskWorkModal}
                      callback={this.onRefresh}
                    />
                  )}
                  <Button
                    className="taskScheduler-btn"
                    onClick={this.openTaskWorkModal}
                  >
                    일차감 등록
                  </Button>
                </div>
              </div>

              <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                <div className="listBlock">
                  <Table
                    rowKey={(record) => record.idx}
                    dataSource={this.state.list}
                    columns={columns}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                    expandedRowRender={expandedRowRender}
                  />
                </div>
              </Form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TaskSchedulerDialog;
