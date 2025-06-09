const express = require('express');
const router = express.Router();
const { createStudent, updateStudent, getStudents, deleteStudent, getStudentById } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createStudent', authMiddleware, createStudent);
router.put('/updateStudent/:id',authMiddleware, updateStudent);
router.get('/getStudents',authMiddleware, getStudents);
router.get('/getStudentById/:id',authMiddleware, getStudentById);
router.delete('/deleteStudent/:id',authMiddleware, deleteStudent);

module.exports = router;