
import moment from "moment";
const comma = (a) => {
  if (!a) return 0;
  if (a === 0 || a === "0") return 0;
  var parts = a.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
};

const remainTime = (orderDate, arriveReqTime) => {
  const arriveReqDate = moment(orderDate).add(arriveReqTime, 'minutes');
  const time = arriveReqDate.diff(moment(), 'minutes');
  return time;
}

export { comma, remainTime };
