const Comment = require('../models/Comment')
var uuid = require('uuid');

exports.getAllComments = async (req, res) => {
    try{
        const comments = await Comment.find()
        if(comments.length < 1){
            res.status(404).json({ success: false, message: "Comments not found!"})
        }

        res.status(200).json({ success: true, message: "Comments fetched successfully!", comments })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server error!" })
    }
}

exports.getCommentById = async (req, res) => {
    try{
        const commentId = req.params.id

        const comment = await Comment.findById(commentId)
        if(!comment){
            res.status(404).json({ success: false, message: "Comment not found!"})
        }

        res.status(200).json({ success: true, message: "Comment fetched successfully!", comment })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server error!" })
    }
}

exports.createComment = async (req, res) => {
    try{
        const { username, comment } = req.body

        const commentUuid = uuid.v4()

        const newComment = new Comment({
            commentId: commentUuid,
            username,
            comment
        })

        await newComment.save()

        res.status(201).json({ success: true, message: "Comment created successfully!", comment: newComment })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server error!" })
    }
}

exports.updateCommentById = async (req, res) => {
    try{
        const commentId = req.params.id
        const { username, comment } = req.body

        const commentData = await Comment.findById(commentId)
        if(!commentData){
            res.status(404).json({ success: false, message: "Comment not found!"})
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { username, comment }, { new: true })

        res.status(200).json({ success: true, message: "Comment updated successfully!", comment: updatedComment })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server error!" })
    }
}

exports.deleteComment = async (req, res) => {
    try{
        const commentId = req.params.id

        const comment = await Comment.findById(commentId)
        if(!comment){
            res.status(404).json({ success: false, message: "Comment not found!"})
        }

        await Comment.findByIdAndDelete(commentId)

        res.status(200).json({ success: true, message: "Comment deleted successfully!" })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server error!" })
    }
}