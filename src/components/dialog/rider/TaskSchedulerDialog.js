import { Button, Checkbox, Form, Table } from "antd";
import React, { Component } from "react";
import "../../../css/modal.css";
import { comma } from "../../../lib/util/numberUtil";
import TaskGroupDialog from "../rider/TaskGroupDialog";
import TaskWorkDialog from "../rider/TaskWorkDialog";

class TaskSchedulerDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riderStatus: 1,
      riderName: "",
      taskGroupOpen: false, //작업 그룹설정
      taskWorkOpen: false, //작업 등록
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
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

  onSearchRider = (value) => {
    this.setState(
      {
        riderName: value,
      },
      () => {
        this.getList();
      }
    );
  };

  onChange = (e) => {
    // console.log('radio checked', e.target.value);
    this.setState(
      {
        riderStatus: e.target.value,
      },
      () => this.getList()
    );
  };

  getList = () => {
    var list = [
      {
        workName: "리스비",
        processPrice: "-26300",
        registerDate: "21-06-01 19:36:25",
        registerName: "관리자",
        applyTerm: "매일",
        nextDate: "20120302",
        limitTimeUse: "사용",
        limitTimeStart: "21-06-01",
        limitTimeFinish: "22-05-31",
      },
      {
        workName: "비품 대여",
        processPrice: "-2300",
        registerDate: "21-02-01 19:36:25",
        registerName: "관리자",
        applyTerm: "매일",
        nextDate: "20120302",
        limitTimeUse: "사용",
        limitTimeStart: "21-06-01",
        limitTimeFinish: "22-05-31",
      },
      {
        workName: "패널티",
        processPrice: "-30000",
        registerDate: "21-02-01 19:36:25",
        registerName: "관리자",
        applyTerm: "매일",
        nextDate: "20120302",
        limitTimeUse: "미사용",
        limitTimeStart: "",
        limitTimeFinish: "",
      },
      {
        workName: "대출금",
        processPrice: "-50000",
        registerDate: "21-02-01 19:36:25",
        registerName: "관리자",
        applyTerm: "매일",
        nextDate: "20120302",
        limitTimeUse: "사용",
        limitTimeStart: "21-07-02",
        limitTimeFinish: "21-12-31",
      },
    ];
    this.setState({
      list: list,
    });
  };
  //일차감 그룹설정
  openTaskGroupModal = () => {
    this.setState({ taskGroupOpen: true });
  };
  closeTaskGroupModal = () => {
    this.setState({ taskGroupOpen: false });
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
        title: "사용여부",
        className: "table-column-center",
        render: () => (
          <div>
            {
              <Checkbox
                className="tabBtn riderGroupTab"
                onClick={() => {
                  this.setState({ workTabOpen: true });
                }}
              ></Checkbox>
            }
          </div>
        ),
      },
      {
        title: "차감명",
        dataIndex: "workName",
        className: "table-column-center",
      },
      {
        title: "차감금액",
        dataIndex: "processPrice",
        className: "table-column-center",
        render: (data) => <div>{comma(data)}</div>,
      },
      {
        title: "등록자",
        dataIndex: "registerName",
        className: "table-column-center",
      },
      {
        title: "기간제한사용",
        dataIndex: "limitTimeUse",
        className: "table-column-center",
      },
      {
        title: "기간제한시작일",
        dataIndex: "limitTimeStart",
        className: "table-column-center",
      },
      {
        title: "기간제한종료일",
        dataIndex: "limitTimeFinish",
        className: "table-column-center",
      },
    ];

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
                  {this.state.taskGroupOpen && (
                    <TaskGroupDialog close={this.closeTaskGroupModal} />
                  )}
                  <Button
                    className="taskScheduler-btn"
                    onClick={this.openTaskGroupModal}
                  >
                    그룹관리
                  </Button>
                </div>
                <div className="taskScheduler-btn-02">
                  {this.state.taskWorkOpen && (
                    <TaskWorkDialog close={this.closeTaskWorkModal} />
                  )}
                  <Button
                    className="tabBtn taskScheduler-btn"
                    onClick={this.openTaskWorkModal}
                  >
                    일차감 등록
                  </Button>
                </div>
                {/* <div className="taskScheduler-btn-03">
                                    <Button
                                        className="tabBtn taskScheduler-btn"
                                        onClick={() => { }}
                                    >조회</Button>
                                </div> */}
              </div>

              <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                <div className="listBlock">
                  <Table
                    // rowKey={(record) => record.idx}
                    dataSource={this.state.list}
                    columns={columns}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
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
