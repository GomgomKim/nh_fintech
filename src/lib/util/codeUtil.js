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
  2: [1, 3, 5],
  3: [2, 4, 5],
  4: [1, 2, 3],
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

const orderCnt = {
  0: "전체",
  1: "1개",
  2: "2개",
  3: "3개",
  4: "4개",
  5: "5개 이상",
}

const blockString = {
  0: "차단중",
  1: "차단해제",
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

const pgUseRate = [
  // "",
  "100%",
  "0%",
];

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

const surchargeType = [
    "지점 전체",
    "지정 그룹"
]

const addType = [
  "",
  "아파트",
  "오피스텔",
];

export {
  deliveryStatusCode,
  blockString,
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
  surchargeType
};
