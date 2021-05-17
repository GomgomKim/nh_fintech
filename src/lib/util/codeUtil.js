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
 };
