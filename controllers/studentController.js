const db = require("../db");

const createStudent = (req, res) => {
  const { name, age, grade } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const stmt = db.prepare('INSERT INTO students (name, age, grade, userId) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, age, grade, userId);

    return res.status(201).json({ id: result.lastInsertRowid, name, age, grade });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating student', error: err.message });
  }
};

const updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, age, grade } = req.body;
  const userId = req.user?.id;

  try {
    const stmt = db.prepare('UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ? AND userId = ?');
    const result = stmt.run(name, age, grade, id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Student not found or not yours' });
    }

    return res.status(200).json({ id, name, age, grade });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating student', error: err.message });
  }
};

const getStudents = (req, res) => {
  const userId = req.user?.id;

  try {
    const stmt = db.prepare('SELECT * FROM students WHERE userId = ?');
    const students = stmt.all(userId);

    return res.status(200).json(students);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
};

module.exports = {
  createStudent,
  updateStudent,
  getStudents,
};