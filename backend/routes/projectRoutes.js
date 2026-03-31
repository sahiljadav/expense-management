const express = require('express');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', adminMiddleware, createProject);
router.put('/:id', adminMiddleware, updateProject);
router.delete('/:id', adminMiddleware, deleteProject);

module.exports = router;
