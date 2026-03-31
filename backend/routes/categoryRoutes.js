const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', adminMiddleware, createCategory); // Admin creates categories
router.get('/', getCategories); // Anyone can view active categories

module.exports = router;
