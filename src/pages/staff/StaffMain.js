import { Form, DatePicker, Input, Table, Button, Descriptions, Radio, Select } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import "../../css/staff.css";
import "../../css/common.css";
import { comma } from "../../lib/util/numberUtil";
import { formatDate } from "../../lib/util/dateUtil";
import RegistStaffDialog from "../../components/dialog/staff/RegistStaffDialog";
import UpdateStaffDialog from "../../components/dialog/staff/UpdateStaffDialog";



const FormItem = Form.Item;
const Ditems = Descriptions.Item;
const Option = Select.Option;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;


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
    this.getRegistStaffList()
  }

  onChange = e => {
    // console.log('radio checked', e.target.value);
    this.setState({
      staffStatus: e.target.value,
    }, () => this.getRegistStaffList());
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


  onChangeSel = (value) => {
    httpPost(httpUrl.staffUpdate, [], {
      riderStatus: value
    }).then((result) => {
      console.log(result)
      // this.props.close()
      // this.props.history.push('../../pages/staff/StaffMain')

    });
  }
  getRegistStaffList = () => {
    let pageNum = this.state.pagination.current;
    let riderLevel = this.state.riderLevel;
    let userData = this.state.userData;

    httpGet(httpUrl.registStaffList, [10, pageNum, riderLevel, userData], {}).then((result) => {
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
        width: 100,
        render:
          (data, row) => (
            <div>
              <Select onChange={value => {
                this.onChangeSel(value);
              }} defaultValue={data} style={{ width: 68 }}>
                <Option value={3}>퇴사</Option>
                <Option value={2}>중지</Option>
                <Option value={1}>근무</Option>
              </Select>
            </div>
          ),
      },
      /*
      {
        title: "상태",
        dataIndex: "staffStatus",
        className: "table-column-center",
        width: "200px",
        render: (data) => <div>{data == -1 ? "퇴사"
          : data == 0 ? "중지"
            : data == 1 ? "근무"
              : "-"}</div>
      },*/
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
            <Radio value={1}>사용</Radio>
            <Radio value={0}>중지</Radio>
            <Radio value={-1}>퇴사</Radio>
          </Radio.Group>


          <Button className="registStaff"
            onClick={() => { this.setState({ registStaff: true }) }}
          >직원 등록</Button>

          <RegistStaffDialog isOpen={this.state.registStaff} close={this.closeStaffRegistrationModal} />
        </div>

        <div className="dataTableLayout">
          <Table
            dataSource={this.state.results}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.state.Status}
          />
        </div>
      </div>


    )
  }
}

export default StaffMain;