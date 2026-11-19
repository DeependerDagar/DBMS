const express = require('express');
const router = express.Router();
const {
  addMovie,
  deleteMovie,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');

// Movies CRUD
router.post('/movies', addMovie);
router.delete('/movies/:id', deleteMovie);

// User Roles Management
router.get('/users', getAllUsers);
router.post('/users/role', updateUserRole);

module.exports = router;