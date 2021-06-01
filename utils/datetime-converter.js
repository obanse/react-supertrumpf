

exports.getToday = () => {
  const d = new Date();
  const day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  const month = d.getMonth() + 1;

  return day + "." + month + "." + d.getFullYear();
}

exports.getDate = (date) => {
  const day = date.substr(0,2);
  const month = date.substr(2,2);
  const year = date.substr(4,4);

  return day + "." + month + "." + year;
}

exports.convertDateString2Date = (dateString) => {
  const dateArray = dateString.split('.').reverse();

  return new Date(dateArray);
}
