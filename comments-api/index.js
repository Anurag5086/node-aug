const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const commentRoutes = require('./routes/commentRoutes')

app.use(express.json())
app.use('/api', commentRoutes)

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("MongoDB Connected!"))
        .catch((err) => console.log("Error Connecting to MongoDB!", err))

app.listen(3000, () => {
    console.log('Server is running at PORT: 3000')
})