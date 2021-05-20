import { Table, Button, Radio, Modal } from 'antd';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpPost } from '../../api/httpClient';
import "../../css/staff.css";
import "../../css/common.css";
import RegistStaffDialog from "../../components/dialog/staff/RegistStaffDialog";
import SelectBox from '../../components/input/SelectBox';
import { staffString} from '../../lib/util/codeUtil';


class StaffMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffStatus: 1,
      workTab: 0,
      registStaffList: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      registStaff: false,
      updateStaff: false,
      riderLevel: [1, 2],
      userData: 1,
      dialogData: [],
    };
  }

  componentDidMount() {
    this.getList()
  }

  onChange = e => {
    this.setState({
      staffStatus: e.target.value,
    }, () => this.getList());
  };
  
  handleTableChange = (pagination) => {
    console.log(pagination)
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize
    this.setState({
      pagination: pager,
    }, () => this.getList());
  };
  
  onChangeStatus = (index, value) => {
    let self = this;
    Modal.confirm({
      title: "상태 변경",
      content: '상태를 수정하시겠습니까?',
      okText: "확인",
      cancelText: "취소",
      onOk() {
        httpPost(httpUrl.staffUpdate, [], {
          idx: index, userStatus: value
         })
            .then((result) => {
              Modal.info({
                title: "변경 완료",
                content: (
                    <div>
                        상태가 변경되었습니다.
                    </div>
                ),
              });
            self.getList();
            })
            .catch((error) => {
              Modal.info({
                title: "변경 오류",
                content: "오류가 발생하였습니다. 다시 시도해 주십시오."
            });
            });
      },
  });
  }

  getList = () => {
    let pageSize = this.state.pagination.pageSize;
    let pageNum = this.state.pagination.current;
    let riderLevel = this.state.riderLevel;
    let userData = this.state.userData;

    httpGet(httpUrl.registStaffList, [pageSize, pageNum, riderLevel, userData], {}).then((result) => {
      console.log('## nnbox result=' + JSON.stringify(result, null, 4))
      const pagination = { ...this.state.pagination };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      this.setState({
        results: result.data.riders,
        pagination,
      });
    })
    // this.setState({
    //   list: list,
    // });

  }


  closeStaffRegistrationModal = () => {
    this.setState({ registStaff: false });
  }

  closeStaffUpdateModal = () => {
    this.setState({ updateStaff: false });
  }


  render() {
    const columns = [
      {
        title: "지사명",
        dataIndex: "id",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "아이디",
        dataIndex: "id",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "이메일",
        dataIndex: "email",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "이름",
        dataIndex: "riderName",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "직급",
        dataIndex: "riderLevel",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "상태",
        dataIndex: "userStatus",
        className: "table-column-center",
        render: (data, row) => <div>
            <SelectBox
                value={staffString[data]}
                code={Object.keys(staffString)}
                codeString={staffString}
                onChange={(value) => {
                    if (parseInt(value) !== row.userStatus) {
                        this.onChangeStatus(row.idx, value);
                    }
                }}
            />
        </div>
      },
      {
        title: "전화번호",
        dataIndex: "phone",
        className: "table-column-center",
        width: "350px",
      },
      {
        title: "메모",
        dataIndex: "memo",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "정보 수정",
        className: "table-column-center",
        width: "200px",
        render: (data, row) =>
          <div>
            <RegistStaffDialog data={this.state.dialogData} isOpen={this.state.updateStaff} close={this.closeStaffUpdateModal} />
            <Button
              className="tabBtn surchargeTab"
              onClick={() => { this.setState({ updateStaff: true, dialogData: row }) }}
              // onClick={() => { alert(row.id) }}
            >수정</Button>
          </div>
      },
    ];
    return (
      <div className="">
        <div className="selectLayout">
          <span className="searchRequirementText">검색조건</span><br></br>
          <Radio.Group className="searchRequirement" onChange={this.onChange} value={this.state.staffStatus}>
            <Radio value={1}>근무</Radio>
            <Radio value={2}>중지</Radio>
            <Radio value={3}>퇴사</Radio>
          </Radio.Group>


          <RegistStaffDialog isOpen={this.state.registStaff} close={this.closeStaffRegistrationModal} />
          <Button className="registStaff"
            onClick={() => { this.setState({ registStaff: true }) }}
          >직원 등록</Button>
        </div>

        <div className="dataTableLayout">
          <Table
            dataSource={this.state.results}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
        </div>
      </div>


    )
  }
}

export default StaffMain;