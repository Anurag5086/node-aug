const express = require('express')
const { uploadFile } = require('../controllers/fileController')
const upload = require('../middlewares/multerMiddleware')
const router = express.Router()
const rateLimit = require('express-rate-limit')

const ratelimitUpload = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5
})

router.post('/upload',ratelimitUpload , upload.single('file'), uploadFile)

module.exports = router