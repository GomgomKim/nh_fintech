import { Result } from 'antd';
import faker from 'faker';
import shortid from 'shortid';

//     ex Call

//     idx: 1,
//     pickupStatus: this.state.firstStatus,
//     preparationStatus: 0,
//     requestTime: '2021-04-21 12:00:00',
//     preparationTime: '10분',
//     elapsedTime: '15',
//     pickupTime: '2021-04-21 12:00:00',
//     completionTime: '2021-04-21 12:00:00',
//     riderName: '김기연',
//     franchiseeName: '곰곰',
//     deliveryCharge: 1000,
//     destination: '서울시 노원구 123동',
//     charge: 60000,
//     paymentMethod: 0,
//     fees: -200,
//     distance: 0.91,
//     cardStatus: 0,
//     authNum: 0,
//     businessCardName: '신한',
//     riderPhoneNum: '010-1234-5678',
//     franchiseName: '풀러스김포',
//     payAmount: 20000,
//     changes: '',
//     riderBelong: '플러스김포',
//     receiptAmount: 192,
//     franchisePhoneNum: '031-1234-5678',

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const createDummyCall = (number) => {
    faker.locale='ko';
    var result = [];
    for (let i = 0; i < number; i++) {
        const Call = {
            idx: shortid.generate(),
            pickupStatus: getRandomInt(1, 6),
            preparationStatus: getRandomInt(0, 2),
            requestTime: faker.date.recent(),
            preparationTime: getRandomInt(1, 61).toString() + '분',
            elapsedTime: getRandomInt(1,60).toString(),
            pickupTime: faker.date.recent(),
            completionTime: faker.date.recent(),
            riderName: faker.name.lastName() + faker.name.firstName(),
            franchiseeName: faker.company.companyName(),
            deliveryCharge: getRandomInt(1000, 100000),
            destination: faker.address.city() + ' ' + faker.address.streetName() + ' ' + faker.address.streetAddress() + ' ' + faker.address.secondaryAddress(),
            charge: getRandomInt(1000, 100000),
            paymentMethod: getRandomInt(0, 3),
            fees: -getRandomInt(1000, 100000),
            distance: Math.random(0, 5),
            cardStatus: 0,
            authNum: 0,
            businessCardName: faker.company.suffixes(),
            riderPhoneNum: faker.phone.phoneNumber(),
            franchiseName: '풀러스김포',
            payAmount: getRandomInt(1000, 100000),
            changes: '',
            riderBelong: '플러스김포',
            receiptAmount: getRandomInt(0, 500),
            franchisePhoneNum: faker.phone.phoneNumber(),
        }
        result.push(Call);
    }
    return result;
}

export default createDummyCall;