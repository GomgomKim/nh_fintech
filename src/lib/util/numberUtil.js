
const comma = (a) => {
  if (!a) return 0;
  if (a == 0 || a == "0") return 0;
  var parts = a.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
}

export { comma };