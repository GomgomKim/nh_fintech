import Axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import util from "util";
import Const from "../const";
let loadingCount = 0;

global.language = "ko";
global.lanList = ["ko", "en", "ja", "zh"];

const serverUrl =
  Const.serverProtocol + "://" + Const.serverIp + ":" + Const.serverPort;

const makeUrl = (url, params) => {
  var result = serverUrl + url;
  if (params === null) return result;
  params.forEach((param) => {
    result = util.format(result, param);
  });
  return result;
};

const httpExecWithNoLoading = (method, url, data) => {
  return new Promise((resolve, reject) => {
    Axios({
      method: method,
      url: url,
      data: data,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        if (error.message.includes("401")) {
          // alert("로그인이 만료되었습니다. 다시 로그인해주세요");
          reactLocalStorage.remove("adminUser");
          global.location.href = "/";
        }
        reject(error);
      });
  });
};

const httpExec = (method, url, data) => {
  loadingCount++;
  if (loadingCount === 1)
    global.document.getElementById("loadingSpinner").style.display = "block";

  return new Promise((resolve, reject) => {
    Axios({
      method: method,
      url: url,
      data: data,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // if (
        //   url === serverUrl + httpUrl.login ||
        //   url === serverUrl + httpUrl.logout
        // ) {
        // } else {
        //   if (
        //     (method === 'PUT' || method === 'POST' || method === 'DELETE') &&
        //     response.data.result === 'SUCCESS'
        //   ) {
        //     alert('완료');
        //   }
        // }
        resolve(response.data);
        loadingCount--;
        if (loadingCount === 0)
          global.document.getElementById("loadingSpinner").style.display =
            "none";
      })
      .catch((error) => {
        // console.log(JSON.stringify(error, null, 4));
        if (error.message.includes("401")) {
          // alert("로그인이 만료되었습니다. 다시 로그인해주세요");
          reactLocalStorage.remove("adminUser");
          global.location.href = "/";
        }
        // if (error.response.data.message === 'E10003') {
        //   if (!isAlertOpened) {
        //     isAlertOpened = true;
        //     alert('장기간 미사용으로 자동 로그아웃 되었습니다.');
        //     global.location.href = '/';
        //   }
        // } else if (error.response.data.data === 'E10003') {
        //   if (!isAlertOpened) {
        //     isAlertOpened = true;
        //     alert('접근 권한이 없습니다. 로그인 해주세요.');
        //     global.location.href = '/';
        //   }
        // }
        // alert(JSON.stringify(error));
        reject(error);
        loadingCount--;
        if (loadingCount === 0)
          global.document.getElementById("loadingSpinner").style.display =
            "none";
      });
  });
};

const httpGet = (url, params, data) => {
  console.log(makeUrl(url, params));
  return httpExec("GET", makeUrl(url, params), data);
  // return new Promise((resolve, reject) => {
  //   Axios.get(makeUrl(url, params), data)
  //     .then(response => {
  //       resolve(response.data);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     });
  // });
};

const httpPut = (url, params, data) => {
  return httpExec("PUT", makeUrl(url, params), data);
  // return new Promise((resolve, reject) => {
  //   Axios.put(makeUrl(url, params), data)
  //     .then(response => {
  //       resolve(response.data);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     });
  // });
};

const httpDelete = (url, params, data) => {
  return httpExec("DELETE", makeUrl(url, params), data);
};

const httpPost = (url, params, data) => {
  console.log(makeUrl(url, params));
  return httpExec("POST", makeUrl(url, params), data);
  // return new Promise((resolve, reject) => {
  //   Axios.post(makeUrl(url, params), data)
  //     .then(response => {
  //       resolve(response.data);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     });
  // });
};

const httpPostWithNoLoading = (url, params, data) => {
  return httpExecWithNoLoading("POST", makeUrl(url, params), data);
  // return new Promise((resolve, reject) => {
  //   Axios.post(makeUrl(url, params), data)
  //     .then(response => {
  //       resolve(response.data);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     });
  // });
};
const httpGetWithNoLoading = (url, params, data) => {
  return httpExecWithNoLoading("GET", makeUrl(url, params), data);
  // return new Promise((resolve, reject) => {
  //   Axios.post(makeUrl(url, params), data)
  //     .then(response => {
  //       resolve(response.data);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     });
  // });
};

const httpDownload = (url, params, data) => {
  // return httpExec('GET', makeUrl(url, params), data);
  return new Promise((resolve, reject) => {
    Axios({
      method: "GET",
      url: makeUrl(url, params),
      data: data,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    })
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        resolve(blob);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const imageUrl = (idx) => {
  return serverUrl + "/file/" + idx;
};

const httpUrl = {
  login: "/login",
  logout: "/logout",

  // 접수 현황
  receptionStatusList: "/order/assignList?pageSize=%s&pageNum=%s",

  // 주문 현황
  orderList: "/order/list",
  orderUpdate: "/order/update",
  orderCreate: "/order/create",
  orderComplete: "/order/complete",
  getDeliveryPrice:
    "/fr/expectDeliveryPrice?frIdx=%s&destLatitude=%s&destLongitude=%s",
  completedCount: "/order/count/completed?selectedDate=%s",
  canceledCount: "/order/count/canceled?selectedDate=%s",

  // 주문 상태 변경
  orderAssignCancel: "/order/admin/admin/assignRiderCancel",
  orderPickup: "/order/pickup",
  orderPickupCancel: "/order/pickupCancel",
  orderComplete: "/order/complete",
  orderCancel: "/order/cancel",
  orderCompleteRestore: "/order/complete/restore",

  priceExtraList: "/branch/deliveryPriceExtra/list?pageNum=%s&pageSize=%s",
  priceExtraRegist: "/branch/deliveryPriceExtra/create",
  priceExtraUpdate: "/branch/deliveryPriceExtra/update",
  priceExtraDelete: "/branch/deliveryPriceExtra/delete/{idx}?idx=%s",
  priceExtraGroupList: "/fr/settingGroup/list",
  priceExtraRegistGroup: "/fr/settingGroup/create",
  priceExtraDeleteGroup: "/fr/settingGroup/delete",

  // 직원 관리
  staffList: "/rider/list?pageSize=%s&pageNum=%s&riderLevels=%s&userStatus=%s",
  registStaff: "/rider/create",
  staffUpdate: "/rider/update",

  // 라이더 위치
  getGeocode: "/geometry/geocode/%s",

  // 예상 배달요금
  expectDeliveryPrice:
    "/fr/expectDeliveryPrice?destLatitude=%s&destLongitude=%s",

  // rider
  riderTotalList: "/rider/list",
  riderList:
    "/rider/list?pageSize=%s&pageNum=%s&searchName=%s&userStatus=%s&riderLevels=%s&riderStatus=%s",
  registRider: "/rider/create",
  updateRider: "/rider/update",
  riderListOne: "/rider/list",
  riderLocateList: "/rider/location/list",
  riderLocate: "/rider/location/%s",
  riderBatchWorkList: "/rider/batchWork/list",
  riderBatchWorkCreate: "/rider/batchWork/create",
  riderBatchWorkUpdate: "/rider/batchWork/update",
  riderBatchWorkDelete: "/rider/batchWork/delete",
  userBatchWorkCreate: "/rider/userBatchWork/create",
  userBatchWorkDelete: "/rider/userBatchWork/delete",
  riderBatchWorkDailyList: "/rider/daily/list?kind=%s&pageNum=%s&pageSize=%s",
  clearWithdrawPassword: "/rider/clear/withdraw-password",
  ncashList: "/ncash/list?category=%s&pageNum=%s&pageSize=%s&userIdx=%s",

  // 배차
  assignRiderAdmin: "/order/admin/assignRider",
  assignRiderCancel: "/order/admin/admin/assignRiderCancel",
  getAssignedRider: "/order/assignList",

  // 가맹점 관리
  registFranchise: "/fr/create",
  franchiseList: "/fr/list",
  franchiseUpdate: "/fr/update",
  frAccount: "/fr/account/create",

  // 지점 수정
  updateBranch: "/branch/update",

  // 공지사항
  noticeList: "/notice/list?deleted=%s&pageNum=%s&pageSize=%s",
  registNotice: "/notice/create",
  updateNotice: "/notice/update",
  specificNoticeList: "/notice/%s",
  smsSendFran: "/sms/all/create",

  // 블라인드
  blindList: "/rider/admin/block/list",
  registBlind: "/rider/admin/block/create",
  deleteBlind: "/rider/admin/block/delete",
  statusBlind: "/rider/block/update",
  blindAllList:
    "/rider/block/all/list?deletedList=%s&direction=%s&pageNum=%s&pageSize=%s",

  // 채팅
  chatList: "/chat/chatList?pageSize=%s&pageNum=%s&searchName=%s",
  chatListByUser:
    "/chat/chatList?pageSize=%s&pageNum=%s&searchName=%s&receiveUserIdx=%s",
  chatMessageList: "/chat/messageList?pageSize=%s&pageNum=%s&chatRoomIdx=%s",
  chatSend: "/chat/send",
  chatRoom: "/chat/chatroom?receiveUserIdx=%s",

  // 주소검색관리
  getAddrAptList:
    "/order/addrAptList?addrType=%s&pageNum=%s&pageSize=%s&searchDong=%s",
  createAddrApt: "/branch/addrApt/create",
  deleteAddrApt: "/branch/addrApt/delete",
  updateAddrApt: "/branch/addrApt/update",

  // 패스워드 변경
  changePassword: "/user/changePassword",

  // 지점조회
  getBranch: "/branch/%s",

  // 바이크
  createBike: "/bike/create",
  getBikeList: "/bike/list?modelName=%s&pageNum=%s&pageSize=%s",
  getBikeListNoModelName: "/bike/list?pageNum=%s&pageSize=%s",

  // 상품관리
  buyList: "/mall/buyList?pageNum=%s&pageSize=%s",
  updateBuy: "/mall/buyProduct/update",

  // 라이더 전체메세지
  riderMessageAll: "/chat/send/allRider",

  // 기사그룹
  getRiderGroup: "/rider/settingGroup/list",
  updateRiderGroup: "/rider/settingGroup/update",

  // PG연동
  createUserWallet: "/payment/wallet/create/user/%s",

  // 배송가능지역
  getAddrBranch: "/branch/addrBranch/list?pageNum=%s&pageSize=%s",
  branchAddrDeliveryList: "/branch/addrDelivery/list??pageNum=%s&pageSize=%s",
  updateAddrBranch: "/branch/addrBranch/update",
  updateAddrDelivery: "/branch/addrDelivery/update",

  // VAN등록요청 - 파일업로드
  FileUpload: "/file/upload",
};

const imageType = ["image/jpeg", "image/png", "image/bmp"];

export {
  serverUrl,
  httpExec,
  makeUrl,
  httpGet,
  httpUrl,
  httpPut,
  httpPost,
  httpDelete,
  httpDownload,
  imageType,
  imageUrl,
  httpPostWithNoLoading,
  httpGetWithNoLoading,
};

