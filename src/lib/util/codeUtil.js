const deliveryStatusCode = [
    '',
    '대기중',
    '픽업중',
    '배달중',
    '완료',
    '취소',
]

const blockString = {
    0: " - ",
    1: "차단해제",
}

const withdrawString = {
    0: "출금 가능",
    1: "출금 금지",
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

const statusString = {
    1: "사용",
    2: "중지",
    3: "탈퇴",
}

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

const riderStatusCode = [
    1,
    2,
    3,
]

const preparationStatus = [
    '준비중',
    '완료',
]

const paymentMethod = [
    '선결',
    '카드',
]

const cardStatus = [
    '요청',
    '등록완료',
]

const modifyType = {
    1: [2, 5],
    2: [3, 5],
    3: [4, 5],
    4: [1, 2, 3],
    5: [1],
}


const rowColorName = [
    '',
    'table-red',
    'table-blue',
    'table-white',
    'table-gray',
    'table-gray',
]

export {
    deliveryStatusCode,
    blockString,
    withdrawString,
    toggleCode,
    enabledString,
    enabledCode,
    statusString,
    staffString,
    statusCode,
    riderStatusCode,
    preparationStatus,
    cardStatus,
    paymentMethod,
    modifyType,
    rowColorName,
};