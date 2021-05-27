
const formatDateNumber = num => {
  num += "";
  return num.length < 2 ? "0" + num : num;
};

const formatDate = date => {
  // if (date === null) return '-';
  if (!date) return null;
  let newDate = new Date(date);
  return (
    newDate.getFullYear() +
    "-" +
    formatDateNumber(newDate.getMonth() + 1) +
    "-" +
    formatDateNumber(newDate.getDate()) +
    " " +
    formatDateNumber(newDate.getHours()) +
    ":" +
    formatDateNumber(newDate.getMinutes())
  );
  // let day = date.slice(0, 10);
  // let second = date.slice(11, 16);
  // return day + " " + second;
};

const formatDateSecond = date => {
  // if (date === null) return '-';
  if (!date) return null;
  let newDate = new Date(date);
  // let day = date.slice(0, 10);
  // let second = date.slice(11, 16);
  // let result2 = day + " " + second;
  let result =
    newDate.getFullYear() +
    "-" +
    formatDateNumber(newDate.getMonth() + 1) +
    "-" +
    formatDateNumber(newDate.getDate()) +
    " " +
    formatDateNumber(newDate.getHours()) +
    ":" +
    formatDateNumber(newDate.getMinutes()) +
    ":" +
    formatDateNumber(newDate.getSeconds());
  // console.log(`prevResult: ${result} current:${result2}`);
  return result;
};

const dateFormat = date => {
  if (!date) return null;
  let hour = parseInt(date / 60);
  let minute = date % 60;
  return hour === 0
    ? minute + "분"
    : minute === 0
    ? hour + "시간"
    : hour + "시간 " + minute + "분";
};

const minFormat = date => {
  if (!date) return null;
  let newDate = new Date(date);
  let hour = newDate.getHours() * 60;
  let min = parseInt(newDate.getMinutes());
  let time = hour + min;
  // console.log(time);
  return time;
};

const dayFormat = date => {
  if (!date) return null;
  // console.log(date);
  for (let i = 0; i < date.length; i++) {
    // console.log(date);
    let year = date.substr(0, 4);
    let month = date.substr(4, 2);
    let day = date.substr(6, 2);
    // return new Date(year, month, day);
    let time = year + "-" + month + "-" + day;
    return time;
  }
};

const monthFormat = date => {
  if (!date) return null;
  // console.log(date);
  for (let i = 0; i < date.length; i++) {
    // console.log(date);
    let year = date.substr(0, 4);
    let month = date.substr(4, 2);
    // return new Date(year, month, day);
    let time = year + "-" + month;
    return time;
  }
};

const startDateFormat = date => {
  if (!date) return null;
  let newDate = new Date(date);
  return (
    newDate.getFullYear() +
    "-" +
    formatDateNumber(newDate.getMonth() + 1) +
    "-" +
    formatDateNumber(newDate.getDate()) +
    " 00:00:00"
  );
};

const endDateFormat = date => {
  if (!date) return null;
  let newDate = new Date(date);
  return (
    newDate.getFullYear() +
    "-" +
    formatDateNumber(newDate.getMonth() + 1) +
    "-" +
    formatDateNumber(newDate.getDate()) +
    " 23:59:59"
  );
};

const statFormat = date => {
  if (!date) return null;
  let newDate = new Date(date);
  return (
    newDate.getFullYear() +
    formatDateNumber(newDate.getMonth() + 1) +
    formatDateNumber(newDate.getDate())
  );
};

const statMonthFormat = date => {
  if (!date) return null;
  let newDate = new Date(date);
  return newDate.getFullYear() + formatDateNumber(newDate.getMonth() + 1);
};

const formatDateUnit = num => {
  num += "";
  return num.length < 2 ? "0" + num : num;
};


const formatYMD = date => {
  if (!date) return null;
  if (date instanceof Date) {
  }
  else {
    date = new Date((date + '').substring(0, 19));
  }
  return (
    date.getFullYear() +
    "-" +
    formatDateUnit(date.getMonth() + 1) +
    "-" +
    formatDateUnit(date.getDate())
  );
}

const formatYMDHMS = date => {
  if (!date) return null;
  if (date instanceof Date) {
  }
  else {
    date = new Date((date + '').substring(0, 19));
  }
  return (
    date.getFullYear() +
    "-" +
    formatDateUnit(date.getMonth() + 1) +
    "-" +
    formatDateUnit(date.getDate()) +
    " " +
    formatDateUnit(date.getHours()) +
    ":" +
    formatDateUnit(date.getMinutes()) +
    ":" +
    formatDateUnit(date.getSeconds())
  );
}



export {
  formatDate,
  formatDateSecond,
  dateFormat,
  minFormat,
  dayFormat,
  monthFormat,
  startDateFormat,
  endDateFormat,
  statFormat,
  statMonthFormat,
  formatYMD,
  formatYMDHMS,
};
