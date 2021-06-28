const comma = (a) => {
  if (!a) return 0;
  if (a === 0 || a === "0") return 0;
  var parts = a.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
};

const remainTime = (reqDate) => {
  if (!reqDate) return 0;
  if (reqDate.indexOf('T') < 0) {
    reqDate = reqDate.replace(' ', 'T') + '+09:00'
  }
  return parseInt((new Date(reqDate).getTime() - new Date().getTime()) / 60000);
}

export { comma, remainTime };
