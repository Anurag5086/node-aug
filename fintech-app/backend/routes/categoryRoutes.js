const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/get-category/:id', authMiddleware, getCateogryById)
router.get('/get-categories', authMiddleware, getCategories)
router.post('/create-category', authMiddleware, createCategory)
router.put('/update-category/:id', authMiddleware, updateCategory)
router.delete('/delete-category/:id', authMiddleware, deleteCategory)

module.exports = router;