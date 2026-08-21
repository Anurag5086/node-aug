const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    commentId: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        trim: true 
    },
}, { timestamps: true })

module.exports = mongoose.model('comments', commentSchema)