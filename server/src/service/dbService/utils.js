const isDb = db => db && typeof db === 'string';

const objNotEmpty = obj => obj && Object.keys(obj).length;

const deleteEmptyField = obj => {
  const newObj = { ...obj };
  Object.keys(obj).forEach(key => {
    if (!obj[key]) {
      delete newObj[key];
    }
  });
  return newObj;
};

module.exports = {
  isDb,
  objNotEmpty,
  deleteEmptyField
};
