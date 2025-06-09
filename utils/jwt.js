// utils/jwt.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'my_secret_key';

const generateToken = (payload) => {
  return jwt.sign(payload, secret);
};

module.exports = { generateToken };