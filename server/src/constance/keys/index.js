const fs = require('fs');
const path = require('path');

const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, 'private.key'));
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, 'public.key'));

module.exports = {
  PRIVATE_KEY,
  PUBLIC_KEY,
};
