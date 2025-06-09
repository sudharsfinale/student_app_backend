const express = require('express');
const router = express.Router();
const { createStudent, updateStudent, getStudents } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createStudent', authMiddleware, createStudent);
router.put('/updateStudent/:id',authMiddleware, updateStudent);
router.get('/getStudents',authMiddleware, getStudents);

module.exports = router;