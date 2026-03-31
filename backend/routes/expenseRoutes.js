const express = require('express');
const { createExpense, getExpenses, getDashboardSummary } = require('../controllers/expenseController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/summary', getDashboardSummary);

module.exports = router;
