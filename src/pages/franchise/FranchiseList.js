import { Form, DatePicker, Input, Table, Button, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class FranchiseList extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      searchType: "FR_NAME",
      searchText: "",
      list: [],
      tidVisible: false, 
      editRow: 0,
    };
  }

  componentDidMount() {
    this.getList();
  }

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
    let { pageSize, current } = this.state.pagination;
    httpGet(httpUrl.franchiseList, [pageSize, current, this.state.searchType, this.state.searchText], {}).then((res) => {
      const pagination = { ...this.state.pagination };
      pagination.current = res.data.currentPage;
      pagination.total = res.data.totalCount;
      this.setState({
        list: res.data.franchises,
        pagination,
      });
    });
  }

  onSearch = (value) => {
    this.setState({
        total: 0,
        current: 1,
        pageSize: 10,
        searchText: value
      }, () => { this.getList(); });
  }

  handleSubmit = () => {
    const {editRow} = this.state;

    httpPost(httpUrl.modifyTid, [], {
      userIdx: editRow,
      ...this.formRef.current.getFieldsValue()
    }).then(response => {
      if (response.data) {
        let item = this.state.list.find(x=>x.userIdx == editRow);
        item.tidNormal = this.formRef.current.getFieldValue('tidNormal');
        item.tidPrepay = this.formRef.current.getFieldValue('tidPrepay');
        this.setState({list: this.state.list, editRow: 0})
      }
      else {
        alert('실패하였습니다. 잠시 후 다시 시도해 주세요.')
      }
    }).catch(e=>{
      alert('실패하였습니다. 잠시 후 다시 시도해 주세요.')
    })


  }

  expandedRowRender = (record) => {
    return (
      <div style={{paddingLeft: '100px'}}>
        <Descriptions
          bordered
          column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 1 }}>
          <Ditems label="가맹점명">{record.frName}</Ditems>
          <Ditems label="사업자번호">{record.businessNumber}</Ditems>
          <Ditems label="대표자">이태호</Ditems>

          <Ditems label="생년월일/법인번호">1101115405455</Ditems>
          <Ditems label="휴대전화">01062427500</Ditems>
          <Ditems label="사업장전화">0215447620</Ditems>

          <Ditems label="은행명">우리은행</Ditems>
          <Ditems label="계좌번호">12626986702401</Ditems>
          <Ditems label="이메일">{record.email}</Ditems>

          <Ditems label="사업장주소" span={3}>{record.addr1 + ' ' + record.addr2}</Ditems>
        </Descriptions>
      </div>
    )
  }
  render() {
    const { searchType, searchText, editRow } = this.state;
    const searchTypeCode = [
      'FR_NAME',
      'BUSINESS_NUMBER'
    ]
    const searchTypeString = {
      FR_NAME: "가맹점명",
      BUSINESS_NUMBER: "사업자번호",
    }
    const columns = [
      {
        title: "가맹점명",
        dataIndex: "frName",
        className: "table-column-center",
      },
      {
        title: "사업자번호",
        dataIndex: "businessNumber",
        className: "table-column-center",
      },
      {
        title: "주소",
        dataIndex: "addr1",
        className: "table-column-text",
        render: (data, row) => <div>{row.addr1 + row.addr2}</div>
      },
      {
        title: "결제수단",
        dataIndex: "addr1",
        className: "table-column-text",
        render: (data, row) => {
          if (row.tidNormalRate == 0) return (<div style={{color: 'coral', fontWeight: 'bold'}}>선지급</div>)
          else if (row.tidNormalRate == 100) return (<div style={{color: 'coral', fontWeight: 'bold'}}>일반</div>)
          else return (<div style={{color: 'coral', fontWeight: 'bold'}}>병행(선지급+일반)</div>)
        }
      },
      {
        title: "TID(일반결제)",
        dataIndex: "tidNormal",
        className: "table-column-center",
        width: '15%',
        render: (data, row) => row.userIdx == editRow ? (
          <FormItem
            name="tidNormal"
            style={{marginBottom: '0px', width: '150px'}}
          >
            <Input placeholder="TID(일반결제)" />
          </FormItem>
        ) : (<div>{data == '' ? '(미설정)' : data}</div>)
      },
      {
        title: "TID(선지급)",
        width: '15%',
        dataIndex: "tidPrepay",
        className: "table-column-center",
        render: (data, row) => row.userIdx == editRow ? (
          <FormItem
            name="tidPrepay"
            style={{marginBottom: '0px', width: '150px'}}
          >
            <Input placeholder="TID(선지급)" />
          </FormItem>
        ) : (<div>{data == '' ? '(미설정)' : data}</div>)
      },
      {
        title: "수정",
        dataIndex: "userIdx",
        width: '10%',
        className: "table-column-center",
        render: (data, row) => data == editRow ? (
          <>
            <Button type="primary" htmlType="submit" style={{marginRight: '10px'}} onClick={(e)=>{e.stopPropagation();}}>저장</Button>
            <Button onClick={(e)=>{
              e.stopPropagation();
              this.setState({editRow: 0})
              }}>취소</Button>
          </>
        ) : (
          <Button onClick={(e)=>{
            e.stopPropagation();
            if (editRow != 0) return;
            this.setState({editRow: data});
            this.formRef.current.setFieldsValue({tidNormal: row.tidNormal, tidPrepay: row.tidPrepay})
          }}>수정</Button>
        )
      },
    ];
    return (
      <>
        <div className="flex-row flex-center flex-end m-b-10">
        <SelectBox
            value={searchTypeString[searchType]}
            code={searchTypeCode}
            codeString={searchTypeString}
            onChange={(value) => {
              if (value !== searchType) {
                this.setState({searchType: value})
              }
            }}
            style={{ width: "200px", marginRight: "10px" }}
          />
          <Search
            placeholder={
              "검색어를 입력해주세요."
            }
            enterButton="검색"
            allowClear
            onSearch={this.onSearch}
            style={{ width: 400 }}
          />
        </div>
        <Form ref={this.formRef} onFinish={this.handleSubmit}>
        <Table
          rowKey={(record) => record.userIdx}
          dataSource={this.state.list}
          columns={columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          expandedRowRender={this.expandedRowRender}
          expandRowByClick={true}
        />
        </Form>
      </>
    )
  }
}
export default FranchiseList;