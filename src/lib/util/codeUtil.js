// 접수현황 - 상태
const deliveryStatusCode = [
    '',
    '대기중',
    '픽업중',
    '배달중',
    '완료',
    '취소',
]

// 접수현황 - 준비시간
const preparationStatus = [
    '준비중',
    '완료',
]

// 접수현황 - 결재방식
const paymentMethod = [
    '선결',
    '카드',
]

// 접수현황, 가맹점관리 - 카드상태
const cardStatus = [
    '요청',
    '등록완료',
]

// 접수현황 - 상태 변경 가능한 경우
// key : 기존 값 / value : 변경 가능한 값
const modifyType = {
    1 : [2, 5],
    2 : [3, 5],
    3 : [4, 5],
    4 : [1, 2, 3],
    5 : [1],
}

// 접수현황 - 상태 값에 따라 테이블 색 변경
const rowColorName = [
    '',
    'table-red',
    'table-blue',
    'table-white',
    'table-gray',
    'table-gray',
]

// 가맹점, 기사관리 - 상태
const statusString = {
    1: "사용",
    2: "중지",
    3: "탈퇴",
}

// 가맹점 - 출금설정
const withdrawString = {
    true: "출금 가능",
    false: "출금 금지",
}

const blockString = {
    0: " - ",
    1: "차단해제",
}


const toggleCode = [
    0,
    1,
]

const enabledString = {
    false: "OFF",
    true: "ON",
}

const enabledCode = [
    false, 
    true,
]

const staffString = {
    1: "근무",
    2: "중지",
    3: "퇴사",
}

const statusCode = [
    1, 
    2, 
    3,
]

// 상태 2개일 때
const statusCodeTwo = [
    1,
    2,
]

export { 
    deliveryStatusCode,
    blockString,
    withdrawString,
    toggleCode,
    enabledString,
    statusCodeTwo,
    enabledCode,
    statusString,
    staffString,
    statusCode,
    preparationStatus, 
    cardStatus, 
    paymentMethod, 
    modifyType, 
    rowColorName,
};