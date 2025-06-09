require('dotenv').config();
const express = require('express');
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const app = express();
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const db = require('./db');

app.use(cors());
app.use(express.json());

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// Upload route
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Photo uploaded successfully',
    location: filePath,
  });
});

// Your existing routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
