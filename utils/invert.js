const toString = Object.prototype.toString;

module.exports = (object) => {
  const result = {};
  Object.keys(object).forEach((key) => {
    let value = object[key];
    if (value != null && typeof value.toString !== 'function') {
      value = toString.call(value);
    }
    result[value] = key;
  });
  return result;
};
