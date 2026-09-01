const Income = require('../models/Income')
const joi = require('joi')

exports.getIncomesByUserId = async (req, res) => {
    try{
        const userId = req.user.userId

        const incomeSources = await Income.find({ userId })        
        if(incomeSources.length < 1){
            res.status(404).json({ success: false, message: "Income sources not found!" })
        }

        res.status(200).json({ success: true, message: "Income sources fetched successfully!", incomeSources })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error!" , error: err})
    }
}

exports.getIncomeById = async (req, res) => {
    try{
        const incomeId = req.params.id

        const income = await Income.findById(incomeId)
        if(!income){
            res.status(404).json({ success: false, message: "Income not found!"})
        }

        res.status(200).json({ success: true, message: "Income fetched successfully!", income })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error!" , error: err})
    }
}

exports.createIncome = async (req, res) => {
    try{
        const { userId, amount, source, remark } = req.body

        const schema = joi.object({
            userId: joi.string().required(),
            amount: joi.number().min(0).required(),
            source: joi.string().trim().required(),
            remark: joi.string().trim().max(200).optional()
        })

        const { error } = schema.validate({userId, amount, source, remark})
        if(error){
            res.status(400).json({ success: false, message: "Invalid Input!" })
        }

        const newIncome = new Income({
            userId,
            amount,
            source,
            remark
        })

        await newIncome.save()

        res.status(201).status({ success: true, message: "Income added successfully!", income: newIncome })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error!" , error: err})
    }
}

exports.updateIncome = async (req, res) => {
    try{
        const incomeId = req.params.id
        const { amount, source, remark } = req.body

        const schema = joi.object({
            userId: joi.string().optional(),
            amount: joi.number().min(0).optional(),
            source: joi.string().trim().optional(),
            remark: joi.string().trim().max(200).optional()
        })

        const { error } = schema.validate({amount, source, remark})
        if(error){
            res.status(400).json({ success: false, message: "Invalid Input!" })
        }

        const income = await Income.findById(incomeId)
        if(!income){
            res.status(404).json({ success: false, message: "Income not found!"})
        }

        const updatedIncome = await Income.findByIdAndUpdate(incomeId, req.body, { new: true })

        res.status(201).status({ success: true, message: "Income updated successfully!", updatedIncome })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error!" , error: err})
    }
}

exports.deleteIncome = async (req, res) => {
    try{
        const incomeId = req.params.id
        
        const income = await Income.findById(incomeId)
        if(!income){
            res.status(404).json({ success: false, message: "Income not found!"})
        }
        
        await Income.findByIdAndDelete(incomeId)

        res.status(201).status({ success: true, message: "Income deleted successfully!" })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error!" , error: err})
    }
}