const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, subCategoryController.getSubCategories);
router.post('/', [authMiddleware, adminMiddleware], subCategoryController.createSubCategory);
router.put('/:id', [authMiddleware, adminMiddleware], subCategoryController.updateSubCategory);
router.delete('/:id', [authMiddleware, adminMiddleware], subCategoryController.deleteSubCategory);

module.exports = router;
