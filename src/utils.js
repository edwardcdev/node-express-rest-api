exports.isNullOrUndefined = (val) => val === null || val === undefined;

const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;
exports.isValidDate = (dateString) => {
  if (!dateString.match(dateRegEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
};
