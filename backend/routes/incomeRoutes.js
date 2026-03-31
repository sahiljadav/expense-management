const express = require('express');
const { createIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createIncome);
router.get('/', getIncomes);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

module.exports = router;
