import faker from "faker";
import shortid from "shortid";
import { dateFormat } from "./dateUtil";
import { comma } from "./numberUtil";

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

// api order

// {
//     "arriveReqDate": "2021-05-18T02:54:55.865Z",
//     "assignDate": "2021-05-18T02:54:55.865Z",
//     "cancelReason": "string",
//     "completeDate": "2021-05-18T02:54:55.865Z",
//     "custMessage": "string",
//     "custPhone": "string",
//     "deliveryPrice": 0,
//     "deliveryPriceFee": 0,
//     "destAddr1": "string",
//     "destAddr2": "string",
//     "destAddr3": "string",
//     "distance": 0,
//     "frId": "string",
//     "frLatitude": 0,
//     "frLongitude": 0,
//     "frName": "string",
//     "frPhone": "string",
//     "idx": 0,
//     "itemPrepared": true,
//     "itemPreparingTime": 0,
//     "latitude": 0,
//     "longitude": 0,
//     "memo": "string",
//     "ncashPayEnabled": true,
//     "orderIdx": 0,
//     "orderPayments": [
//       {
//         "paymentAmount": 0,
//         "paymentMethod": 0,
//         "paymentStatus": 0
//       }
//     ],
//     "orderPrice": 0,
//     "orderStatus": 0,
//     "pickupDate": "2021-05-18T02:54:55.865Z",
//     "riderName": "string",
//     "riderPhone": "string",
//     "tidNormal": "string",
//     "tidNormalRate": 0,
//     "tidPrepay": "string",
//     "userIdx": 0
//   }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const createDummyCall = (number) => {
  faker.locale = "ko";
  var result = [];
  for (let i = 0; i < number; i++) {
    const Call = {
      idx: shortid.generate(),
      pickupStatus: getRandomInt(1, 6),
      preparationStatus: getRandomInt(0, 2),
      requestTime: faker.date.recent(),
      preparationTime: getRandomInt(1, 61).toString() + "분",
      elapsedTime: getRandomInt(1, 60).toString(),
      pickupTime: faker.date.recent(),
      completionTime: faker.date.recent(),
      riderName: faker.name.lastName() + faker.name.firstName(),
      franchiseeName: faker.company.companyName(),
      deliveryCharge: getRandomInt(1000, 100000),
      destination:
        faker.address.city() +
        " " +
        faker.address.streetName() +
        " " +
        faker.address.streetAddress() +
        " " +
        faker.address.secondaryAddress(),
      charge: getRandomInt(1000, 100000),
      paymentMethod: getRandomInt(0, 3),
      fees: -getRandomInt(1000, 100000),
      distance: Math.random(0, 5),
      cardStatus: 0,
      authNum: 0,
      businessCardName: faker.company.suffixes(),
      riderPhoneNum: faker.phone.phoneNumber(),
      franchiseName: "풀러스김포",
      payAmount: getRandomInt(1000, 100000),
      changes: "",
      riderBelong: "플러스김포",
      receiptAmount: getRandomInt(0, 500),
      franchisePhoneNum: faker.phone.phoneNumber(),
    };
    result.push(Call);
  }
  return result;
};

const createDummyCallApi = (number) => {
  faker.locale = "ko";
  var result = [];
  for (let i = 0; i < number; i++) {
    const Call = {
      arriveReqDate: dateFormat(faker.date.recent()),
      assignDate: dateFormat(faker.date.recent()),
      cancelReason: faker.lorem.sentence(),
      completeDate: dateFormat(faker.date.recent()),
      custMessage: faker.lorem.sentence(),
      custPhone: faker.phone.phoneNumber(),
      deliveryPrice: comma(getRandomInt(10000,100000)),
      deliveryPriceFee: comma(getRandomInt(10000,100000)),
      destAddr1: faker.address.city(),
      destAddr2: faker.address.streetName(),
      destAddr3: faker.address.streetAddress(),
      distance: getRandomInt(0,10),
      frId: shortid.generate(),
      frLatitude: 0,
      frLongitude: 0,
      frName: faker.company.companyName(),
      frPhone: faker.phone.phoneNumber(),
      idx: shortid.generate(),
      itemPrepared: getRandomInt(-1,1),
      itemPreparingTime: getRandomInt(0,20),
      latitude: 0,
      longitude: 0,
      memo: faker.lorem.sentence(),
      ncashPayEnabled: getRandomInt(-1,1),
      orderIdx: shortid.generate(),
      orderPayments: [
        { 
          paymentAmount: comma(getRandomInt(10000,100000)),
          paymentMethod: getRandomInt(0,4),
          paymentStatus: getRandomInt(0,4),
        },
      ],
      orderPrice: comma(getRandomInt(10000,100000)),
      orderStatus: getRandomInt(1,5),
      pickupDate: dateFormat(faker.date.recent()),
      riderName: faker.name.lastName() + faker.name.firstName(),
      riderPhone: faker.phone.phoneNumber(),
      tidNormal: "string",
      tidNormalRate: 0,
      tidPrepay: "string",
      userIdx: shortid.generate(),
    };
    result.push(Call);
  }
  return result;
};

export default createDummyCallApi;
