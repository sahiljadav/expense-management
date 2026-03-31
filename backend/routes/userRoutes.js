const express = require('express');
const { getExpenses, getDashboardSummary, getAllTransactions, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { createIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// All user routes are protected by auth middleware
router.use(authMiddleware);

// Dashboard
router.get('/summary', getDashboardSummary);
router.get('/transactions', getAllTransactions);

// Expenses
router.get('/expenses', getExpenses);
router.post('/expenses', createExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// Incomes
router.get('/incomes', getIncomes);
router.post('/incomes', createIncome);
router.put('/incomes/:id', updateIncome);
router.delete('/incomes/:id', deleteIncome);

module.exports = router;
