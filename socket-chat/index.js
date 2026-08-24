const express = require('express')
const app = express()
const { Server } = require('socket.io')
const http = require('http')
const mongoose = require('mongoose')
require('dotenv').config()
const Message = require('./models/Message')

const server = http.createServer(app)
const io = new Server(server)

const PORT = process.env.PORT || 3000

// Serve frontend files from the "public" folder
app.use(express.static('public'))

// Fallback: always serve the chat page for "/"
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("MongoDB Connected!"))
        .catch((err) => console.log('Failed to connect to DB!'))

io.on('connection', async (socket) => {
    console.log('User connected: ', socket.id)

    const messages = await Message.find().sort({ createdAt: 1 })

    socket.emit('chat_history', messages)

    socket.on('join', (username) => {
        socket.username = username

        io.emit('user_joined', `${username} joined the chat!`)
    })

    socket.on('send_message', async (message) => {
        try{
            const newMessage = await Message.create({
                username: socket.username,
                message
            })

            io.emit('new_message', newMessage)
        }catch(err){
            console.log('Error saving to DB: ', err)
        }
    })

    socket.on('disconnect', () => {
        if(socket.username){
            io.emit('user_left', `${socket.username} left the chat!`)
        }
    })
})

server.listen(3001, () => {
    console.log("Server is running at port: 3001")
})