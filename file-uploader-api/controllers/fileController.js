const File = require('../models/File')
const joi = require('joi')

exports.uploadFile = async (req, res) => {
    try{
        if(!req.file){
            res.status(400).json({ success: false, message: "No File Uploaded!" })
        }

        const { title, description } = req.body

        const schema = joi.object({
            title: joi.string().min(3).max(200).trim().required(),
            description: joi.string().min(3).max(500).trim().required()
        })

        const { error } = schema.validate({ title, description })
        if(error){
            res.status(400).json({ success: false, message: "Invalid Inpt!" , error })
        }

        const newFile = new File({
            title,
            description,
            filePath: req.file.path
        })

        await newFile.save()

        res.status(201).json({ success: true, message: "File uploaded successfully!", file: newFile })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error!"})
    }
}