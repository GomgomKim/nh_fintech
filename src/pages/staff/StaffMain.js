import { Form, DatePicker, Input, Table, Button, Descriptions, Radio } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import "../../css/staffManage.css";
import "../../css/common.css";
import { comma } from "../../lib/util/numberUtil";
import { formatDate } from "../../lib/util/dateUtil";
import RegistStaffDialog from "../../components/dialog/staff/RegistStaffDialog";



const FormItem = Form.Item;
const Ditems = Descriptions.Item;

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
          staffId: "김기연",
          staffName: '김기연',
          staffRank: '본사',
          staffStatus: this.state.staffStatus,
          staffPhoneNum: '010-1234-5678',
          staffMemo: '메모',
        },
        {
          franchiseeName: "플러스김포",
          staffId: "김포맨",
          staffName: '곰기연',
          staffRank: '팀장',
          staffStatus: this.state.staffStatus,
          staffPhoneNum: '010-1234-5678',
          staffMemo: '메모',
        },
        {
          franchiseeName: "플러스김포",
          staffId: "딜리버리",
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
          staffId: "김포좋아요",
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
          staffId: "곰곰킴",
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
        width: "200px",
        render: (data) => <div>{data == -1 ? "퇴사"
          : data == 0 ? "중지"
            : data == 1 ? "근무"
              : "-"}</div>
      },
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
        title: "작업",
        className: "table-column-center",
        width: "200px",
        render: () =>
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() => { this.setState({ workTab: 1 }) }}
            >작업</Button>
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

        <div className="tableLayout">
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