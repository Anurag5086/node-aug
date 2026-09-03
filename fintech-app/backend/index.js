const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
dotenv.config()
const authRoutes = require('./routes/authRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const incomeRoutes = require('./routes/incomeRoutes')
const categoryRoutes = require('./routes/categoryRoutes')

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}))
app.use(cookieParser())

// routes
app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/incomes', incomeRoutes)
app.use('/api/categories', categoryRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
})