const db = require("../db");

const createStudent = (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extract fields from body
  const {
    name, grade = "", schoolName, bloodGroup, fatherName,
    motherName, parentContact, addressOne, addressTwo,
    city, state, zip, emergencyContact, location, imageUrl
  } = req.body;

  try {
    // Start building data object with required userId
    const data = {
      name,
      grade,
      schoolName,
      bloodGroup,
      fatherName,
      motherName,
      parentContact,
      addressOne,
      addressTwo,
      city,
      state,
      zip,
      emergencyContact,
      imageUrl,
      location: location ? JSON.stringify(location) : undefined,
      userId
    };

    // Remove undefined/null keys
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
    );

    const fields = Object.keys(filteredData);
    const values = Object.values(filteredData);
    const placeholders = fields.map(() => '?').join(', ');

    const sql = `INSERT INTO students (${fields.join(', ')}) VALUES (${placeholders})`;
    const stmt = db.prepare(sql);
    const result = stmt.run(...values);

    return res.status(201).json({ id: result.lastInsertRowid, ...filteredData });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating student', error: err.message });
  }
};

const updateStudent = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const {
      name, age, grade, schoolName, bloodGroup, fatherName,
      motherName, parentContact, addressOne, addressTwo,
      city, state, zip, emergencyContact, location
    } = req.body;

    // Build update data
    const data = {
      name,
      age,
      grade,
      schoolName,
      bloodGroup,
      fatherName,
      motherName,
      parentContact,
      addressOne,
      addressTwo,
      city,
      state,
      zip,
      emergencyContact,
      location: location ? JSON.stringify(location) : undefined,
      imageURL
    };

    // Filter out undefined or null values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
    );

    // If no fields to update
    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    const setClause = Object.keys(filteredData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(filteredData), id, userId];

    const sql = `UPDATE students SET ${setClause} WHERE id = ? AND userId = ?`;
    const stmt = db.prepare(sql);
    const result = stmt.run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Student not found or not yours' });
    }

    return res.status(200).json({ id, ...filteredData });
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

const getStudentById = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM students WHERE id = ? AND userId = ?');
    const student = stmt.get(id, userId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found or not yours' });
    }

    // If `location` is stored as JSON string, parse it:
    if (student.location) {
      try {
        student.location = JSON.parse(student.location);
      } catch (_) {}
    }

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get student', error: error.message });
  }
};

const deleteStudent = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const stmt = db.prepare('DELETE FROM students WHERE id = ? AND userId = ?');
    const result = stmt.run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Student not found or not yours' });
    }

    return res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
};

module.exports = {
  createStudent,
  updateStudent,
  getStudents,
  getStudentById,
  deleteStudent
};