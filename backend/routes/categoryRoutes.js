const express = require('express');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', adminMiddleware, createCategory); // Admin creates categories
router.get('/', getCategories); // Anyone can view active categories
router.put('/:id', adminMiddleware, updateCategory); // Admin updates categories
router.delete('/:id', adminMiddleware, deleteCategory); // Admin deletes categories

module.exports = router;
