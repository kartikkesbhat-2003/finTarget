const express = require('express');
const router = express.Router();
const { createTask } = require('../controllers/taskController');

router.post('/task', createTask);

module.exports = router;
