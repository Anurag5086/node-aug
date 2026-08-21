const express = require('express')
const { getAllComments, getCommentById, createComment, updateCommentById, deleteComment } = require('../controllers/commentController')
const router = express.Router()

router.get('/comments', getAllComments)
router.get('/comment/:id', getCommentById)
router.post('/comment', createComment)
router.put('/comment/:id', updateCommentById)
router.delete('/comment/:id', deleteComment)

module.exports = router