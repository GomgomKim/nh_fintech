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
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      registStaff: false,
      updateStaff: false,
    };
  }

  componentDidMount() {
    this.getList()
  }

  onChange = e => {
    // console.log('radio checked', e.target.value);
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

  getList = () => {
    if (this.state.staffStatus == 1) {
      console.log(this.state.staffStatus)
      var list = [
        {
          franchiseeName: "플러스김포",
          staffId: "example1",
          staffEmail: "example@naver.com",
          staffName: '김기연',
          staffRank: '본사',
          staffStatus: this.state.staffStatus,
          staffPhoneNum: '010-1234-5678',
          staffMemo: '메모',
        },
        {
          franchiseeName: "플러스김포",
          staffId: "example2",
          staffEmail: "example@naver.com",
          staffName: '곰기연',
          staffRank: '팀장',
          staffStatus: this.state.staffStatus,
          staffPhoneNum: '010-1234-5678',
          staffMemo: '메모',
        },
        {
          franchiseeName: "플러스김포",
          staffId: "example3",
          staffEmail: "example@naver.com",
          staffName: '딜리버리',
          staffRank: '본부장',
          staffStatus: this.state.staffStatus,
          staffPhoneNum: '010-1234-5678',
          staffMemo: '메모',
        },
      ]
    } else if (this.state.staffStatus == -1) {
      var list = [
        {
          franchiseeName: "플러스김포",
          staffId: "example4",
          staffEmail: "example@naver.com",
          staffName: '김기연',
          staffRank: '팀장',
          staffStatus: this.state.staffStatus,
          staffPhoneNum: '010-1234-5678',
          staffMemo: '메모',
        },
      ]
    } else {
      var list = [
        {
          franchiseeName: "플러스김포",
          staffId: "example5",
          staffEmail: "example@naver.com",
          staffName: '곰기연',
          staffRank: '본사',
          staffStatus: this.state.staffStatus,
          staffPhoneNum: '010-1234-5678',
          staffMemo: '메모',
        },
      ]
    }
    this.setState({
      list: list,
    });

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
        dataIndex: "franchiseeName",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "아이디",
        dataIndex: "staffId",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "이메일",
        dataIndex: "staffEmail",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "이름",
        dataIndex: "staffName",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "직급",
        dataIndex: "staffRank",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "상태",
        dataIndex: "staffStatus",
        className: "table-column-center",
        width: 100,
        render:
          (data, row) => (
            <div>
              <Select defaultValue={data} style={{ width: 68 }}>
                <Option value={-1}>퇴사</Option>
                <Option value={0}>중지</Option>
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
        dataIndex: "staffPhoneNum",
        className: "table-column-center",
        width: "350px",
      },
      {
        title: "메모",
        dataIndex: "staffMemo",
        className: "table-column-center",
        width: "200px",
      },
      {
        title: "정보 수정",
        className: "table-column-center",
        width: "200px",
        render: (data) =>
          <div>
            <UpdateStaffDialog data={data} isOpen={this.state.updateStaff} close={this.closeStaffUpdateModal} />
            <Button
              className="tabBtn surchargeTab"
              onClick={() => { this.setState({ updateStaff: true }) }}
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
            dataSource={this.state.list}
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