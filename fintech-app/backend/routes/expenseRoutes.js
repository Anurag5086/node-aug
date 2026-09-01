const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getIncomesByUserId, getIncomeById, createIncome, updateIncome, deleteIncome } = require('../controllers/incomeController')
const router = express.Router()

router.get('/user-expenses', authMiddleware, getExpensesByUserId)
router.get('/get-expense/:id', authMiddleware, getExpenseById)
router.get('/get-expense-by-category/:categoryId', authMiddleware, getExpenseByCategoryId)
router.post('/create-expense', authMiddleware, createExpense)
router.put('/update-expense/:id', authMiddleware, updateExpense)
router.delete('/delete-expense/:id', authMiddleware, deleteExpense)

module.exports = router