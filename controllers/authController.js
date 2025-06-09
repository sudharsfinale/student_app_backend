const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  const { name, phoneNumber, password } = req.body;

  if (!name || !phoneNumber || !password)
    return res.status(400).json({ message: 'All fields required' });

  const userExists = db.prepare('SELECT * FROM users WHERE phoneNumber = ?').get(phoneNumber);
  if (userExists)
    return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const stmt = db.prepare('INSERT INTO users (name, phoneNumber, password) VALUES (?, ?, ?)');
  const info = stmt.run(name, phoneNumber, hashedPassword);

  const token = generateToken({ id: info.lastInsertRowid, phoneNumber });

  return res.status(201).json({
    user: { id: info.lastInsertRowid, name, phoneNumber },
    token,
  });
};

const login = async (req, res) => {
  const { identifier, password } = req.body; // 'identifier' can be name or phoneNumber

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required' });
  }

  // Try to find user by phoneNumber or by name
  const user = db.prepare('SELECT * FROM users WHERE phoneNumber = ? OR name = ?').get(identifier, identifier);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, phoneNumber: user.phoneNumber });

  res.json({
    user: { id: user.id, name: user.name, phoneNumber: user.phoneNumber },
    token,
  });
};

const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json({ verified: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Query the user by ID (using better-sqlite3)
    const user = db.prepare('SELECT id, name, phoneNumber FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(200).json({ verified: false, message: 'User not found' });
    }

    return res.status(200).json({
      verified: true,
      token,
      decoded,
      user,
    });
  } catch (error) {
    return res.status(200).json({ verified: false, message: 'Invalid or expired token' });
  }
};

module.exports = {register, login, verifyToken}