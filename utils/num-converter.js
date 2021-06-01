

exports.getLom5 = lom => {
  let _lom5 = lom.toString().slice(-5);
  return ("00000" + _lom5).slice(-5);
}
