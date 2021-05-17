const deliveryStatusCode = [
    '',
    '대기중',
    '픽업중',
    '배달중',
    '완료',
    '취소',
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
    1 : [2, 5],
    2 : [3, 5],
    3 : [4, 5],
    4 : [1, 2, 3],
    5 : [1],
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
    preparationStatus, 
    cardStatus, 
    paymentMethod, 
    modifyType, 
    rowColorName,
};