// 접수현황 - 상태
const deliveryStatusCode = ["", "접수", "배차", "픽업", "완료", "취소"];

// 접수현황 - 준비시간
const preparationStatus = ["준비중", "완료"];

// 접수현황 - 결재방식
const paymentMethod = ["", "카드", "현금", "선결"];

// 접수현황 - 결제 상태
const paymentStatus = ["", "요청", "완료", "취소", "에러", "삭제"];

// 접수현황, 가맹점관리 - 카드상태
const cardStatus = ["요청", "등록완료"];

// 접수현황 - 상태 변경 가능한 경우
// key : 기존 값 / value : 변경 가능한 값
const modifyType = {
  1: [2, 5],
  2: [1, 5],
  3: [1, 2, 5],
  4: [],
  5: [1],
};

// 접수현황 - 상태 값에 따라 테이블 색 변경
const rowColorName = [
  "",
  "table-red",
  "table-blue",
  "table-white",
  "table-gray",
  "table-gray",
];

// 가맹점, 기사관리 - 상태
const statusString = {
  1: "사용",
  2: "중지",
  3: "탈퇴",
};

// 가맹점, 기사관리 - 상태 선택
const tableStatusString = {
  0: "전체",
  1: "사용",
  2: "중지",
  3: "탈퇴",
};

const kindString = [
  // "전체",
  "",
  "리스료",
  "대출 상환",
  "산재 보험비",
];

// 가맹점 - 출금설정
const withdrawString = {
  true: "출금 가능",
  false: "출금 금지",
};

// 유저 그룹
const userGroupString = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
};

// 수수료 방식
const feeManner = {
  1: "정량",
  2: "정률",
};

const importantNotice = {
  false: "table-white",
  true: "table-blue",
};

const orderCnt = {
  99: "전체",
  0: "0개",
  1: "1개",
  2: "2개",
  3: "3개",
  4: "4개",
  5: "5개 이상",
};

const blockString = {
  0: "처리대기",
  1: "차단중",
  2: "차단해제",
  3: "차단거부",
  4: "요청해제",
};

const blockStatusString = {
  2: "승인처리",
  3: "승인거부",
};

const frRiderString = {
  1: "기사",
  2: "가맹점",
};

const toggleCode = [0, 1];

const enabledString = {
  false: "OFF",
  true: "ON",
};

const enabledCode = [false, true];

const staffString = {
  1: "근무",
  2: "중지",
  3: "퇴사",
};

const riderGroupString = ["", "A", "B", "C", "D", "E"];

const riderStatusCode = ['', '근무', '휴식', '퇴근'];

const riderLevelText = [
  "",
  "라이더",
  "부팀장",
  "팀장",
  "부본부장",
  "본부장",
  "부지점장",
  "지점장",
  "부센터장",
  "센터장",
];

// const riderLevelText = ["", "라이더", "소속팀장", "본부장", "지점장", "센터장"];

const pgUseRate = {
  100: "미사용",
  0: "사용",
};

const arriveReqTime = {
  5: "5분",
  10: "10분",
  15: "15분",
  20: "20분",
  30: "30분",
  40: "40분",
  1005: "후5분",
  1010: "후10분",
};

const packAmount = {
  1: "1개",
  2: "2개",
  3: "3개",
  4: "4개",
  5: "5개이상",
};

const surchargeType = ["지점 전체", "지정 그룹"];

const addType = ["", "아파트", "오피스텔"];

const bikeType = ["리스", "지입"];

// 바이크 조회 모달
const searchBike = {
  0: "전체",
  1: "번호",
  2: "모델명",
  3: "제조사",
};

const deliveryPriceFeeType = ["정률", "정액"];

// 상품관리 - 상태
const buyStatusString = {
  0: "",
  1: "수령대기",
  2: "수령완료",
  3: "환불요청",
  4: "환불완료",
};

// 공지사항 카테고리
const noticeCategoryType = {
  1: "전체",
  2: "라이더",
  3: "가맹점",
};

const bankCode = {
  경남은행: "039",
  광주은행: "034",
  국민은행: "004",
  기업은행: "003",
  농협: "011",
  단위농협: "012",
  대구은행: "031",
  부산은행: "032",
  산림조합: "064",
  산업은행: "002",
  상호저죽: "050",
  새마을금고: "045",
  수협: "007",
  신한은행: "088",
  신협: "048",
  우리은행: "020",
  우체국: "071",
  전북은행: "037",
  제주은행: "035",
  KEB하나은행: "081",
  한국시티은행: "027",
  SC제일은행: "023",
  K뱅크: "089",
  카카오뱅크: "090",
};

const items = [
  "헬멧",
  "조끼",
  "배달통",
  "보냉",
  "우의",
  "피자가방",
  "여름티",
  "토시",
  "바람막이",
  "카드리더기",
];

// const deliveryZone ={
//   0: "감정동",
//   1: "걸포동",
//   2: "고촌읍",
//   3: "구래동",
//   4: "대곶면",
//   5: "마산동",
//   6: "북변동",
//   7: "사우동",
//   8: "양촌읍",
//   9: "운양동",
//   10: "월곶면",
//   11: "장기동",
//   12: "통진읍",
//   13: "풍무동",
//   14: "하성면",
// };

const deliveryZone = [
  {
    code: 0,
    text: "감정동",
    toggle: false,
    coords: [],
  },
  {
    code: 1,
    text: "걸포동",
    toggle: false,
  },
  {
    code: 2,
    text: "고촌읍",
    toggle: false,
  },
  {
    code: 3,
    text: "구래동",
    toggle: false,
  },
  {
    code: 4,
    text: "대곶면",
    toggle: false,
  },
  {
    code: 5,
    text: "마산동",
    toggle: false,
  },
  {
    code: 6,
    text: "북변동",
    toggle: false,
  },

  {
    code: 7,
    text: "사우동",
    toggle: false,
  },

  {
    code: 8,
    text: "양촌읍",
    toggle: false,
  },

  {
    code: 9,
    text: "운양동",
    toggle: false,
  },

  {
    code: 10,
    text: "월곶면",
    toggle: false,
  },
];

export {
  deliveryStatusCode,
  blockString,
  blockStatusString,
  frRiderString,
  withdrawString,
  toggleCode,
  enabledString,
  enabledCode,
  statusString,
  staffString,
  preparationStatus,
  cardStatus,
  paymentMethod,
  paymentStatus,
  modifyType,
  rowColorName,
  riderLevelText,
  userGroupString,
  riderGroupString,
  pgUseRate,
  tableStatusString,
  feeManner,
  arriveReqTime,
  packAmount,
  addType,
  orderCnt,
  surchargeType,
  importantNotice,
  bikeType,
  searchBike,
  deliveryPriceFeeType,
  buyStatusString,
  bankCode,
  noticeCategoryType,
  items,
  deliveryZone,
  riderStatusCode,
  kindString,
};

