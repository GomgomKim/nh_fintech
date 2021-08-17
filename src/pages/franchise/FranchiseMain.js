import { BankOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Table, Affix } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
// import { sheet_to_json } from "xlsx";
import * as XLSX from "xlsx";
import { httpGet, httpPost, httpUrl } from "../../api/httpClient";
import { updateComplete, updateError } from "../../api/Modals";
// import BlindControlDialog from "../../components/dialog/franchise/BlindControlDialog";
import BlindFranListDialog from "../../components/dialog/franchise/BlindFranListDialog";
import RegistAccountDialog from "../../components/dialog/franchise/RegistAccountDialog";
import RegistFranDialog from "../../components/dialog/franchise/RegistFranDialog";
import RegistVANDialog from "../../components/dialog/franchise/RegistVANDialog";
import SearchAddressDialog from "../../components/dialog/franchise/SearchAddressDialog";
import SelectBox from "../../components/input/SelectBox";
import "../../css/franchise.css";
import "../../css/franchise_m.css";
import { statusString, tableStatusString } from "../../lib/util/codeUtil";
import { formatDateToDay } from "../../lib/util/dateUtil";
import { comma } from "../../lib/util/numberUtil";

const Search = Input.Search;

class FranchiseMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      franchisee: "",
      pagination: {
        total: 0,
        current: 1,
        pageSize: 100,
      },
      // test data
      list: [],
      withdrawSet: 0,
      franStatus: 1,
      frName: "",
      franGroup: 0,
      franSelectStatus: 0,
      ResistFranchiseOpen: false,
      modifyFranOpen: false,
      SearchAddressOpen: false,
      // blindControlOpen: false,
      dialogData: [],
      accountData: [],
      accountRegistOpen: false,
      blindFrData: [],
      ResistVANData: [],
      blindListOpen: false,
      inputOpen: false,
      ResistVANOpen: false,

      // excel data
      data: {},
    };
  }

  componentDidMount() {
    this.getList();
    // console.log("props tag :"+this.props)
  }

  vanWatinAlert() {
    alert("준비중입니다.");
  }
  // 가맹점 검색
  onSearchFranchisee = (value) => {
    this.setState(
      {
        frName: value,
        pagination: {
          total: 0,
          current: 1,
          pageSize: this.state.pagination.pageSize,
        },
      },
      () => {
        this.getList();
      }
    );
  };

  handleTableChange = (pagination) => {
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
    httpPost(httpUrl.franchiseList, [], {
      frName: this.state.frName,
      pageNum: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      userGroup: this.state.franGroup,
      userStatus: this.state.franStatus === 0 ? "" : this.state.franStatus,
    }).then((result) => {
      const pagination = {
        ...this.state.pagination,
      };
      pagination.current = result.data.currentPage;
      pagination.total = result.data.totalCount;
      this.setState({ list: result.data.franchises, pagination });
    });
  };

  onSearchFranchiseDetail = (data) => {
    console.log("### get fran list data : " + data);
    // this.setState({list: data});
  };

  // 가맹점등록 dialog
  openRegistFranchiseModal = () => {
    this.setState({ ResistFranchiseOpen: true });
  };
  closeRegistFranchiseModal = () => {
    this.setState({ ResistFranchiseOpen: false });
  };
  // 가맹점수정 dialog
  openModifyFranModal = (row) => {
    this.setState({
      modifyFranOpen: true,
      dialogData: row,
    });
  };

  closeModifyFranModal = () => {
    this.setState({ modifyFranOpen: false });
    this.getList();
  };

  // 주소검색관리 dialog
  openSearchAddressModal = () => {
    this.setState({ SearchAddressOpen: true });
  };
  closeSearchAddressModal = () => {
    this.setState({ SearchAddressOpen: false });
  };

  // VAN등록요청 dialog
  closeResistVANModal = () => {
    this.setState({ ResistVANOpen: false });
  };

  // // 블라인드관리 dialog
  // openBlindControlModal = () => {
  //   this.setState({ blindControlOpen: true });
  // };
  // closeBlindControlModal = () => {
  //   this.setState({ blindControlOpen: false });
  // };

  // 출금계좌 dialog
  openAccountModal = () => {
    this.setState({ accountRegistOpen: true });
  };
  closeAccountModal = () => {
    this.setState({ accountRegistOpen: false });
    this.getList();
  };

  // 블라인드 dialog
  openBlindModal = () => {
    this.setState({ blindListOpen: true });
  };
  closeBlindModal = () => {
    this.setState({ blindListOpen: false });
  };

  // 출금설정
  onSetting = (value) => {
    let withdrawSet = value;
    this.setState(
      {
        withdrawSet: withdrawSet,
      },
      () => {
        this.getList();
      }
    );
  };

  // 상태설정
  onStatusSetting = (value) => {
    let franStatus = value;
    this.setState(
      {
        franStatus: franStatus,
      },
      () => {
        this.getList();
      }
    );
  };

  // 가맹점 상태변경
  onChangeStatus = (idx, value) => {
    httpPost(httpUrl.franchiseUpdate, [], {
      idx: idx,
      userStatus: value,
    })
      .then((res) => {
        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
          updateComplete();
        } else {
          updateError();
        }
        this.getList();
      })
      .catch((e) => {
        updateError();
      });
  };
  getLatLng = async (address, formData) => {
    try {
      console.log("getLatLng start");
      const res = await httpGet(httpUrl.getGeocode, [address], {});
      if (res.result === "SUCCESS") {
        const data = JSON.parse(res.data.json);
        if (data.addresses.length > 0) {
          formData.latitude = parseFloat(data.addresses[0].y);
          formData.longitude = parseFloat(data.addresses[0].x);
          console.log("getLatLng end");
        }
      } else {
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  getFrSalesUserIdx = async (formData) => {
    try {
      console.log("getFrSalesUserIdx start");
      const res = await httpGet(
        httpUrl.riderList,
        [10000, 1, formData.frSalesUserIdx, 1, [1, 2, 3, 4, 5, 6, 7]],
        {}
      );
      console.log(res);
      if (res.data.riders.length > 0) {
        formData["frSalesUserIdx"] = res.data.riders[0].idx;
        console.log("getFrSalesUserIdx end");
        return;
      } else {
        return;
      }
    } catch (e) {
      throw e;
    }
  };

  createFranchise = async (formData, i, failedIdx, failedFrName) => {
    console.log(`${i} start`);
    try {
      const res = await httpPost(httpUrl.registFranchise, [], formData);
      if (res.result === "SUCCESS") {
      } else {
        failedIdx.push(i + 1);
        failedFrName.push(formData.frName);
        console.log(failedIdx);
      }
    } catch (e) {
      failedIdx.push(i + 1);
      failedFrName.push(formData.frName);
      console.log(failedIdx);
      // throw e;
    }
    console.log(`${i} done`);
  };

  handleExcelRegist = async () => {
    if (this.state.data) {
      let failedIdx = [];
      let failedFrName = [];
      for (let i = 0; i < this.state.data.length; i++) {
        const data = this.state.data[i];

        const formData = {
          // // EXCEL 로 받는 데이터
          branchIdx: this.props.branchIdx,
          id: data["아이디"],
          frName: data["가맹점명"],
          businessNumber: data["사업자번호"],
          frPhone: data["가맹점 전화번호"],
          phone: data["휴대전화"],
          addr1: data["주소"],
          addr3: data["지번주소"],
          addr2: data["상세주소"],
          password: String(data["비밀번호"]),
          tidNormalRate: data["PG사용여부"] === "사용" ? 0 : 100,
          agreeSms: data["sms 수신여부"] === "수신" ? true : false,
          isMember: data["가맹여부"] === "가맹" ? true : false,
          nonmemberFee: data["가맹여부"] === "가맹" ? 0 : 1000,
          ownerName: data["대표자 성명"],
          frSalesUserIdx: data["영업담당자 성명"],
          chargeDate: data["월회비 최초납부일"],
          dues: data["관리비"],
          registDate: data["가입일자"],
          memo: data["메모"],
          email: data["이메일"],
          overload: data["과적기준"],

          // // 신규 가맹점 DEFAULT
          ncash: 0,
          userType: 2,
          bank: "",
          bankAccount: 0,
          depositor: "",
          userGroup: 0,
          frStatus: 1,
          ncashPayEnabled: false,
          tidNormal: "",
          tidPrepay: "",
          duesAutoChargeEnabled: false,
          // chargeDate: 1,

          // api 찾기
          latitude: 0,
          longitude: 0,

          // 삭제컬럼
          basicDeliveryPrice: 0,
          basicDeliveryDistance: 0,
        };

        await this.getLatLng(data["주소"], formData);
        await this.getFrSalesUserIdx(formData);

        console.log(formData);

        await this.createFranchise(formData, i, failedIdx, failedFrName);
      }
      if (failedIdx.length > 0) {
        Modal.info({
          title: `${failedIdx.length}개의 요청 실패`,
          content: `${failedIdx} 번째 등록이 실패했습니다. \n
        ${failedFrName}의 등록이 실패했습니다. `,
        });
      } else {
        Modal.info({
          title: "등록 성공",
          content: "모든 가맹점이 등록되었습니다.",
        });
      }
    } else {
      Modal.info({
        title: "등록 오류",
        content: "엑셀파일을 등록해주세요.",
      });
    }
  };

  // 출금설정 변경
  onChangeWithdraw = (idx, value) => {
    httpPost(httpUrl.franchiseUpdate, [], {
      idx: idx,
      withdrawEnabled: value,
    })
      .then((res) => {
        if (res.result === "SUCCESS" && res.data === "SUCCESS") {
          updateComplete();
        } else {
          updateError();
        }
        this.getList();
      })
      .catch((e) => {
        updateError();
      });
  };

  readExcel = (e) => {
    let self = this;
    let input = e.target;
    let reader = new FileReader();
    reader.onload = () => {
      let data = reader.result;
      let workBook = XLSX.read(data, { type: "binary" });
      var rows = XLSX.utils.sheet_to_json(
        workBook.Sheets[workBook.SheetNames[0]]
      );
      console.log(rows);
      self.setState({ data: rows });
      // workBook.SheetNames.forEach((sheetName) => {
      //   var rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
      //   self.setState({ data: rows }, () => console.log(self.state.data));
      // });
    };
    reader.readAsBinaryString(input.files[0]);
  };

  render() {
    const columns = [
      // 모바일
      {
        title: "가맹점 정보",
        dataIndex: "frName",
        className: "table-column-center mobile",
        render: (data, row) => (
          <div className="status-box">
            <p>
              {row.frName}
              <br />
            </p>
            사업자: {row.businessNumber}
            <br />
            가맹점: {row.frPhone}
            <br />
            대표자: {row.phone}
            <br />
            주소: {row.addr1}
            <br />
            {/* 코인잔액: {comma(row.ncash)} */}
            <div>
              상태 :{" "}
              <SelectBox
                value={statusString[row.userStatus]}
                code={Object.keys(statusString)}
                codeString={statusString}
                onChange={(value) => {
                  if (parseInt(value) !== row.userStatus) {
                    this.onChangeStatus(row.idx, value);
                  }
                }}
              />
              <Button
                className="tabBtn surchargeTab blind-mobilebtn"
                onClick={() =>
                  this.setState({ blindListOpen: true, blindFrData: row })
                }
              >
                블라인드
              </Button>
            </div>
          </div>
        ),
      },
      {
        title: "상태",
        dataIndex: "userStatus",
        className: "table-column-center desk",
        // filters: [
        //   {
        //     text: "사용",
        //     value: 1,
        //   },
        //   {
        //     text: "중지",
        //     value: 2,
        //   },
        //   {
        //     text: "탈퇴",
        //     value: 3,
        //   },
        // ],
        // onFilter: (value, record) => value === record.userStatus,
        render: (data, row) => (
          <div>
            <SelectBox
              value={statusString[data]}
              code={Object.keys(statusString)}
              codeString={statusString}
              onChange={(value) => {
                if (parseInt(value) !== row.userStatus) {
                  this.onChangeStatus(row.idx, value);
                }
              }}
            />
          </div>
        ),
      },
      {
        title: "순번",
        dataIndex: "idx",
        className: "table-column-center desk",
        sorter: (a, b) => a.idx - b.idx,
        render: (data) => <div className="c-p-20">{data}</div>,
      },
      {
        title: "가맹점명",
        dataIndex: "frName",
        className: "table-column-center desk",
        sorter: (a, b) => a.frName.localeCompare(b.frName),
      },
      {
        title: "사업자번호",
        dataIndex: "businessNumber",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-10">{data}</div>,

      },
      {
        title: "가맹점번호",
        dataIndex: "frPhone",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-10">{data}</div>,

      },
      {
        title: "대표자번호",
        dataIndex: "phone",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-10">{data}</div>,
      },
      {
        title: "주소",
        dataIndex: "addr1",
        className: "table-column-center desk",
        sorter: (a, b) => (a.addr1 + a.addr2).localeCompare(b.addr1 + b.addr2),
        render: (data, row) => <div>{row.addr1 + " " + row.addr2}</div>,
      },
      {
        title: "코인잔액",
        dataIndex: "ncash",
        className: "table-column-center desk",
        sorter: (a, b) => a.ncash - b.ncash,
        render: (data) => <div className="c-p-10">{comma(data)}</div>,
      },
      // {
      //   title: "잔액",
      //   dataIndex: "ncash",
      //   className: "table-column-center mobile",
      //   render: (data) => <div>{comma(data)}</div>,
      // },
      // {
      //   title: "기본배달요금",
      //   dataIndex: "basicDeliveryPrice",
      //   className: "table-column-center",
      //   render: (data) => <div>{comma(data)}</div>,
      // },
      // 가맹여부 추가 후 컬럼이름 확인 필요
      // 가맹여부 추가 후 컬럼이름 확인 필요
      // {
      //   title: "금액",
      //   dataIndex: "",
      //   className: "table-column-center",
      //   render: (data) => <div>{}</div>,
      // },

      // {
      //   title: "출금설정",
      //   dataIndex: "withdrawEnabled",
      //   className: "table-column-center desk",
      //   render: (data, row) => (
      //     <div>
      //       <SelectBox
      //         value={withdrawString[data]}
      //         code={Object.keys(withdrawString)}
      //         codeString={withdrawString}
      //         onChange={(value) => {
      //           console.log(value, row.withdrawEnabled);
      //           if (value !== row.withdrawEnabled.toString()) {
      //             this.onChangeWithdraw(row.idx, value);
      //           }
      //         }}
      //       />
      //     </div>
      //   ),
      // },
      // {
      //   title: "월회비 최초납부일",
      //   dataIndex: "chargeDate",
      //   className: "table-column-center desk",
      //   render: (data) => <div>{formatDateToDay(data)}</div>,
      // },
      // {
      //   title: "가맹여부",
      //   dataIndex: "isMember",
      //   className: "table-column-center desk",
      //   render: (data) => <div>{data ? "가맹" : "무가맹"}</div>,
      // },

      // {
      //   title: "적용타입",
      //   dataIndex: "applyType",
      //   className: "table-column-center",
      //   render: (data) => <div>{}</div>,
      // },
      // {
      //   title: "월회비",
      //   dataIndex: "dues",
      //   className: "table-column-center desk",
      //   render: (data, row) => <div>{row.isMember ? data : "-"}</div>,
      // },
      // {
      //   title: "카드가맹상태",
      //   dataIndex: "cardStatus",
      //   className: "table-column-center",
      //   render: (data) => <div>{cardStatus[data]}</div>,
      // },
      {
        title: "VAN",
        dataIndex: "tidNormal",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-20">{data}</div>,
      },
      {
        title: "PG",
        dataIndex: "tidPrepay",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-15">{data}</div>,
      },
      {
        title: "PG 사용여부",
        dataIndex: "tidNormalRate",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-25">{data === 100 ? "미사용" : "사용"}</div>,
      },
      {
        title: "메모",
        dataIndex: "memo",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-25">{data}</div>,

      },
      {
        title: "출금계좌 정보",
        className: "table-column-center desk",
        render: (data, row) => <div className="c-p-10">{row.bank.split(',')[0] + " " + row.bankAccount}</div>,
      },
      {
        title: "가입일",
        dataIndex: "registDate",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-25">{formatDateToDay(data)}</div>,
      },
      {
        title: "영업담당자",
        dataIndex: "frSalesRiderName",
        className: "table-column-center desk",
        render: (data) => <div className="c-p-25">{data}</div>,
      },
      // {
      //   title: "영업담당자",
      //   dataIndex: "registDate",
      //   className: "table-column-center",
      //   render: (data) => <div>{formatDate(data)}</div>,
      // },
      {
        title: "VAN등록요청",
        className: "table-column-center desk",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              // onClick={() => this.setState({ ResistVANOpen: true })}
              onClick={this.vanWatinAlert}
            >
              등록요청
            </Button>
          </div>
        ),
      },
      {
        title: "출금계좌",
        className: "table-column-center desk",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() =>
                this.setState({ accountRegistOpen: true, accountData: row })
              }
            >
              등록/수정
            </Button>
          </div>
        ),
      },
      {
        title: "블라인드",
        className: "table-column-center desk",
        render: (data, row) => (
          <div>
            <Button
              className="tabBtn surchargeTab"
              onClick={() =>
                this.setState({ blindListOpen: true, blindFrData: row })
              }
            >
              블라인드
            </Button>
          </div>
        ),
      },
      {
        title: "수정",
        className: "table-column-center desk",
        render: (data, row) => (
          <div>
            {/* {this.state.modifyFranOpen && (
                <RegistFranDialog
                  close={this.closeModifyFranModal}
                  data={this.state.dialogData}
                />
              )} */}
            <Button
              className="tabBtn surchargeTab"
              onClick={() =>
                this.setState({ modifyFranOpen: true, dialogData: row })
              }
            >
              수정하기
            </Button>
          </div>
        ),
      },
    ];

    const expandedRowRender = (record) => {
      const dropColumns = [
        // 모바일
        {
          title: "세부정보",
          dataIndex: "chargeDate",
          className: "table-column-center mobile",
          render: (data, row) => (
            <div>
              <b>코인잔액:</b> {comma(row.ncash)}
              <br />
              {/* <b>가맹여부:</b> {row.isMember ? "가맹" : "무가맹"} */}
              {/* <br /> */}
              <b>가입일:</b> {formatDateToDay(row.registDate)}
              <br />
              {/* <b>최초납부일:</b> {formatDateToDay(row.chargeDate)}
              <br /> */}
              {/* <b>월회비:</b> {row.isMember ? row.dues : "-"} */}
              {/* <br /> */}
              <b>VAN:</b> {row.tidNormal}
              <br />
              <b>PG:</b> {row.tidPrepay}
              <br />
              <b>PG사용여부:</b>
              {row.tidNormalRate === 100 ? "미사용" : "사용"}
              <br />
              <b>출금계좌:</b> {row.bank + " " + row.bankAccount}
              <br />
              <b>영업담당자:</b> {row.frSalesRiderName}
              <br />
            </div>
          ),
        },

        // {
        //   title: "월회비 최초납부일",
        //   dataIndex: "chargeDate",
        //   className: "table-column-center desk",
        //   render: (data) => <div>{formatDateToDay(data)}</div>,
        // },
        // {
        //   title: "가맹여부",
        //   dataIndex: "isMember",
        //   className: "table-column-center desk",
        //   render: (data) => <div>{data ? "가맹" : "무가맹"}</div>,
        // },

        // {
        //   title: "적용타입",
        //   dataIndex: "applyType",
        //   className: "table-column-center",
        //   render: (data) => <div>{}</div>,
        // },
        // {
        //   title: "월회비",
        //   dataIndex: "dues",
        //   className: "table-column-center desk",
        //   render: (data, row) => <div>{row.isMember ? data : "-"}</div>,
        // },
        // {
        //   title: "카드가맹상태",
        //   dataIndex: "cardStatus",
        //   className: "table-column-center",
        //   render: (data) => <div>{cardStatus[data]}</div>,
        // },
        // {
        //   title: "VAN",
        //   dataIndex: "tidNormal",
        //   className: "table-column-center desk",
        //   render: (data) => <div>{data}</div>,
        // },
        // {
        //   title: "PG",
        //   dataIndex: "tidPrepay",
        //   className: "table-column-center desk",
        //   render: (data) => <div>{data}</div>,
        // },
        // {
        //   title: "PG 사용여부",
        //   dataIndex: "tidNormalRate",
        //   className: "table-column-center desk",
        //   render: (data) => <div>{data === 100 ? "미사용" : "사용"}</div>,
        // },
        // {
        //   title: "메모",
        //   dataIndex: "memo",
        //   className: "table-column-center desk",
        // },
        // {
        //   title: "출금계좌 정보",
        //   className: "table-column-center desk",
        //   render: (data, row) => <div>{row.bank.split(',')[0] + " " + row.bankAccount}</div>,
        // },
        // {
        //   title: "가입일",
        //   dataIndex: "registDate",
        //   className: "table-column-center desk",
        //   render: (data) => <div>{formatDateToDay(data)}</div>,
        // },
        // {
        //   title: "영업담당자",
        //   dataIndex: "frSalesRiderName",
        //   className: "table-column-center desk",
        //   render: (data) => <div>{data}</div>,
        // },
        // {
        //   title: "영업담당자",
        //   dataIndex: "registDate",
        //   className: "table-column-center",
        //   render: (data) => <div>{formatDate(data)}</div>,
        // },
      ];

      return (
        <Table
          className="droptable_fr mobile"
          rowKey={(record) => `record: ${record.idx}`}
          columns={dropColumns}
          dataSource={[record]}
          pagination={false}
        />
      );
    };

    return (
      <div>


        <div className="franchiseContainer">
          <Affix offsetTop={5}>

            <div className="selectLayout">
              <div className="searchRequirementText desk">검색조건</div>
              <SelectBox
                value={tableStatusString[this.state.franStatus]}
                code={Object.keys(tableStatusString)}
                codeString={tableStatusString}
                onChange={(value) => {
                  if (parseInt(value) !== this.state.franStatus) {
                    this.setState(
                      {
                        franStatus: parseInt(value),
                        pagination: {
                          total: 0,
                          current: 1,
                          pageSize: this.state.pagination.pageSize,
                        },
                      },
                      () => this.getList()
                    );
                  }
                }}
              />

              <Search
                placeholder="가맹점검색"
                className="searchFranchiseInput"
                enterButton
                allowClear
                onSearch={this.onSearchFranchisee}
                style={{}}
              />
              {this.state.ResistFranchiseOpen && (
                <RegistFranDialog
                  getList={this.getList}
                  close={this.closeRegistFranchiseModal}
                />
              )}
              <Button
                icon={<BankOutlined />}
                className="tabBtn addFranTab"
                onClick={this.openRegistFranchiseModal}
              >
                가맹점등록
              </Button>
              {this.state.SearchAddressOpen && (
                <SearchAddressDialog
                  isOpen={this.state.SearchAddressOpen}
                  close={this.closeSearchAddressModal}
                />
              )}
              <Button
                className="tabBtn sectionTab"
                onClick={this.openSearchAddressModal}
              >
                주소검색관리
              </Button>
              {/* VAN등록요청 */}
              {this.state.ResistVANOpen && (
                <RegistVANDialog
                  close={this.closeResistVANModal}
                // data={this.state.ResistVANData}
                />
              )}
              {/* {this.state.blindControlOpen && (
            <BlindControlDialog
            isOpen={this.state.blindControlOpen}
            close={this.closeBlindControlModal}
            />
            )}
            <Button
            className="tabBtn sectionTab"
            onClick={this.openBlindControlModal}
            >
            블라인드관리
          </Button> */}

              {/* 출금계좌 */}
              {this.state.accountRegistOpen && (
                <RegistAccountDialog
                  close={this.closeAccountModal}
                  data={this.state.accountData}
                />
              )}

              {/* 블라인드 */}
              {this.state.blindListOpen && (
                <BlindFranListDialog
                  close={this.closeBlindModal}
                  data={this.state.blindFrData}
                />
              )}

              {/* 엑셀업로드버튼 */}
              <a href="/franchise_regist_templete.xlsx" download className="desk">
                <Button className="tabBtn sectionTab exel">
                  <img src={require("../../img/login/excel.png").default} alt="" />
                  양식 다운로드
                </Button>
              </a>

              <Button
                className="tabBtn sectionTab exel desk"
                onClick={() => this.setState({ inputOpen: !this.state.inputOpen })}
              >
                <img src={require("../../img/login/excel.png").default} alt="" />
                올리기
              </Button>


              {this.state.inputOpen && (
                <>
                  <div
                    className="orderPayment-wrapper desk"
                    style={{ marginTop: "15px" }}
                  >
                    <Input type="file" onChange={this.readExcel} />
                    <Button
                      style={{ height: "40px" }}
                      onClick={() => this.handleExcelRegist()}
                    >
                      일괄등록
                    </Button>
                  </div>
                </>
              )}
            </div>

          </Affix>
          {this.state.modifyFranOpen && (
            <RegistFranDialog
              getList={this.getList}
              isOpen={this.state.modifyFranOpen}
              close={this.closeModifyFranModal}
              data={this.state.dialogData}
            />
          )}

          <div className="dataTableLayout2 desk">
            <Table
              rowKey={(record) => record.idx}
              dataSource={this.state.list}
              columns={columns}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
              // expandedRowRender={expandedRowRender}
              // scroll={{ y: "50vh" }}
              scroll={{ x: true }}
              sticky={{ offsetHeader: 60 }}
            />
          </div>
          <div className="dataTableLayout2 mobile">
            <Table
              rowKey={(record) => record.idx}
              dataSource={this.state.list}
              columns={columns}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
              expandedRowRender={expandedRowRender}
            // scroll={{ y: "50vh" }}
            // scroll={{ x: true }}
            // sticky={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  branchIdx: state.login.loginInfo.branchIdx,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FranchiseMain);
