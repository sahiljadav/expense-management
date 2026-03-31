const express = require('express');
const { getExpenses, getDashboardSummary, getAllTransactions, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { getPeople, createPerson, updatePerson, deletePerson } = require('../controllers/peopleController');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// All admin routes are protected by auth and admin middleware
router.use(authMiddleware, adminMiddleware);

// Dashboard
router.get('/summary', getDashboardSummary);
router.get('/transactions', getAllTransactions);

// Expenses
router.get('/expenses', getExpenses);
router.post('/expenses', createExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// People/Users
router.get('/people', getPeople);
router.post('/people', createPerson);
router.put('/people/:id', updatePerson);
router.delete('/people/:id', deletePerson);

// Projects
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
