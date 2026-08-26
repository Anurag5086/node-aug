const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const fileRoutes = require('./routes/fileRoutes')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

// Security Middlewares
app.use(helmet())
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST']
}))

app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5
}))

app.use('/api/file', fileRoutes)
app.use('/uploads', express.static('uploads'))

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB!'))
        .catch((err) => console.log('Failed to connect to DB.', err))

app.listen(process.env.PORT, () => {
    console.log("Server is running at PORT: ", process.env.PORT)
})