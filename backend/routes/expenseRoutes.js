const express = require('express');
const { createExpense, getExpenses, getDashboardSummary, updateExpense, deleteExpense, getAllTransactions } = require('../controllers/expenseController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/all', getAllTransactions);
router.get('/summary', getDashboardSummary);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
